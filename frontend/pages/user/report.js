import { useRouter } from 'next/router'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import api from '../../lib/api'

const TYPE_LABELS = {
  discussion: 'Diskusi',
  comment: 'Komentar',
  user: 'Pengguna',
}

export default function Report() {
  const router = useRouter()
  const { token, loading: authLoading } = useContext(AuthContext)

  const [type, setType] = useState('discussion')
  const [targetId, setTargetId] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Sinkron dari query param setelah router siap (router.query kosong di render pertama)
  useEffect(() => {
    if (!router.isReady) return
    const qType = router.query.type
    if (qType && TYPE_LABELS[qType]) setType(qType)
    if (router.query.targetId) setTargetId(String(router.query.targetId))
  }, [router.isReady, router.query.type, router.query.targetId])

  useEffect(() => {
    if (!authLoading && !token) {
      // biarkan tampilan "harus login" di bawah menangani; tidak redirect paksa
      // supaya deep-link laporan tetap bisa dibuka setelah login lalu kembali.
    }
  }, [authLoading, token])

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!token) {
      router.push('/guest/login')
      return
    }
    if (!targetId.trim()) {
      setError('ID target harus diisi')
      return
    }
    if (!reason.trim() || reason.trim().length < 10) {
      setError('Alasan minimal 10 karakter')
      return
    }

    setLoading(true)
    try {
      await api.post('/reports', {
        type,
        targetId: targetId.trim(),
        reason: reason.trim(),
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      const status = err.response?.status
      if (status === 401) {
        setError('Sesi kamu berakhir. Silakan login kembali.')
      } else if (status === 403) {
        setError('Kamu tidak diizinkan melakukan aksi ini.')
      } else if (status === 404) {
        setError('Target laporan tidak ditemukan.')
      } else {
        setError(err.response?.data?.message || 'Gagal mengirim laporan')
      }
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) return null

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-8 text-center">
        <p className="text-gray-600 mb-4">Anda harus login untuk membuat laporan</p>
        <button
          onClick={() => router.push('/guest/login')}
          className="btn-primary"
        >
          Login
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto p-8">
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-center">
          <p className="font-semibold">✓ Laporan berhasil dikirim</p>
          <p className="text-sm mt-1">Terima kasih atas laporan Anda. Tim moderator akan meninjau.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">Laporkan Konten</h1>
      <p className="text-gray-600 mb-6">Bantu kami menjaga komunitas yang sehat</p>

      <form onSubmit={submit} className="space-y-4" noValidate>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Jenis Konten</label>
          <select
            className="form-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={loading}
          >
            <option value="discussion">Diskusi</option>
            <option value="comment">Komentar</option>
            <option value="user">Pengguna</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ID {TYPE_LABELS[type]}</label>
          <input
            className="form-input"
            placeholder={`Paste ID ${TYPE_LABELS[type].toLowerCase()} yang akan dilaporkan`}
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            disabled={loading}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Anda bisa menemukan ID di URL {type === 'discussion' ? 'diskusi' : type === 'comment' ? 'komentar' : 'profil pengguna'}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Alasan Laporan</label>
          <textarea
            className="form-input h-32"
            placeholder="Jelaskan mengapa konten ini perlu dilaporkan..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={loading}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimal 10 karakter ({reason.trim().length}/10)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !targetId.trim() || reason.trim().length < 10}
          className="btn-danger w-full"
          aria-busy={loading}
        >
          {loading ? 'Mengirim...' : '🚩 Kirim Laporan'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 mt-4">
        Laporan palsu dapat mengakibatkan pembatasan akun Anda
      </p>
    </div>
  )
}
