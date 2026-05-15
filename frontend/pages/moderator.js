import api from '../lib/api'
import { useEffect, useState } from 'react'
import { getUser } from '../lib/auth'
import { useRouter } from 'next/router'

export default function Moderator() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const user = getUser()

  useEffect(() => {
    if (!user || user.role !== 'MODERATOR') {
      router.push('/')
      return
    }

    const fetchReports = async () => {
      try {
        const res = await api.get('/reports')
        setReports(res.data)
      } catch (err) {
        setError('Gagal memuat laporan')
        console.error('Error fetching reports:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [user, router])

  const resolve = async (id) => {
    try {
      await api.put(`/reports/${id}`, { status: 'RESOLVED' })
      setReports(reports.map(r =>
        r.id === id ? { ...r, status: 'RESOLVED' } : r
      ))
    } catch (err) {
      alert('Gagal menyelesaikan laporan')
      console.error('Error resolving report:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Moderator Panel</h1>
      <p className="text-gray-600 mb-8">Kelola laporan konten</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada laporan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="card">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">Laporan #{r.id.slice(0, 8)}</h3>
                  <p className="text-gray-600">Target: {r.targetType}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${
                  r.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                  r.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {r.status}
                </span>
              </div>

              <p className="text-gray-700 mb-3">
                <strong>Alasan:</strong> {r.reason}
              </p>

              {r.status !== 'RESOLVED' && (
                <button
                  onClick={() => resolve(r.id)}
                  className="btn-primary"
                >
                  ✓ Selesaikan
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
