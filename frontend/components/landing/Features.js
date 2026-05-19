export function Features() {
  const features = [
    {
      colorVar: '#4ade80',
      title: 'Anonymous Discussion',
      desc: 'Pseudonym otomatis melindungi identitas aslimu. Diskusi bebas tanpa rasa takut dihakimi.',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      ),
    },
    {
      colorVar: '#60a5fa',
      title: 'AI Moderation',
      desc: 'Sistem moderasi berbasis AI menjaga kualitas konten dan menghapus toxic content secara otomatis.',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
        </svg>
      ),
    },
    {
      colorVar: '#a78bfa',
      title: 'Expert Community',
      desc: 'Verified Expert hadir untuk menjawab pertanyaanmu dengan kredibilitas terverifikasi admin.',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    {
      colorVar: '#f59e0b',
      title: 'Secure Identity',
      desc: 'Enkripsi identitas end-to-end. Tidak ada satu pun pihak yang bisa menelusuri siapa kamu.',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      ),
    },
    {
      colorVar: '#f87171',
      title: 'General Topics',
      desc: 'Beragam topik umum seperti teknologi, sains, kesehatan, pendidikan, karier, sosial, hukum, hiburan, dan diskusi bebas.',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
    },
    {
      colorVar: '#34d399',
      title: 'Reputation System',
      desc: 'Sistem reputasi transparan mendorong kontribusi berkualitas dan membangun kepercayaan komunitas.',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ),
    },
    {
      colorVar: '#22d3ee',
      title: 'O-Lynx AI',
      desc: 'Asisten AI cerdas untuk membantu pencarian diskusi, merangkum topik, menjawab pertanyaan, dan mempermudah eksplorasi komunitas.',
      svg: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2a7 7 0 00-7 7v3a3 3 0 003 3h1l2 3 2-3h1a3 3 0 003-3V9a7 7 0 00-7-7z"/><circle cx="9" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="landing-section animate-fade-up stagger-2">
      <div className="landing-inner">
        <div className="landing-section__header">
          <div className="landing-section__eyebrow">Kenapa OLION?</div>
          <h2 className="landing-section__title">
            Dibangun untuk{' '}
            <span className="landing-gradient-text">privasi</span> dan{' '}
            <span className="landing-gradient-text">kualitas</span>
          </h2>
          <p className="landing-section__subtitle">
            Platform yang mengedepankan keamanan identitas tanpa mengorbankan kualitas diskusi.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card" style={{ '--feat-color': f.colorVar }}>
              <div className="feature-card__icon">{f.svg}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
