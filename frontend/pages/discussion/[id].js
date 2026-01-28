import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function Detail() {
  const { query } = useRouter()
  const [data, setData] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (query.id) {
      api.get(`/discussions/${query.id}`).then(res => setData(res.data))
    }
  }, [query.id])

  const submit = async () => {
    await api.post('/comments', {
      discussionId: query.id,
      content: comment
    })
    setComment('')
    const res = await api.get(`/discussions/${query.id}`)
    setData(res.data)
  }

  if (!data) return <p>Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p className="mb-4">{data.content}</p>

      <h2 className="font-semibold mt-6">Comments</h2>
      {data.comments.map(c => (
        <div key={c.id} className="border p-2 my-2">
          <b>{c.user.email}</b>
          <p>{c.content}</p>
        </div>
      ))}

      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="border w-full p-2 mt-4"
        placeholder="Write comment..."
      />
      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 mt-2"
      >
        Send
      </button>
    </div>
  )
}
