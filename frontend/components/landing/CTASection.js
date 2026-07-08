import Link from 'next/link'

export function CTASection() {
  return (
    <section className="cta-section animate-fade-up">
      <div className="landing-inner">
        <div className="cta-card">
          <div className="cta-card__glow cta-card__glow--left" />
          <div className="cta-card__glow cta-card__glow--right" />
          <div className="cta-card__content">
            <div className="landing-section__eyebrow" style={{ marginBottom: '1rem' }}>Bergabung sekarang</div>
            <h2 className="cta-card__title">
              Mulai Diskusi Anonimmu<br />
              <span className="landing-gradient-text">Sekarang</span>
            </h2>
            <p className="cta-card__sub">
              Gratis selamanya. Tanpa kartu kredit. Tanpa identitas asli.
            </p>
            <div className="hero-actions" style={{ marginTop: '2rem' }}>
              <Link href="/guest/register" className="btn-primary btn-primary--lg">
                Daftar Gratis
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/search" className="btn-outline btn-outline--lg">
                Jelajahi Diskusi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



