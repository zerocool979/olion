import Link from 'next/link'

export function About() {
  return (
    <section className="landing-section animate-fade-up stagger-2">
      <div className="landing-inner">
        <div className="about-grid">
          <div className="about-visual">
            <div className="about-visual__card">
              <div className="about-visual__glow" />
              <div className="about-visual__header">
                <span className="about-visual__dot about-visual__dot--red" />
                <span className="about-visual__dot about-visual__dot--yellow" />
                <span className="about-visual__dot about-visual__dot--green" />
              </div>
              <div className="about-visual__terminal">
                <p className="about-visual__line">
                  <span className="about-visual__prompt">$</span>
                  <span className="about-visual__cmd"> olion --status</span>
                </p>
                <p className="about-visual__output about-visual__output--green">✓ Identity protected</p>
                <p className="about-visual__output about-visual__output--green">✓ Pseudonym: Anon#7821</p>
                <p className="about-visual__output about-visual__output--green">✓ Encryption: AES-256</p>
                <p className="about-visual__output about-visual__output--blue">→ 47 discussions today</p>
                <p className="about-visual__output about-visual__output--blue">→ 12 experts online</p>
                <p className="about-visual__output about-visual__output--muted">█ Ready to discuss_</p>
              </div>
            </div>
          </div>

          <div className="about-text">
            <div>Tentang OLION</div>
            <h2 className="landing-section__title" style={{ textAlign: 'left', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
              Ruang aman untuk{' '}
              <span className="landing-gradient-text">ide-ide berani</span>
            </h2>
            <p className="about-text__body">
              OLION lahir dari keyakinan bahwa setiap orang berhak menyuarakan pendapatnya tanpa
              tekanan sosial. Terlalu banyak ide bagus yang tidak pernah tersampaikan karena
              rasa takut dihakimi.
            </p>
            <p className="about-text__body">
              Dengan sistem pseudonim terkontrol, kamu bisa bertanya hal yang dianggap "bodoh",
              mendebat pakar, atau berbagi pengalaman sensitif — semuanya tanpa mengungkap siapa kamu.
            </p>
            <div className="about-text__checklist">
              {[
                'Identitas asli tidak pernah terekspos ke publik',
                'Verified Expert dari berbagai bidang tersedia gratis',
                'Sistem reputasi mendorong argumen berkualitas',
                'Moderasi aktif menjaga ruang diskusi tetap sehat',
              ].map((item) => (
                <div key={item} className="about-text__check-item">
                  <span className="about-text__check-icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#4ade80" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link href="/guest/register" className="btn-outline" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Pelajari Lebih Lanjut →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}



