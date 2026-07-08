/**
 * frontend/pages/terms.js
 * Syarat &amp; Ketentuan Penggunaan — OLION
 */

import Head from 'next/head'
import Link from 'next/link'
import { colors, avatarPalette } from '../components/dashboard'

const LAST_UPDATED = '15 Januari 2025'

const prohibitions = [
  {
    icon: '✉',
    color: avatarPalette[2].color,
    title: 'Spam & Konten Komersial',
    desc: 'Dilarang memposting promosi produk/jasa, pyramid scheme, affiliate link tanpa izin, atau pesan berulang yang mengganggu komunitas.',
  },
  {
    icon: '🔍',
    color: colors.like,
    title: 'Doxxing',
    desc: 'Dilarang keras mengungkapkan, mencari, atau mendistribusikan informasi pribadi orang lain tanpa consent eksplisit. Ini adalah pelanggaran berat yang langsung mengakibatkan ban permanen.',
  },
  {
    icon: '⚠',
    color: avatarPalette[5].color,
    title: 'Malware & Phishing',
    desc: 'Dilarang mendistribusikan link malware, tools eksploitasi berbahaya, halaman phishing, atau konten yang bertujuan merusak sistem orang lain.',
  },
  {
    icon: '👤',
    color: avatarPalette[4].color,
    title: 'Penyalahgunaan Akun',
    desc: 'Dilarang membuat akun ganda untuk menghindari ban, menjual atau meminjamkan akun, serta menggunakan bot untuk aktivitas otomatis tanpa izin.',
  },
  {
    icon: '✦',
    color: colors.gold,
    title: 'Manipulasi Sistem Reputasi',
    desc: 'Dilarang melakukan vote manipulation, upvote ring, atau koordinasi untuk mengangkat konten secara artifisial.',
  },
  {
    icon: '◉',
    color: colors.accent,
    title: 'Konten Ilegal',
    desc: 'Dilarang memposting konten yang melanggar hukum Indonesia, termasuk SARA, pornografi, ujaran kebencian, dan pelanggaran hak cipta.',
  },
]

const moderatorRights = [
  'Menghapus konten yang melanggar ketentuan tanpa pemberitahuan sebelumnya',
  'Memberikan peringatan tertulis kepada akun yang melanggar',
  'Membatasi kemampuan posting sementara (mute) untuk akun bermasalah',
  'Merekomendasikan suspensi permanen kepada tim admin',
  'Memindahkan diskusi ke kategori yang lebih sesuai',
  'Mengunci thread yang memicu konflik tanpa resolusi',
]

