import { useState, useEffect, useRef, useContext, useCallback } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../../context/AuthContext'
import api from '../../lib/api'
import { colors } from '../dashboard/tokens'

let idCounter = 0
const nextId = () => `lia-${Date.now()}-${idCounter++}`

const WELCOME = {
  id: 'welcome',
  role: 'bot',
  text: 'Halo, aku LIA 👋 Aku bisa bantu jawab pertanyaan seputar OLION berdasarkan knowledge base yang tersedia. Ada yang bisa aku bantu?',
  sources: [],
}

export default function LiaWidget() {
  const { token } = useContext(AuthContext)
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Muat riwayat percakapan (kalau login) sekali saja, begitu widget pertama dibuka
  useEffect(() => {
    if (!open || historyLoaded) return
    setHistoryLoaded(true)
    if (!token) return // guest: tidak ada riwayat tersimpan

    api.get('/lia/history?limit=10')
      .then(r => {
        const logs = (r.data?.logs ?? []).slice().reverse()
        if (logs.length === 0) return
        const restored = logs.flatMap(l => ([
          { id: `${l.id}-q`, role: 'user', text: l.question },
          { id: `${l.id}-a`, role: 'bot', text: l.answer, sources: [] },
        ]))
        setMessages([WELCOME, ...restored])
      })
      .catch(() => { /* riwayat gagal dimuat — biarkan widget tetap jalan kosong */ })
  }, [open, historyLoaded, token])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = useCallback(async () => {
    const question = input.trim()
    if (!question || loading) return

    setError('')
    setInput('')
    setMessages(prev => [...prev, { id: nextId(), role: 'user', text: question }])
    setLoading(true)

    try {
      const res = await api.post('/lia', { question })
      const { answer, sources } = res.data
      setMessages(prev => [...prev, { id: nextId(), role: 'bot', text: answer, sources: sources ?? [] }])
    } catch (err) {
      const status = err.response?.status
      const msg = status === 429
        ? 'Kamu mengirim terlalu banyak pertanyaan. Tunggu sebentar ya.'
        : status === 503
        ? 'LIA belum dikonfigurasi sepenuhnya di server (API key belum diisi admin).'
        : err.response?.data?.message ?? 'Gagal menghubungi LIA. Coba lagi sebentar.'
      setError(msg)
      setMessages(prev => [...prev, { id: nextId(), role: 'bot', text: msg, isError: true, sources: [] }])
    } finally {
      setLoading(false)
    }
  }, [input, loading])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // FIX: tombol mengambang LIA (bottom:20,right:20) ada di semua halaman,
  // tapi di halaman Chat posisinya persis bertabrakan dengan tombol kirim
  // pesan — di layar sempit (HP) ini bisa menutupi tombol kirim sepenuhnya,
  // bikin terasa "tidak bisa membalas pesan" padahal sebenarnya cuma
  // ketutupan. Sembunyikan LIA saja saat di halaman Chat.
  if (router.pathname === '/user/chat') return null

  return (
    <>
      {/* ── Tombol mengambang ── */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Tutup chat LIA' : 'Buka chat LIA'}
        aria-expanded={open}
        style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 300,
          width: 56, height: 56, borderRadius: '50%',
          background: colors.accent, border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 18px rgba(29,155,240,0.45)',
          transition: 'transform 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
          </svg>
        )}
      </button>

      {/* ── Jendela chat ── */}
      {open && (
        <div role="dialog" aria-label="Chat dengan LIA" style={{
          position: 'fixed', bottom: 86, right: 20, zIndex: 300,
          width: 'min(360px, calc(100vw - 32px))',
          height: 'min(520px, calc(100vh - 140px))',
          background: colors.bg, border: `1px solid ${colors.border}`,
          borderRadius: 16, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px', borderBottom: `1px solid ${colors.border}`,
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', background: colors.accentSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0,
            }}>🤖</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>LIA</div>
              <div style={{ fontSize: 11, color: colors.textSecondary }}>Asisten Knowledge Base OLION</div>
            </div>
          </div>

          {/* Pesan */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '85%', padding: '9px 13px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? colors.accent : (msg.isError ? 'rgba(239,68,68,0.12)' : colors.bgElevated),
                  color: msg.role === 'user' ? '#fff' : (msg.isError ? '#f87171' : colors.textPrimary),
                  fontSize: 13.5, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {msg.text}
                </div>

                {/* Sumber dokumen (opsional, cuma tampil kalau ada) */}
                {msg.sources?.length > 0 && (
                  <div style={{ marginTop: 4, maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ fontSize: 10, color: colors.textSecondary, fontWeight: 600 }}>SUMBER:</span>
                    {msg.sources.map((s, i) => (
                      <div key={i} style={{
                        fontSize: 11, color: colors.textSecondary, background: colors.bgElevated,
                        border: `1px solid ${colors.border}`, borderRadius: 8, padding: '5px 9px',
                      }}>
                        <strong style={{ color: colors.textPrimary }}>{s.documentTitle}</strong>
                        {typeof s.score === 'number' && <span> · {Math.round(s.score * 100)}% relevan</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 13px' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: '50%', background: colors.textSecondary,
                    animation: `lia-bounce 1.2s ${i * 0.15}s infinite ease-in-out`,
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${colors.border}`, display: 'flex', gap: 8, flexShrink: 0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya sesuatu ke LIA…"
              rows={1}
              disabled={loading}
              style={{
                flex: 1, resize: 'none', border: `1px solid ${colors.border}`, borderRadius: 20,
                padding: '9px 14px', fontSize: 13.5, background: colors.bgElevated, color: colors.textPrimary,
                outline: 'none', fontFamily: 'inherit', maxHeight: 80,
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Kirim pertanyaan"
              style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: input.trim() && !loading ? colors.accent : colors.bgElevated,
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() && !loading ? '#fff' : colors.textSecondary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes lia-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </>
  )
}
