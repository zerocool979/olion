/**
 * pages/user/create.jsx  — Buat Diskusi Baru
 */
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '../../lib/api'
import { Avatar, StatPill, colors } from '../../components/dashboard'
import UserLayout from './_layout'

// FIX: field ini wajib diisi di skema (Discussion.mode / Discussion.discipline,
// tanpa default) tapi form ini tadinya tidak pernah menampilkan/mengirimnya —
// menyebabkan setiap POST /discussions gagal dengan "Argument `mode` is
// missing". Sekarang jadi pilihan asli di form, dengan default paling netral
// (Eksploratif / Bebas) supaya tetap satu-klik-jadi kalau user tidak peduli.
const MODE_OPTIONS = [
  { value: 'EKSPLORATIF',  label: 'Eksploratif — mengeksplorasi ide' },
  { value: 'INFORMATIF',   label: 'Informatif — berbagi informasi' },
  { value: 'KLARIFIKATIF', label: 'Klarifikasi — mencari kejelasan' },
  { value: 'EVALUATIF',    label: 'Evaluatif — menilai/mengevaluasi' },
  { value: 'ARGUMENTATIF', label: 'Argumentatif — mengajukan argumen' },
]

const DISCIPLINE_OPTIONS = [
  { value: 'BEBAS',        label: 'Bebas — santai & terbuka' },
  { value: 'RASIONAL',     label: 'Rasional — berbasis nalar/logika' },
  { value: 'AKADEMIK',     label: 'Akademik — berbasis referensi ilmiah' },
  { value: 'PROFESIONAL',  label: 'Profesional — konteks kerja/industri' },
]

