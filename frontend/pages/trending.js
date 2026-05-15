import Link from 'next/link'
import { useState } from 'react'

const TRENDING = [
  { id: 1, rank: 1, title: 'Cara kerja AI generatif dan implikasinya terhadap pekerjaan masa depan', category: 'Teknologi', votes: 892, comments: 134, views: 24500, trend: '+312%', hot: true },
  { id: 2, rank: 2, title: 'Hak pekerja kontrak vs karyawan tetap: apa perbedaan perlindungan hukumnya?', category: 'Hukum', votes: 654, comments: 98, views: 18200, trend: '+248%', hot: true },
  { id: 3, rank: 3, title: 'Investasi saham vs properti untuk generasi milenial', category: 'Keuangan', votes: 540, comments: 211, views: 15800, trend: '+195%', hot: false },
  { id: 4, rank: 4, title: 'Pengalaman resign tanpa alasan kuat — apakah salah?', category: 'Sosial', votes: 487, comments: 176, views: 13200, trend: '+167%', hot: false },
  { id: 5, rank: 5, title: 'Apakah sistem pendidikan Indonesia sudah relevan di era digital?', category: 'Pendidikan', votes: 421, comments: 143, views: 11900, trend: '+142%', hot: false },
  { id: 6, rank: 6, title: 'Gejala anxiety dan cara membedakannya dari stres biasa', category: 'Kesehatan', votes: 399, comments: 89, views: 10400, trend: '+128%', hot: false },
  { id: 7, rank: 7, title: 'Tips memulai bisnis online dengan modal minimal', category: 'Keuangan', votes: 371, comments: 112, views: 9800, trend: '+115%', hot: false },
  { id: 8, rank: 8, title: 'Diskusi: Budaya overtime di perusahaan Indonesia', category: 'Sosial', votes: 344, comments: 201, views: 8700, trend: '+98%', hot: false },
]

const PERIODS = ['24 Jam', '7 Hari', '30 Hari']

export default function Trending() {
  const [period, setPeriod] = useState('24 Jam')

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 14c2-3 4-4 6-2s4-1 6-4" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M12 4v4h4" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Syne', sans-serif" }}>Trending</span>
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: '0' }}>
              Diskusi Populer
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-surface)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            {PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '0.35rem 0.875rem',
                  borderRadius: '7px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 160ms ease',
                  background: period === p ? 'var(--bg-overlay)' : 'transparent',
                  color: period === p ? 'var(--text-primary)' : 'var(--text-muted)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Trending List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {TRENDING.map((d, i) => (
            <Link key={d.id} href={`/discussion/${d.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                {/* Rank */}
                <div style={{
                  minWidth: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  background: i < 3 ? 'rgba(245,158,11,0.1)' : 'var(--bg-overlay)',
                  border: `1px solid ${i < 3 ? 'rgba(245,158,11,0.25)' : 'var(--border-subtle)'}`,
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: i < 3 ? '#f59e0b' : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {d.rank}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge badge-mode" style={{ fontSize: '0.65rem' }}>{d.category}</span>
                    {d.hot && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 600, fontFamily: "'Syne', sans-serif", letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        🔥 Hot
                      </span>
                    )}
                    <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#4ade80', fontWeight: 600 }}>{d.trend}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '0.75rem' }} className="line-clamp-2">
                    {d.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1l1.4 3h3.1l-2.5 1.8.9 3L6 7l-2.9 1.8.9-3L1.5 4H4.6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                      {d.votes.toLocaleString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 2a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1H4l-3 2V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                      {d.comments}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><ellipse cx="6" cy="6" rx="5" ry="3.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/></svg>
                      {d.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
