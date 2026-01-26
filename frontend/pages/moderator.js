import api from '../lib/api'
import { useEffect, useState } from 'react'
import { getUser } from '../lib/auth'
import { useRouter } from 'next/router'

export default function Moderator() {
  const [reports, setReports] = useState([])
  const router = useRouter()
  const user = getUser()

  useEffect(() => {
    if (!user || user.role !== 'MODERATOR') router.push('/')
    else api.get('/reports').then(res => setReports(res.data))
  }, [])

  const resolve = async id => {
    await api.put(`/reports/${id}`, { status: 'RESOLVED' })
  }

  return (
    <div className="p-8">
      <h1 className="text-xl mb-4">Moderator Panel</h1>
      {reports.map(r => (
        <div key={r.id} className="border p-2 mb-2">
          {r.reason}
          <button onClick={() => resolve(r.id)} className="ml-2 text-green-600">
            Resolve
          </button>
        </div>
      ))}
    </div>
  )
}
