import Link from 'next/link'

export function TrendingTopics({ topics }) {
  return (
    <section className="landing-section animate-fade-up stagger-3">
      <div className="landing-inner">
        <div className="landing-section__header">
          <div className="landing-section__eyebrow">Topik Populer</div>
          <h2 className="landing-section__title">
            Apa yang sedang <span className="landing-gradient-text">dibicarakan</span>
          </h2>
        </div>
        <div className="topics-cloud">
          {topics.map((t) => (
            <Link
              key={t.label}
              href={`/search?q=${encodeURIComponent(t.label)}`}
              className={`topic-pill topic-pill--${t.heat}`}
            >
              {t.heat === 'hot' && <span className="topic-pill__fire">🔥</span>}
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
