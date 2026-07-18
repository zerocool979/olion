'use client'
import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import api from '../../lib/api'
import { colors } from '../../components/dashboard'

function fullDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function LiaKnowledgeBase() {
  const { user, loading: authLoading } = useContext(AuthContext)
  const router = useRouter()

  const [documents, setDocuments] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [toast,     setToast]     = useState(null)

  const [mode,    setMode]    = useState('text') // text | file
  const [title,   setTitle]   = useState('')
  const [content, setContent] = useState('')
  const [file,    setFile]    = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError,  setFormError]  = useState('')
  const fileInputRef = useRef(null)

  // Guard: hanya ADMIN
  useEffect(() => {
    if (authLoading) return
    if (!user) { router.replace('/guest/login'); return }
    if (user.role !== 'ADMIN') router.replace('/user')
  }, [user, authLoading, router])

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/ingest/documents')
      setDocuments(res.data?.documents ?? [])
    } catch {
      showToast('Gagal memuat daftar dokumen', false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchDocuments()
  }, [user, fetchDocuments])

  const resetForm = () => {
    setTitle(''); setContent(''); setFile(null); setFormError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const submitText = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!title.trim() || !content.trim()) {
      setFormError('Judul dan isi dokumen wajib diisi.')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.post('/ingest/text', { title: title.trim(), content: content.trim() })
      showToast(`Dokumen "${res.data.document.title}" berhasil diingest (${res.data.document.chunkCount} chunk).`)
      resetForm()
      fetchDocuments()
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'Gagal meng-ingest dokumen.')
    } finally {
      setSubmitting(false)
    }
  }

  const submitFile = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!file) {
      setFormError('Pilih file PDF atau TXT terlebih dahulu.')
      return
    }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      if (title.trim()) fd.append('title', title.trim())
      const res = await api.post('/ingest/file', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showToast(`Dokumen "${res.data.document.title}" berhasil diingest (${res.data.document.chunkCount} chunk).`)
      resetForm()
      fetchDocuments()
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'Gagal memproses file.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (doc) => {
    if (!window.confirm(`Hapus dokumen "${doc.title}"? Seluruh ${doc.chunkCount} chunk-nya ikut terhapus dan tidak bisa dikembalikan.`)) return
    const prev = documents
    setDocuments(d => d.filter(x => x.id !== doc.id))
    try {
      await api.delete(`/ingest/documents/${doc.id}`)
      showToast('Dokumen dihapus dari knowledge base.')
    } catch {
      setDocuments(prev)
      showToast('Gagal menghapus dokumen', false)
    }
  }

  if (authLoading || !user || user.role !== 'ADMIN') return null

  const totalChunks = documents.reduce((sum, d) => sum + (d.chunkCount ?? 0), 0)

  return (
    <>
      <Head><title>Knowledge Base LIA — Admin</title></Head>
      <div style={{ minHeight: '100vh', background: colors.bg, color: colors.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '24px 20px 80px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <Link href="/admin/dashboard" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: 13 }}>← Admin</Link>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>🤖 Knowledge Base LIA</h1>
          <p style={{ color: colors.textSecondary, fontSize: 14, marginBottom: 20 }}>
            Kelola dokumen yang dipakai LIA untuk menjawab pertanyaan pengguna. {documents.length} dokumen · {totalChunks} chunk total.
          </p>

          {/* ── Form upload ── */}
          <div style={{ background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '18px 20px', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: `1px solid ${colors.border}` }}>
              {[['text', '✍️ Teks Langsung'], ['file', '📄 Upload File']].map(([key, label]) => (
                <button key={key} onClick={() => { setMode(key); setFormError('') }} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '8px 16px', fontSize: 13.5,
                  fontWeight: mode === key ? 700 : 400,
                  color: mode === key ? colors.accent : colors.textSecondary,
                  borderBottom: mode === key ? `2px solid ${colors.accent}` : '2px solid transparent',
                }}>{label}</button>
              ))}
            </div>

            {mode === 'text' ? (
              <form onSubmit={submitText}>
                <input
                  value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Judul dokumen (mis. FAQ Pendaftaran)"
                  disabled={submitting}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.textPrimary, fontSize: 14, marginBottom: 10, outline: 'none' }}
                />
                <textarea
                  value={content} onChange={e => setContent(e.target.value)}
                  placeholder="Tempel isi dokumen di sini — FAQ, panduan, dokumentasi produk, dll."
                  disabled={submitting}
                  rows={7}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.textPrimary, fontSize: 14, resize: 'vertical', outline: 'none', fontFamily: 'inherit', lineHeight: 1.5 }}
                />
                {formError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>⚠️ {formError}</p>}
                <button type="submit" disabled={submitting} style={{
                  marginTop: 12, background: colors.accent, color: '#fff', border: 'none',
                  borderRadius: 20, padding: '9px 22px', fontSize: 13.5, fontWeight: 700,
                  cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.6 : 1,
                }}>
                  {submitting ? 'Meng-ingest…' : 'Ingest Dokumen'}
                </button>
              </form>
            ) : (
              <form onSubmit={submitFile}>
                <input
                  value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Judul dokumen (opsional — default nama file)"
                  disabled={submitting}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.textPrimary, fontSize: 14, marginBottom: 10, outline: 'none' }}
                />
                <input
                  ref={fileInputRef}
                  type="file" accept=".pdf,.txt,application/pdf,text/plain"
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                  disabled={submitting}
                  style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}
                />
                <p style={{ fontSize: 12, color: colors.textSecondary }}>Format: PDF atau TXT, maksimal 15MB.</p>
                {formError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 4 }}>⚠️ {formError}</p>}
                <button type="submit" disabled={submitting} style={{
                  marginTop: 8, background: colors.accent, color: '#fff', border: 'none',
                  borderRadius: 20, padding: '9px 22px', fontSize: 13.5, fontWeight: 700,
                  cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.6 : 1,
                }}>
                  {submitting ? 'Memproses…' : 'Upload & Ingest'}
                </button>
              </form>
            )}
          </div>

          {/* ── Daftar dokumen ── */}
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Dokumen di Knowledge Base</h2>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3].map(i => <div key={i} style={{ height: 64, background: colors.bgElevated, borderRadius: 10 }} />)}
            </div>
          ) : documents.length === 0 ? (
            <div style={{ textAlign: 'center', color: colors.textSecondary, padding: 50, border: `1px dashed ${colors.border}`, borderRadius: 12 }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
              Belum ada dokumen. Upload dokumen pertama lewat form di atas.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {documents.map(doc => (
                <div key={doc.id} style={{
                  background: colors.bgElevated, border: `1px solid ${colors.border}`, borderRadius: 10,
                  padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</div>
                    <div style={{ fontSize: 11.5, color: colors.textSecondary, marginTop: 2 }}>
                      {doc.chunkCount} chunk · {fullDate(doc.createdAt)}
                      {doc.uploadedBy && <> · oleh {doc.uploadedBy}</>}
                      {doc.source && <> · {doc.source}</>}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(doc)} style={{
                    background: '#ef444422', color: '#ef4444', border: 'none', borderRadius: 8,
                    padding: '7px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                  }}>
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {toast && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: toast.ok ? '#10b981' : '#ef4444', color: '#fff',
            padding: '10px 20px', borderRadius: 20, fontSize: 13.5, fontWeight: 600,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)', zIndex: 400,
          }}>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  )
}
