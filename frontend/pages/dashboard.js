import api from '../lib/api'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.get('/discussions').then(res => setItems(res.data))
  }, [])

  const vote = async (id, value) => {
    await api.post('/votes', { discussionId: id, value })
  }

  return (
    <div className="p-8">
      <h1 className="text-xl mb-4">Discussions</h1>

      {items.map(d => (
        <div key={d.id} className="border p-4 mb-3">
          <h2 className="font-bold">{d.title}</h2>
          <p>{d.content}</p>

          <div className="text-sm text-gray-600 mt-1">
            by {d.user.profile.username}
            {d.user.isVerifiedExpert && (
              <span className="ml-2 text-green-600 font-semibold">
                ✔ Expert
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <button onClick={() => vote(d.id, 1)}>👍</button>
            <button onClick={() => vote(d.id, -1)}>👎</button>
          </div>
        </div>
      ))}
    </div>
  )
}
