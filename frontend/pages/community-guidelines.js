import Head from 'next/head'
import Link from 'next/link'
import { EthicsCard, ExampleCard, ReputationTierCard, ForbiddenItem, TipCard, BadgePill, ReportStep, QualityChecklist } from '../components/guidelines'

const LAST_UPDATED = '15 Januari 2025'

const ethicsRules = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    title: 'Hormati Sesama',
    desc: 'Perlakukan setiap anggota komunitas dengan respek, terlepas dari pendapat atau latar belakang mereka.',
    color: '#f87171',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
    ),
    title: 'Diskusi Berbasis Fakta',
    desc: 'Dukung klaimmu dengan sumber yang dapat diverifikasi. Opini boleh, tapi tandai dengan jelas sebagai opini.',
    color: '#60a5fa',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Inklusif & Welcoming',
    desc: 'Sambut anggota baru. Jangan mengintimidasi newbie. Kita semua pernah jadi pemula.',
    color: '#4ade80',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: 'Tetap On-Topic',
    desc: 'Posting di kategori yang tepat. Diskusi yang nyasar akan dipindahkan oleh moderator.',
    color: '#a78bfa',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: 'Kontribusi Berkualitas',
    desc: 'Lebih baik satu jawaban panjang yang mendalam daripada sepuluh komentar pendek yang tidak membantu.',
    color: '#f59e0b',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Gunakan Search Sebelum Posting',
    desc: 'Cek apakah topikmu sudah pernah dibahas sebelumnya untuk menghindari duplikasi.',
    color: '#34d399',
  },
]

const examples = [
  {
    type: 'good',
    label: '✓ Contoh Bagus',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.06)',
    border: 'rgba(74,222,128,0.18)',
    title: 'Pertanyaan tentang CTF challenge',
    body: '"Saya sedang mengerjakan challenge buffer overflow di HTB. Sudah mencoba payload standar tapi segfault. Berikut stack trace-nya: [dump]. Apa yang salah dengan pendekatan saya?"',
    why: 'Spesifik, menunjukkan effort, menyertakan detail teknis yang relevan.',
  },
  {
    type: 'bad',
    label: '✗ Contoh Buruk',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.18)',
    title: 'Pertanyaan yang tidak membantu',
    body: '"tolong ajarin hacking dong, mau jadi hacker pro. ada tools nya nggak?"',
    why: 'Terlalu umum, tidak ada usaha mandiri, berpotensi disalahgunakan.',
  },
  {
    type: 'good',
    label: '✓ Diskusi Bermutu',
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.06)',
    border: 'rgba(74,222,128,0.18)',
    title: 'Debat teknikal yang konstruktif',
    body: '"Saya tidak setuju bahwa Rust selalu lebih aman dari C dalam konteks embedded. Pada constraint memory < 64KB, overhead Rust compiler justru counterproductive karena... [argumen dengan data]"',
    why: 'Tidak setuju tapi sopan, didukung argumen teknis yang spesifik.',
  },
  {
    type: 'bad',
    label: '✗ Debat Toxic',
    color: '#f87171',
    bg: 'rgba(248,113,113,0.06)',
    border: 'rgba(248,113,113,0.18)',
    title: 'Serangan personal',
    body: '"Lo pasti gak tau apa-apa. Python programmer nggak ngerti systems programming, ngomong doang."',
    why: 'Serangan personal, meremehkan orang lain, tidak ada argumen substantif.',
  },
]

const userTiers = [
  { name: 'Pemula', rep: '0–49', color: '#596570', icon: '◎', perks: ['Buat diskusi & komentar', 'Vote standar', 'Bookmark diskusi'] },
  { name: 'Kontributor', rep: '50–199', color: '#60a5fa', icon: '◈', perks: ['Vote berbobot', 'Flag / laporkan konten', 'Edit tag diskusi sendiri'] },
  { name: 'Aktif', rep: '200–749', color: '#a78bfa', icon: '◆', perks: ['Buat ruang diskusi terbatas', 'Edit tag bersama', 'Statistik kontribusi pribadi'] },
  { name: 'Ahli', rep: '750–1499', color: '#f59e0b', icon: '✦', perks: ['Undang Expert', 'Sorotan di profil', 'Akses chat komunitas'] },
  { name: 'Master', rep: '1500+', color: '#4ade80', icon: '★', perks: ['Nominasi Moderator', 'Tema profil eksklusif', 'Akses forum internal'] },
]

