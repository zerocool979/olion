import api from '../lib/api'
import { useEffect, useState } from 'react'
import { getUser } from '../lib/auth'
import { useRouter } from 'next/router'

export default function Admin() {
  const [users, setUsers] = useState([])
  const router = useRouter()
  const user = getUser()

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') router.push('/')
    else api.get('/admin/users').then(res => setUsers(res.data))
  }, [])

  const verify = async id => {
    await api.put(`/admin/verify/${id}`)
    alert('Expert verified')
  }

  return (
    <div className="p-8">
      <h1 className="text-xl mb-4">Admin Dashboard</h1>
      {users.map(u => (
        <div key={u.id} className="border p-2 mb-2">
          {u.profile.username} — {u.role}
          {u.role === 'USER' && (
            <button onClick={() => verify(u.id)} className="ml-2 text-blue-600">
              Verify Expert
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