const suspensionLevels = [
  { level: 'Peringatan', duration: '—', color: colors.accent, desc: 'Notifikasi resmi untuk pelanggaran pertama ringan' },
  { level: 'Mute', duration: '1–7 hari', color: colors.gold, desc: 'Pembatasan kemampuan posting sementara' },
  { level: 'Suspensi', duration: '7–30 hari', color: colors.like, desc: 'Akun dinonaktifkan sementara' },
  { level: 'Ban Permanen', duration: 'Selamanya', color: '#f4212e', desc: 'Untuk pelanggaran berat: doxxing, malware, CSAM' },
]

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Syarat Penggunaan — OLION</title>
        <meta name="description" content="Syarat dan ketentuan penggunaan platform OLION. Baca dengan seksama sebelum menggunakan layanan kami." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="page-shell">
        <div className="page-grid-bg" />

        <div className="legal-page">

          {/* ── Breadcrumb ── */}
          <div className="legal-breadcrumb">
            <Link href="/" className="legal-breadcrumb__link">Beranda</Link>
            <span className="legal-breadcrumb__sep">›</span>
            <span className="legal-breadcrumb__current">Syarat Penggunaan</span>
          </div>

          {/* ── Hero ── */}
          <header className="legal-hero">
            <div className="legal-hero__badge">
              <span className="legal-hero__badge-dot" style={{ background: colors.gold, boxShadow: `0 0 8px ${colors.goldSoft}` }} />
              Ketentuan Legal
            </div>
            <h1 className="legal-hero__title">
              Syarat{' '}
              <span className="legal-gradient-text legal-gradient-text--orange">Penggunaan</span>
            </h1>
            <p className="legal-hero__sub">
              Dengan menggunakan OLION, kamu menyetujui ketentuan berikut. Harap baca seluruhnya.
            </p>
            <div className="legal-hero__meta">
              <span className="legal-hero__updated">Terakhir diperbarui: {LAST_UPDATED}</span>
              <span className="legal-hero__version">v2.1.0</span>
            </div>
          </header>

          {/* ── Warning banner ── */}
          <div className="legal-warning animate-fade-up">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div>
              <strong>Penting:</strong> Pelanggaran serius seperti doxxing dan distribusi malware akan mengakibatkan ban permanen
              dan dapat dilaporkan ke pihak berwenang sesuai hukum yang berlaku.
            </div>
          </div>

          {/* ── Acceptance ── */}
          <div className="legal-card animate-fade-up" style={{ '--legal-accent': colors.accent }}>
            <div className="legal-card__header">
              <span className="legal-card__icon-wrap" style={{ color: colors.accent, borderColor: `${colors.accent}25`, background: colors.accentSoft }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </span>
              <h2 className="legal-section-title">Ketentuan Penggunaan Platform</h2>
            </div>
            <ul className="legal-list">
              {[
                'Kamu harus berusia minimal 13 tahun untuk menggunakan OLION',
                'Satu orang hanya boleh memiliki satu akun aktif',
                'Kamu bertanggung jawab penuh atas semua konten yang kamu posting',
                'Konten yang kamu posting harus mematuhi hukum Republik Indonesia',
                'OLION berhak mengubah ketentuan ini sewaktu-waktu dengan notifikasi 14 hari sebelumnya',
                'Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan',
              ].map((item) => (
                <li key={item} className="legal-list__item">
                  <span className="legal-list__dot" style={{ background: colors.accent }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Prohibitions grid ── */}
          <div style={{ marginBottom: '2rem' }}>
            <div className="legal-section-header">
              <h2 className="legal-section-title legal-section-title--lg">
                <span style={{ color: colors.like }}>✕</span> Yang Dilarang
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                Pelanggaran dapat mengakibatkan suspensi atau ban permanen.
              </p>
            </div>

            <div className="legal-prohibit-grid">
              {prohibitions.map((p) => (
                <div key={p.title} className="legal-prohibit-card" style={{ '--prohibit-color': p.color }}>
                  <div className="legal-prohibit-card__icon" style={{ color: p.color, background: `${p.color}10`, borderColor: `${p.color}25` }}>
                    <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{p.icon}</span>
                  </div>
                  <div>
                    <h3 className="legal-prohibit-card__title" style={{ color: p.color }}>{p.title}</h3>
                    <p className="legal-prohibit-card__desc">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Moderator rights ── */}
          <div className="legal-card animate-fade-up" style={{ '--legal-accent': colors.gold }}>
            <div className="legal-card__header">
              <span className="legal-card__icon-wrap" style={{ color: colors.gold, borderColor: `${colors.gold}25`, background: colors.goldSoft }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </span>
              <h2 className="legal-section-title">Hak Moderator</h2>
            </div>
            <p className="legal-card__body">
              Tim moderator OLION diberikan wewenang untuk menegakkan komunitas guidelines. Keputusan moderasi
              bersifat final kecuali ada banding yang diajukan ke admin dalam 7 hari.
            </p>
            <ul className="legal-list">
              {moderatorRights.map((item) => (
                <li key={item} className="legal-list__item">
                  <span className="legal-list__dot" style={{ background: colors.gold }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Suspension levels ── */}
          <div className="legal-card animate-fade-up" style={{ '--legal-accent': colors.like }}>
            <div className="legal-card__header">
              <span className="legal-card__icon-wrap" style={{ color: colors.like, borderColor: `${colors.like}25`, background: colors.likeSoft }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
              </span>
              <h2 className="legal-section-title">Tingkat Suspensi Akun</h2>
            </div>
            <div className="legal-suspension-table">
              {suspensionLevels.map((s) => (
                <div key={s.level} className="legal-suspension-row" style={{ '--sus-color': s.color }}>
                  <div className="legal-suspension-row__badge" style={{ color: s.color, borderColor: `${s.color}30`, background: `${s.color}10` }}>
                    {s.level}
                  </div>
                  <div className="legal-suspension-row__duration" style={{ color: s.color }}>{s.duration}</div>
                  <div className="legal-suspension-row__desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Disclaimer ── */}
          <div className="legal-highlight animate-fade-up">
            <div className="legal-highlight__icon">⚖</div>
            <div>
              <p className="legal-highlight__title">Disclaimer Platform</p>
              <p className="legal-highlight__text">
                OLION adalah platform intermediary. Kami tidak bertanggung jawab atas konten yang diposting pengguna,
                namun kami berkomitmen untuk merespons laporan pelanggaran dalam 48 jam. Konten yang melanggar hukum
                Indonesia akan dihapus dan dilaporkan sesuai Undang-Undang ITE yang berlaku.
              </p>
            </div>
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
              <Link href="/privacy" className="legal-footer__link">Kebijakan Privasi</Link>
              <Link href="/community-guidelines" className="legal-footer__link">Panduan Komunitas</Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