export default function CreateDiscussion() {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const [title,      setTitle]      = useState('')
  const [content,    setContent]    = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [mode,       setMode]       = useState('EKSPLORATIF')
  const [discipline, setDiscipline] = useState('BEBAS')
  const [tags,       setTags]       = useState('')
  const [categories, setCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  const username = user?.profile?.username ?? user?.username ?? 'Kamu'

  useEffect(() => {
    api.get('/categories')
      .then(r => { const d = r.data?.data ?? r.data ?? []; setCategories(Array.isArray(d) ? d : []) })
      .catch(() => {})
  }, [])

  // FIX: sebelumnya halaman ini tidak pernah membaca query param sama sekali —
  // apa pun yang diketik user di kartu "Mulai Diskusi" pada beranda hilang
  // begitu saja begitu sampai di sini. Sekarang title & kategori (by slug)
  // dibawa masuk otomatis begitu router siap.
  useEffect(() => {
    if (!router.isReady) return
    const q = router.query
    if (typeof q.title === 'string' && q.title.trim()) {
      setTitle(prev => prev || q.title)
    }
  }, [router.isReady, router.query.title])

  useEffect(() => {
    if (!router.isReady || categories.length === 0) return
    const slug = router.query.category
    if (typeof slug !== 'string' || !slug) return

    // Kategori bisa berupa root atau anak (children) — cari di keduanya.
    const flat = categories.flatMap(c => [c, ...(c.children ?? [])])
    const match = flat.find(c => c.slug === slug)
    if (match) setCategoryId(prev => prev || match.id)
  }, [router.isReady, router.query.category, categories])

  const handleSubmit = async () => {
    setError('')
    if (!title.trim()) return setError('Judul wajib diisi.')
    if (!content.trim()) return setError('Konten wajib diisi.')

    setSubmitting(true)
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean)
      const r = await api.post('/discussions', {
        title:    title.trim(),
        content:  content.trim(),
        categoryId: categoryId || undefined,
        mode,
        discipline,
        tags:     tagArray,
      })
      const id = r.data?.data?.id ?? r.data?.id
      router.push(id ? `/user/discussions/${id}` : '/user/discussions')
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Gagal membuat diskusi. Coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const charLeft = 5000 - content.length

  const sidebar = (
    <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
      <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>💡 Tips</span>
      {[
        '📌 Judul yang jelas & spesifik mendapat lebih banyak respons.',
        '🏷 Gunakan kategori dan tag yang tepat.',
        '📝 Deskripsikan masalah dengan detail untuk jawaban terbaik.',
        '👍 Upvote jawaban yang membantumu!',
      ].map((tip, i) => (
        <p key={i} style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.5, marginBottom: 8 }}>{tip}</p>
      ))}
    </div>
  )

  return (
    <UserLayout sidebar={sidebar}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', borderBottom: `1px solid ${colors.border}`, position: 'sticky', top: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/user" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: 18 }}>←</Link>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>Buat Diskusi</h1>
          <div style={{ flex: 1 }} />
          <button onClick={handleSubmit} disabled={submitting || !title.trim() || !content.trim()} style={{
            background: title.trim() && content.trim() ? colors.accent : colors.bgElevated,
            color: title.trim() && content.trim() ? '#fff' : colors.textSecondary,
            border: 'none', borderRadius: 20, padding: '8px 20px',
            fontSize: 14, fontWeight: 700, cursor: title.trim() && content.trim() ? 'pointer' : 'default',
          }}>
            {submitting ? 'Memposting…' : 'Post'}
          </button>
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: '16px', display: 'flex', gap: 12 }}>
        <Avatar username={username} src={user?.profile?.avatarUrl} border={user?.profile?.avatarBorder} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Title */}
          <input
            value={title} onChange={e => setTitle(e.target.value)} maxLength={200}
            placeholder="Judul diskusi…"
            style={{ display: 'block', width: '100%', fontSize: 20, fontWeight: 700, border: 'none', outline: 'none', background: 'transparent', color: colors.textPrimary, marginBottom: 12, fontFamily: 'inherit', boxSizing: 'border-box' }}
          />

          {/* Category */}
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
            style={{ display: 'block', marginBottom: 12, padding: '6px 12px', borderRadius: 20, border: `1px solid ${colors.border}`, background: colors.bgElevated, color: categoryId ? colors.textPrimary : colors.textSecondary, fontSize: 13, cursor: 'pointer', outline: 'none' }}
          >
            <option value="">Pilih kategori…</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Mode & Tingkat diskusi */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <select value={mode} onChange={e => setMode(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${colors.border}`, background: colors.bgElevated, color: colors.textPrimary, fontSize: 13, cursor: 'pointer', outline: 'none' }}
            >
              {MODE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={discipline} onChange={e => setDiscipline(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 20, border: `1px solid ${colors.border}`, background: colors.bgElevated, color: colors.textPrimary, fontSize: 13, cursor: 'pointer', outline: 'none' }}
            >
              {DISCIPLINE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Content */}
          <textarea
            value={content} onChange={e => setContent(e.target.value.slice(0, 5000))}
            placeholder="Tuliskan diskusi atau pertanyaanmu di sini…"
            rows={12}
            style={{ display: 'block', width: '100%', border: 'none', outline: 'none', fontSize: 16, resize: 'none', color: colors.textPrimary, background: 'transparent', fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box' }}
          />

          {/* Char count */}
          <div style={{ textAlign: 'right', fontSize: 12, color: charLeft < 200 ? '#ef4444' : colors.textSecondary, marginTop: 4 }}>
            {charLeft} karakter tersisa
          </div>

          {/* Tags */}
          <div style={{ marginTop: 12 }}>
            <input value={tags} onChange={e => setTags(e.target.value)}
              placeholder="Tag (pisahkan dengan koma): misal react, nextjs, tips"
              style={{ width: '100%', padding: '8px 14px', borderRadius: 24, border: `1px solid ${colors.border}`, background: colors.bgElevated, color: colors.textPrimary, fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Preview tags */}
          {tags.trim() && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {tags.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                <span key={t} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, background: colors.bgElevated, color: colors.accent, border: `1px solid ${colors.border}` }}>#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}



