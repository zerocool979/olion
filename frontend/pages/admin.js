import api from '../lib/api'
import { useEffect, useState } from 'react'
import { getUser } from '../lib/auth'
import { useRouter } from 'next/router'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const user = getUser()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/')
      return
    }

    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users')
        setUsers(res.data)
      } catch (err) {
        setError('Gagal memuat daftar pengguna')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user, router])

  const verify = async (id) => {
    try {
      await api.put(`/admin/verify/${id}`)
      setUsers(users.map(u =>
        u.id === id ? { ...u, isVerifiedExpert: true } : u
      ))
    } catch (err) {
      alert('Gagal memverifikasi pengguna')
      console.error('Error verifying user:', err)
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
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Kelola pengguna dan verifikasi expert</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada pengguna</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">Username</th>
                <th className="text-left px-4 py-2 font-semibold">Email</th>
                <th className="text-left px-4 py-2 font-semibold">Role</th>
                <th className="text-left px-4 py-2 font-semibold">Status</th>
                <th className="text-left px-4 py-2 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{u.profile?.username || 'N/A'}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      u.role === 'MODERATOR' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {u.isVerifiedExpert ? (
                      <span className="text-green-600 font-semibold">✔ Expert</span>
                    ) : (
                      <span className="text-gray-500">Regular User</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {u.role === 'USER' && !u.isVerifiedExpert && (
                      <button
                        onClick={() => verify(u.id)}
                        className="btn-primary text-sm"
                      >
                        Verify Expert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
