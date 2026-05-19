import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import api from '../../lib/api'

export default function Report() {
  const router = useRouter()
  const { token } = useContext(AuthContext)

  const [targetId, setTargetId] = useState(router.query.targetId || '')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!token) {
        router.push('/guest/login')
        return
      }

      if (!targetId || !reason) {
        setError('ID target dan alasan harus diisi')
        return
      }

      if (reason.length < 10) {
        setError('Alasan minimal 10 karakter')
        return
      }

      await api.post('/reports', {
        targetType: 'DISCUSSION',
        targetId,
        reason
      })

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim laporan')
      console.error('Error submitting report:', err)
    } finally {
      setLoading(false)
    }
  }

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

      <form onSubmit={submit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">ID Diskusi</label>
          <input
            className="form-input"
            placeholder="Paste ID diskusi yang akan dilaporkan"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            disabled={loading}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Anda bisa menemukan ID di URL diskusi
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
            Minimal 10 karakter
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-danger w-full"
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
