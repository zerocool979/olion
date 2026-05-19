export function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Buat Akun Anonim',
      desc: 'Daftar hanya dengan email. Pseudonym unikmu dibuat otomatis oleh sistem.',
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Mulai Diskusi',
      desc: 'Tulis pertanyaan atau bagikan pengalaman. Identitasmu sepenuhnya terlindungi.',
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Dapat Insight dari Komunitas',
      desc: 'Komunitas aktif dan Verified Expert menjawab dan memperkaya sudut pandangmu.',
      svg: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="landing-section animate-fade-up stagger-3">
      <div className="landing-inner">
        <div className="landing-section__header">
          <div className="landing-section__eyebrow">Cara Kerja</div>
          <h2 className="landing-section__title">
            Mulai dalam <span className="landing-gradient-text">3 langkah</span>
          </h2>
          <p className="landing-section__subtitle">
            Tidak perlu data pribadi. Tidak perlu nama asli.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={s.step} className="step-card">
              <div className="step-card__number">{s.step}</div>
              <div className="step-card__icon">{s.svg}</div>
              <h3 className="step-card__title">{s.title}</h3>
              <p className="step-card__desc">{s.desc}</p>
              {i < 2 && <div className="step-card__connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