const expertTiers = [
  { name: 'Expert Pemula', rep: '0–199', color: '#f59e0b', icon: '✦', perks: ['Badge Expert permanen', 'Prioritas flag', 'Usul tag resmi'] },
  { name: 'Expert Aktif', rep: '200–749', color: '#f59e0b', icon: '✦', perks: ['Jawaban Terverifikasi', 'Sesi Tanya Expert', 'Semua hak USER setara'] },
  { name: 'Expert Ahli', rep: '750–1499', color: '#f59e0b', icon: '✦', perks: ['Kurasi tag tanpa persetujuan', 'Label Mentor di ruang terbatas'] },
  { name: 'Expert Master', rep: '1500+', color: '#f59e0b', icon: '✦', perks: ['Rekomendasi calon Expert', 'Panel statistik komunitas', 'Warna emas di leaderboard'] },
]

const forbiddenContent = [
  { icon: '🔞', label: 'Konten dewasa atau pornografi' },
  { icon: '🎯', label: 'Doxxing atau deanonymization' },
  { icon: '☠', label: 'Ancaman kekerasan atau ujaran kebencian' },
  { icon: '💣', label: 'Panduan senjata atau bahan peledak' },
  { icon: '💊', label: 'Promosi narkotika atau zat terlarang' },
  { icon: '🏴‍☠', label: 'Distribusi malware aktif untuk serangan nyata' },
  { icon: '🃏', label: 'Penipuan, scam, atau social engineering nyata' },
  { icon: '©', label: 'Pelanggaran hak cipta berskala besar' },
]

const discussionTips = [
  {
    icon: '🎯', color: '#60a5fa', title: 'Tetap Relevan & Terstruktur',
    tips: ['Pastikan judul diskusi mencerminkan isi dengan jelas.', 'Gunakan tag yang sesuai (contoh: [AI], [Filsafat], [Teknologi]).', 'Pisahkan diskusi panjang menjadi beberapa balasan agar mudah diikuti.'],
  },
  {
    icon: '🕶️', color: '#94a3b8', title: 'Jaga Anonimitas & Privasi',
    tips: ['Jangan membagikan informasi pribadi — milik sendiri atau orang lain.', 'Hormati hak pengguna lain untuk tetap anonim.', 'Laporkan jika Anda melihat upaya deanonymization (doxxing).'],
  },
  {
    icon: '💬', color: '#a78bfa', title: 'Bangun Argumen Berkualitas',
    tips: ['Dukung pendapat dengan data, pengalaman, atau sumber terpercaya.', 'Hindari serangan pribadi — fokus pada ide, bukan individu.', 'Bertanya dengan sopan jika ada yang kurang jelas.'],
  },
  {
    icon: '⚠️', color: '#f59e0b', title: 'Konten Sensitif & Etika',
    tips: ['Jika membahas topik sensitif (keamanan siber, kesehatan mental), beri peringatan di awal.', 'Jangan menyebarkan alat eksploitasi aktif tanpa konteks edukasi yang jelas.', 'Setiap saran medis/hukum harus disertai disclaimer bahwa itu bukan pengganti profesional.'],
  },
  {
    icon: '🚩', color: '#f87171', title: 'Bantu Moderasi Komunitas',
    tips: ['Gunakan fitur "Laporkan" untuk konten yang melanggar pedoman.', 'Jangan memberi panggung pada pelanggar — jangan balas, langsung laporkan.', 'Beri apresiasi pada kontribusi positif dengan upvote.'],
  },
  {
    icon: '📚', color: '#4ade80', title: 'Jadilah Pembelajar & Pengajar',
    tips: ['Tidak ada pertanyaan bodoh — setiap orang memulai dari level berbeda.', 'Jika Anda ahli di suatu bidang, pertimbangkan untuk mengajukan diri sebagai Expert terverifikasi.', 'Bagikan sumber belajar gratis yang bermanfaat bagi komunitas.'],
  },
]

