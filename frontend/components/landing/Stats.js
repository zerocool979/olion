export function Stats({ stats }) {
  return (
    <section className="landing-section landing-section--stats animate-fade-up stagger-1">
      <div className="landing-inner">
        <p className="landing-section__eyebrow" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Dipercaya komunitas
        </p>
        <div className="stats-row">
          {[
            { value: stats.discussions, label: 'Diskusi', icon: '💬' },
            { value: stats.users, label: 'Pengguna Aktif', icon: '👥' },
            { value: stats.experts, label: 'Verified Expert', icon: '✦' },
            { value: stats.protection, label: 'Anonymous Protection', icon: '🛡' },
          ].map((s) => (
            <div key={s.label} className="stats-row__card">
              <span className="stats-row__icon">{s.icon}</span>
              <span className="stats-row__value">{s.value}</span>
              <span className="stats-row__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



