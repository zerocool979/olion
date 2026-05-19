import Link from 'next/link'

export function Hero() {
  return (
    <section className="page-hero animate-fade-up">
      <div className="hero-pill animate-fade-in">
        <span className="hero-pill__dot" />
        Platform Diskusi Anonim
      </div>

      <h1 className="hero-title">
        Berbagi Ide,
        <br />
        <span className="hero-title-gradient">Tanpa Identitas</span>
      </h1>

      <p className="hero-description">
        Forum diskusi anonim untuk berbagi pengetahuan, bertanya, dan bertukar gagasan secara bebas.
      </p>

      <div className="hero-actions">
        <Link href="/guest/register" className="btn-primary btn-primary--lg">
          Buat Diskusi
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
        <Link href="/guest/register" className="btn-outline btn-outline--lg">
          Daftar Gratis
        </Link>
      </div>
    </section>
  )
}
