import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../lib/api'

export default function CreateDiscussion() {
  const router = useRouter()
  const { token } = useContext(AuthContext)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: '',
    mode: 'EKSPLORATIF',
    discipline: 'RASIONAL'
  })

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories')
        setCategories(res.data)
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }

    fetchCategories()
  }, [token, router])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!form.title || !form.content || !form.categoryId) {
        setError('Judul, isi, dan kategori harus diisi')
        return
      }

      await api.post('/discussions', form)
      router.push('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat diskusi')
      console.error('Error creating discussion:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Buat Diskusi Baru</h1>
      <p className="text-gray-600 mb-8">Bagikan pemikiran Anda dengan komunitas OLION</p>

      <form onSubmit={submit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Judul Diskusi</label>
          <input
            className="form-input"
            placeholder="Judul yang menarik..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Isi Diskusi</label>
          <textarea
            className="form-input h-32"
            placeholder="Jelaskan topik diskusi Anda..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Kategori</label>
          <select
            className="form-input"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            disabled={loading}
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Mode Diskusi</label>
            <select
              className="form-input"
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
              disabled={loading}
            >
              <option value="INFORMATIF">Informatif</option>
              <option value="KLARIFIKATIF">Klarifikatif</option>
              <option value="EKSPLORATIF">Eksploratif</option>
              <option value="EVALUATIF">Evaluatif</option>
              <option value="ARGUMENTATIF">Argumentatif</option>
              <option value="PRAKTIS">Praktis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Disiplin Ilmu</label>
            <select
              className="form-input"
              value={form.discipline}
              onChange={(e) => setForm({ ...form, discipline: e.target.value })}
              disabled={loading}
            >
              <option value="BEBAS">Bebas</option>
              <option value="RASIONAL">Rasional</option>
              <option value="AKADEMIK">Akademik</option>
              <option value="PROFESIONAL">Profesional</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Publishing...' : 'Publish Diskusi'}
        </button>
      </form>
    </div>
  )
}
