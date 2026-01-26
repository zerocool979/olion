import api from '../lib/api'
import { useEffect, useState } from 'react'

export default function Home() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.get('/discussions').then(res => setItems(res.data))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-xl mb-4">OLION Discussions</h1>
      {items.map(d => (
        <div key={d.id} className="border p-4 mb-2">
          <h2 className="font-bold">{d.title}</h2>
          <p>{d.content}</p>
        </div>
      ))}
    </div>
  )
}
