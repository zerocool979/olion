/**
 * frontend/pages/privacy.js
 * Kebijakan Privasi — OLION
 */

import Head from 'next/head'
import Link from 'next/link'
import { colors, avatarPalette } from '../components/dashboard'

const LAST_UPDATED = '15 Januari 2025'

const sections = [
  {
    id: 'data-collected',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    title: 'Data yang Dikumpulkan',
    accent: colors.accent,
    items: [
      'Alamat email untuk autentikasi akun (tidak pernah ditampilkan publik)',
      'Username pseudonim yang kamu pilih sendiri',
      'Konten diskusi, komentar, dan jawaban yang kamu posting',
      'Timestamp aktivitas untuk tujuan keamanan dan moderasi',
      'Alamat IP dalam hash terenkripsi — tidak dapat di-reverse',
      'Preferensi tampilan dan pengaturan notifikasi',
    ],
  },
  {
    id: 'anonymity',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Anonimitas Pengguna',
    accent: '#00ba7c',
    content: 'OLION dirancang dengan prinsip privacy-by-default. Identitas aslimu tidak pernah dikaitkan dengan konten yang kamu posting secara publik.',
    items: [
      'Pseudonim otomatis — tidak ada nama asli yang diperlukan',
      'Mode anonim tersedia untuk semua diskusi',
      'Moderator tidak dapat melihat identitas asli pengguna biasa',
      'Hanya Admin sistem dengan otorisasi khusus yang dapat memverifikasi akun dalam kasus hukum',
      'Email kamu tidak pernah ditampilkan kepada siapapun',
    ],
  },
  {
    id: 'cookies',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="8" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/><circle cx="9.5" cy="15" r="1" fill="currentColor"/>
      </svg>
    ),
    title: 'Penggunaan Cookies',
    accent: colors.gold,
    items: [
      'Session cookie untuk menjaga status login kamu',
      'Cookie preferensi untuk menyimpan pengaturan tampilan',
      'Tidak menggunakan third-party tracking cookies',
      'Tidak ada iklan berbasis perilaku atau profiling',
      'Semua cookie bersifat first-party dan dapat dihapus kapan saja',
    ],
  },
  {
    id: 'security',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Keamanan Data',
    accent: avatarPalette[4].color,
    items: [
      'Password di-hash menggunakan bcrypt dengan salt rounds tinggi',
      'JWT token terenkripsi dengan expiry waktu terbatas',
      'HTTPS enforced untuk seluruh komunikasi data',
      'Database diproteksi dengan access control berlapis',
      'Backup terenkripsi secara berkala dengan retention policy',
      'Penetration testing rutin oleh tim keamanan internal',
    ],
  },
  {
    id: 'moderator-policy',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
    title: 'Kebijakan Moderator',
    accent: avatarPalette[5].color,
    content: 'Moderator memiliki akses terbatas yang diperlukan untuk menjaga keamanan komunitas.',
    items: [
      'Moderator hanya dapat melihat konten publik dan laporan yang masuk',
      'Moderator tidak dapat mengakses email atau data pribadi pengguna',
      'Setiap tindakan moderasi dicatat dalam audit log yang tidak dapat diubah',
      'Moderator tunduk pada NDA dan kode etik internal OLION',
      'Penyalahgunaan akses moderator akan mengakibatkan pemecatan dan tindakan hukum',
    ],
  },
  {
    id: 'user-rights',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 12h6M9 15h4"/>
      </svg>
    ),
    title: 'Hak Pengguna',
    accent: '#00ba7c',
    items: [
      'Hak akses data: minta salinan semua data yang kami simpan tentang kamu',
      'Hak penghapusan: minta penghapusan akun dan seluruh data terkait',
      'Hak koreksi: perbarui informasi yang tidak akurat kapan saja',
      'Hak portabilitas: ekspor data kamu dalam format JSON',
      'Hak keberatan: tolak pemrosesan data untuk tujuan tertentu',
      'Semua permintaan diproses dalam 30 hari kerja',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Kebijakan Privasi — OLION</title>
        <meta name="description" content="Kebijakan privasi OLION: bagaimana kami melindungi identitas dan data kamu sebagai pengguna platform diskusi anonim." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="page-shell">
        <div className="page-grid-bg" />

        <div className="legal-page">

          {/* ── Breadcrumb ── */}
          <div className="legal-breadcrumb">
            <Link href="/" className="legal-breadcrumb__link">Beranda</Link>
            <span className="legal-breadcrumb__sep">›</span>
            <span className="legal-breadcrumb__current">Kebijakan Privasi</span>
          </div>

          {/* ── Hero ── */}
          <header className="legal-hero">
            <div className="legal-hero__badge">
              <span className="legal-hero__badge-dot" style={{ background: '#00ba7c', boxShadow: '0 0 8px rgba(0,186,124,0.4)' }} />
              Privasi &amp; Keamanan
            </div>
            <h1 className="legal-hero__title">
              Kebijakan{' '}
              <span className="legal-gradient-text legal-gradient-text--blue">Privasi</span>
            </h1>
            <p className="legal-hero__sub">
              Kami membangun OLION dengan filosofi <em>privacy-first</em>. Identitasmu aman bersama kami.
            </p>
            <div className="legal-hero__meta">
              <span className="legal-hero__updated">Terakhir diperbarui: {LAST_UPDATED}</span>
              <span className="legal-hero__version">v2.1.0</span>
            </div>
          </header>

          {/* ── Summary card ── */}
          <div className="legal-summary-card animate-fade-up">
            <div className="legal-summary-card__icon">🛡</div>
            <div>
              <p className="legal-summary-card__title">Komitmen Inti OLION</p>
              <p className="legal-summary-card__text">
                Kami tidak menjual data. Kami tidak melacak perilaku untuk iklan. Kami tidak mengungkapkan
                identitas pengguna kecuali diwajibkan hukum yang berlaku dengan perintah pengadilan yang sah.
              </p>
            </div>
          </div>

          {/* ── Sections ── */}
          <div className="legal-grid">
            {sections.map((s, i) => (
              <div
                key={s.id}
                id={s.id}
                className={`legal-card animate-fade-up stagger-${Math.min(i + 1, 5)}`}
                style={{ '--legal-accent': s.accent }}
              >
                <div className="legal-card__header">
                  <span className="legal-card__icon-wrap" style={{ color: s.accent, borderColor: `${s.accent}25`, background: `${s.accent}0f` }}>
                    {s.icon}
                  </span>
                  <h2 className="legal-section-title">{s.title}</h2>
                </div>
                {s.content && <p className="legal-card__body">{s.content}</p>}
                <ul className="legal-list">
                  {s.items.map((item) => (
                    <li key={item} className="legal-list__item">
                      <span className="legal-list__dot" style={{ background: s.accent }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Contact ── */}
          <div className="legal-contact-card animate-fade-up">
            <div className="legal-contact-card__left">
              <h3 className="legal-contact-card__title">Ada pertanyaan tentang privasi?</h3>
              <p className="legal-contact-card__sub">
                Tim privasi kami siap membantu. Respon dalam 2×24 jam kerja.
              </p>
            </div>
            <a href="mailto:privacy@olion.id" className="btn-outline legal-contact-card__btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              privacy@olion.id
            </a>
          </div>

          {/* ── Footer nav ── */}
          <div className="legal-footer">
            <Link href="/" className="legal-footer__back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 7H4M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali ke Beranda
            </Link>
            <div className="legal-footer__links">
              <Link href="/terms" className="legal-footer__link">Syarat Penggunaan</Link>
              <Link href="/community-guidelines" className="legal-footer__link">Panduan Komunitas</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