const reportSteps = [
  { step: '1', title: 'Klik tombol Report', desc: 'Tersedia di setiap diskusi dan komentar. Ikon bendera di kanan bawah konten.' },
  { step: '2', title: 'Pilih kategori laporan', desc: 'Spam, doxxing, konten berbahaya, atau pelanggaran lainnya.' },
  { step: '3', title: 'Tambahkan konteks', desc: 'Penjelasan singkat membantu moderator bertindak lebih cepat dan akurat.' },
  { step: '4', title: 'Tunggu tindak lanjut', desc: 'Moderator akan merespons dalam 24–48 jam. Kamu akan mendapat notifikasi hasilnya.' },
]

const qualityItems = [
  ['Judul deskriptif', 'Hindari judul generik. "Kenapa Rust aman?" lebih baik dari "Tanya soal programming".'],
  ['Tunjukkan risetmu', 'Sebutkan apa yang sudah kamu coba sebelum bertanya.'],
  ['Format yang rapi', 'Gunakan code block untuk kode, daftar untuk langkah-langkah.'],
  ['Kategori yang tepat', 'Pilih kategori yang paling relevan untuk reach yang optimal.'],
  ['Tag yang relevan', 'Tambahkan tag seperti #linux, #python, #ctf untuk memudahkan penemuan.'],
  ['Update thread', 'Jika masalahmu teratasi, update thread dengan solusinya untuk membantu orang lain.'],
]

