import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import { ROUTES } from '../../lib/routes'
import api from '../../lib/api'

export default function UserCreate() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router = useRouter()

  const [title,      setTitle]      = useState('')
  const [content,    setContent]    = useState('')
  const [category,   setCategory]   = useState('')
  const [mode,       setMode]       = useState('IDENTIFIED')
  const [discipline, setDiscipline] = useState('BEBAS')   // ← tambahkan state ini
  const [cats,       setCats]       = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    if (!authLoading && !user) router.replace(ROUTES.guest.login)
  }, [user, authLoading, router])

  useEffect(() => {
    api.get('/categories')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setCats(Array.isArray(d) ? d : []) })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!title.trim() || !content.trim()) { setError('Judul dan konten wajib diisi.'); return }
    setSubmitting(true)
    try {
      const res = await api.post('/discussions', {
        title,
        content,
        categoryId: category || undefined,
        mode,
        discipline,                // ← kirim discipline
      })
      const id = res.data?.data?.id ?? res.data?.id
      router.push(id ? ROUTES.user.discussion(id) : ROUTES.user.dashboard)
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Gagal membuat diskusi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="page-grid-bg" />
      <div className="page-content" style={{ maxWidth: '680px' }}>

        <div className="page-header animate-fade-up">
          <h1 className="page-title">Buat Diskusi</h1>
          <p className="page-subtitle">Ajukan pertanyaan atau mulai topik baru.</p>
        </div>

        <form onSubmit={handleSubmit} className="animate-fade-up stagger-1">
          {error && <div className="error-banner" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
              Judul *
            </label>
            <input
              className="form-input"
              type="text"
              placeholder="Tuliskan pertanyaan atau topik diskusimu…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
              Konten *
            </label>
            <textarea
              className="form-input"
              placeholder="Jelaskan lebih detail…"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={8}
              required
              style={{ resize: 'vertical', minHeight: '160px' }}
            />
          </div>

          {/* Baris Kategori + Mode */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                Kategori
              </label>
              <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">Pilih kategori</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
                Mode
              </label>
              <select className="form-input" value={mode} onChange={e => setMode(e.target.value)}>
                <option value="IDENTIFIED">Publik (identitas terlihat)</option>
                <option value="ANONYMOUS">Anonim</option>
              </select>
            </div>
          </div>

          {/* Discipline — TAMBAHAN BARU */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>
              Tingkat Disiplin
            </label>
            <select className="form-input" value={discipline} onChange={e => setDiscipline(e.target.value)}>
              <option value="BEBAS">Bebas</option>
              <option value="RASIONAL">Rasional</option>
              <option value="AKADEMIK">Akademik</option>
              <option value="PROFESIONAL">Profesional</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-outline" onClick={() => router.back()}>Batal</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Menyimpan…' : 'Publikasikan'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
