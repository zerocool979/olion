import api from '../lib/api'

export default function Report() {
  async function submit(e) {
    e.preventDefault()
    await api.post('/reports', {
      targetType: 'DISCUSSION',
      targetId: e.target.targetId.value,
      reason: e.target.reason.value
    })
    alert('Reported')
  }

  return (
    <form onSubmit={submit} className="p-8">
      <input name="targetId" placeholder="Discussion ID" className="border mb-2" />
      <textarea name="reason" placeholder="Reason" className="border mb-2" />
      <button className="bg-red-600 text-white px-4 py-2">Report</button>
    </form>
  )
}