const badgeData = [
  { label: 'Verified Expert', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
  { label: 'Moderator', color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)' },
  { label: 'Admin', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  { label: 'Top Contributor', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  { label: 'Anonymized', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)', border: 'rgba(148,163,184,0.15)' },
  { label: 'Publik', color: '#4ade80', bg: 'rgba(74,222,128,0.07)', border: 'rgba(74,222,128,0.18)' },
]

export default function CommunityGuidelinesPage() {
  return (
    <>
      <Head>
        <title>Panduan Komunitas — OLION</title>
        <meta name="description" content="Panduan komunitas OLION: cara berdiskusi yang baik, etika komunitas, sistem reputasi, dan konten yang dilarang di platform diskusi anonim kami." />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className="page-shell">
        <div className="page-grid-bg" />

        <div className="legal-page">
          <div className="legal-breadcrumb">
            <Link href="/" className="legal-breadcrumb__link">Beranda</Link>
            <span className="legal-breadcrumb__sep">›</span>
            <span className="legal-breadcrumb__current">Panduan Komunitas</span>
          </div>

          <header className="legal-hero">
            <div className="legal-hero__badge">
              <span className="legal-hero__badge-dot" style={{ background: '#a78bfa', boxShadow: '0 0 8px #a78bfa55' }} />
              Panduan &amp; Etika
            </div>
            <h1 className="legal-hero__title">
              Panduan{' '}
              <span className="legal-gradient-text legal-gradient-text--purple">Komunitas</span>
            </h1>
            <p className="legal-hero__sub">
              OLION adalah rumah bersama. Pedoman ini memastikan komunitas tetap sehat, aman, dan produktif untuk semua.
            </p>
            <div className="legal-hero__meta">
              <span className="legal-hero__updated">Terakhir diperbarui: {LAST_UPDATED}</span>
              <span className="legal-hero__version">v2.1.0</span>
            </div>
          </header>

          <div className="legal-summary-card animate-fade-up" style={{ '--summary-color': '#a78bfa' }}>
            <div className="legal-summary-card__icon">⬡</div>
            <div>
              <p className="legal-summary-card__title">Filosofi OLION</p>
              <p className="legal-summary-card__text">
                Anonimitas bukan berarti tanpa tanggung jawab. Justru ketika identitas tersembunyi,
                karakter asli seseorang terlihat dari cara mereka berinteraksi. Jadilah versi terbaik dirimu.
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div className="legal-section-header">
              <h2 className="legal-section-title legal-section-title--lg">Etika Diskusi</h2>
            </div>
            <div className="guideline-grid">
              {ethicsRules.map((r, i) => (
                <EthicsCard key={r.title} {...r} index={i} />
              ))}
            </div>
          </div>

          <div className="legal-card animate-fade-up" style={{ '--legal-accent': '#60a5fa' }}>
            <div className="legal-card__header">
              <span className="legal-card__icon-wrap" style={{ color: '#60a5fa', borderColor: '#60a5fa25', background: '#60a5fa0f' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </span>
              <h2 className="legal-section-title">Cara Membuat Thread Berkualitas</h2>
            </div>
            <QualityChecklist items={qualityItems} />
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div className="legal-section-header">
              <h2 className="legal-section-title legal-section-title--lg">Contoh Nyata</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                Panduan bergambar untuk diskusi yang membangun vs yang merusak.
              </p>
            </div>
            <div className="legal-example-grid">
              {examples.map((ex) => (
                <ExampleCard key={ex.title} example={ex} />
              ))}
            </div>
          </div>

          <div className="legal-card animate-fade-up" style={{ '--legal-accent': '#fb923c' }}>
            <div className="legal-card__header">
              <span className="legal-card__icon-wrap" style={{ color: '#fb923c', borderColor: '#fb923c25', background: '#fb923c0f' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
                </svg>
              </span>
              <h2 className="legal-section-title">Cara Melaporkan Pelanggaran</h2>
            </div>
            <div className="legal-report-steps">
              {reportSteps.map((s) => (
                <ReportStep key={s.step} step={s} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div className="legal-section-header">
              <h2 className="legal-section-title legal-section-title--lg">Sistem Reputasi</h2>
            </div>
            <div className="legal-rep-grid">
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", marginBottom: '1rem', color: 'var(--text-primary)' }}>👤 User</h3>
                {userTiers.map((t) => (
                  <ReputationTierCard key={t.name} tier={t} type="user" />
                ))}
              </div>
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", marginBottom: '1rem', color: 'var(--text-primary)' }}>🥇 Expert</h3>
                {expertTiers.map((t) => (
                  <ReputationTierCard key={t.name} tier={t} type="expert" />
                ))}
              </div>
            </div>
          </div>

          <div className="legal-card animate-fade-up" style={{ '--legal-accent': '#f87171' }}>
            <div className="legal-card__header">
              <span className="legal-card__icon-wrap" style={{ color: '#f87171', borderColor: '#f8717125', background: '#f871710f' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
              </span>
              <h2 className="legal-section-title">Konten yang Dilarang</h2>
            </div>
            <div className="legal-forbidden-grid">
              {forbiddenContent.map((f) => (
                <ForbiddenItem key={f.label} {...f} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div className="legal-section-header">
              <h2 className="legal-section-title legal-section-title--lg">Tips Diskusi Berkualitas</h2>
            </div>
            <div className="legal-tips-grid">
              {discussionTips.map((section) => (
                <TipCard key={section.title} section={section} />
              ))}
            </div>
          </div>

          <div className="legal-card animate-fade-up" style={{ '--legal-accent': '#a78bfa' }}>
            <div className="legal-card__header">
              <span className="legal-card__icon-wrap" style={{ color: '#a78bfa', borderColor: '#a78bfa25', background: '#a78bfa0f' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </span>
              <h2 className="legal-section-title">Badge Komunitas</h2>
            </div>
            <p className="legal-card__body">Badge muncul di profil dan diskusimu untuk menandai status di komunitas.</p>
            <div className="legal-badge-row">
              {badgeData.map((b) => (
                <BadgePill key={b.label} {...b} />
              ))}
            </div>
          </div>

          <div className="legal-footer">
            <Link href="/" className="legal-footer__back">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 7H4M6 4L3 7l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali ke Beranda
            </Link>
            <div className="legal-footer__links">
              <Link href="/privacy" className="legal-footer__link">Kebijakan Privasi</Link>
              <Link href="/terms" className="legal-footer__link">Syarat Penggunaan</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
