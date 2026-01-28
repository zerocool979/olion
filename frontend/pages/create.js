import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import api from '../lib/api'

export default function CreateDiscussion() {
  const router = useRouter()

  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])

  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: '',
    mode: 'EKSPLORATIF',
    discipline: 'RASIONAL'
  })

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data))
  }, [])

  const onCategoryChange = (id) => {
    const cat = categories.find(c => c.id === id)
    setSubcategories(cat?.children || [])
    setForm({ ...form, categoryId: id })
  }

  const submit = async () => {
    try {
      await api.post('/discussions', form)
      router.push('/')
    } catch (e) {
      alert('Gagal membuat diskusi')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Buat Diskusi Baru</h1>

      <input
        className="w-full border p-2"
        placeholder="Judul"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="w-full border p-2 h-32"
        placeholder="Isi diskusi"
        value={form.content}
        onChange={e => setForm({ ...form, content: e.target.value })}
      />

      {/* CATEGORY */}
      <select
        className="w-full border p-2"
        onChange={e => onCategoryChange(e.target.value)}
      >
        <option value="">Pilih Kategori</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {/* MODE */}
      <select
        className="w-full border p-2"
        value={form.mode}
        onChange={e => setForm({ ...form, mode: e.target.value })}
      >
        <option value="INFORMATIF">Informatif</option>
        <option value="KLARIFIKATIF">Klarifikatif</option>
        <option value="EKSPLORATIF">Eksploratif</option>
        <option value="EVALUATIF">Evaluatif</option>
        <option value="ARGUMENTATIF">Argumentatif</option>
        <option value="PRAKTIS">Praktis</option>
      </select>

      {/* DISCIPLINE */}
      <select
        className="w-full border p-2"
        value={form.discipline}
        onChange={e => setForm({ ...form, discipline: e.target.value })}
      >
        <option value="BEBAS">Bebas</option>
        <option value="RASIONAL">Rasional</option>
        <option value="AKADEMIK">Akademik</option>
        <option value="PROFESIONAL">Profesional</option>
      </select>

      <button
        className="bg-black text-white px-4 py-2"
        onClick={submit}
      >
        Publish
      </button>
    </div>
  )
}
