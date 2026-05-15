import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Link from 'next/link'
import api from '../../lib/api'

export default function DiscussionDetail() {
  const router = useRouter()
  const { token } = useContext(AuthContext)
  const [data, setData] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (router.query.id) {
      const fetchDiscussion = async () => {
        try {
          const res = await api.get(`/discussions/${router.query.id}`)
          setData(res.data)
        } catch (err) {
          setError('Gagal memuat diskusi')
          console.error('Error fetching discussion:', err)
        } finally {
          setLoading(false)
        }
      }

      fetchDiscussion()
    }
  }, [router.query.id])

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      if (!token) {
        router.push('/login')
        return
      }

      if (!comment.trim()) {
        setError('Komentar tidak boleh kosong')
        return
      }

      await api.post('/comments', {
        discussionId: router.query.id,
        content: comment
      })

      setComment('')

      const res = await api.get(`/discussions/${router.query.id}`)
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan komentar')
      console.error('Error submitting comment:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-center text-gray-600">Diskusi tidak ditemukan</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Kembali ke Daftar
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {data.mode}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{data.content}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            <span className="font-semibold">{data.user.profile.username}</span>
            {data.user.isVerifiedExpert && (
              <span className="ml-2 text-green-600 font-semibold">✔ Expert</span>
            )}
          </div>
          <span>{data.category?.name}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Komentar ({data.comments?.length || 0})</h2>

        {data.comments && data.comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {data.comments.map((c) => (
              <div key={c.id} className="card">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-semibold">{c.user.email}</span>
                    {c.user.isVerifiedExpert && (
                      <span className="ml-2 text-green-600 text-sm">✔ Expert</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="text-gray-700">{c.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">Belum ada komentar</p>
        )}

        {token ? (
          <form onSubmit={submit} className="bg-white rounded-lg border border-gray-200 p-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                {error}
              </div>
            )}

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tulis komentar Anda..."
              className="form-input w-full h-24 mb-3"
              disabled={submitting}
            />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setComment('')}
                className="btn-secondary"
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Mengirim...' : 'Kirim Komentar'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-center">
            <Link href="/login" className="hover:underline font-semibold">
              Login
            </Link>
            {' '}untuk menambahkan komentar
          </div>
        )}
      </div>

      <div className="text-center">
        <Link href={`/report?targetId=${data.id}`}>
          <button className="btn-danger">🚩 Laporkan Diskusi</button>
        </Link>
      </div>
    </div>
  )
}
