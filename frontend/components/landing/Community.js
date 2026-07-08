export function Community({ stats }) {
  const experts = [
    { pseudo: 'dr_sarah_k',      role: 'Dokter Umum',         badge: 'Expert', initial: 'S' },
    { pseudo: 'prof_andi_hukum', role: 'Dosen Hukum Pidana',  badge: 'Expert', initial: 'A' },
    { pseudo: 'rizky_engineer',  role: 'Senior SWE · Fintech', badge: 'Expert', initial: 'R' },
    { pseudo: 'dr_kimia_ui',     role: 'Peneliti · MIT',       badge: 'Expert', initial: 'K' },
    { pseudo: 'mod_rina',        role: 'Moderator',            badge: 'Mod',    initial: 'R' },
    { pseudo: 'mod_budi',        role: 'Moderator',            badge: 'Mod',    initial: 'B' },
  ]

  return (
    <section className="landing-section animate-fade-up stagger-4">
      <div className="landing-inner">
        <div className="community-grid">
          <div className="community-text">
            <div className="landing-section__eyebrow">Komunitas</div>
            <h2 className="landing-section__title" style={{ textAlign: 'left', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
              Didukung para <span className="landing-gradient-text">ahli nyata</span>
            </h2>
            <p className="about-text__body">
              Lebih dari {stats.experts} Verified Expert aktif dari berbagai bidang — cybersecurity, hukum,
              kesehatan, teknologi — siap berbagi pengetahuan secara gratis.
            </p>
            <div className="community-stats">
              {[
                { n: `${stats.experts}+`,    label: 'Verified Expert' },
                { n: `${stats.moderators}+`, label: 'Moderator Aktif' },
                { n: `${stats.categories}+`, label: 'Kategori Topik' },
              ].map((c) => (
                <div key={c.label} className="community-stat">
                  <span className="community-stat__n">{c.n}</span>
                  <span className="community-stat__label">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="expert-showcase">
            {experts.map((e) => (
              <div key={e.pseudo} className="expert-card">
                <div className="expert-card__avatar">{e.initial}</div>
                <div className="expert-card__info">
                  <div className="expert-card__pseudo">{e.pseudo}</div>
                  <div className="expert-card__role">{e.role}</div>
                </div>
                <div className={`expert-card__badge expert-card__badge--${e.badge.toLowerCase()}`}>
                  {e.badge === 'Expert' ? '✦ Expert' : e.badge}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}



