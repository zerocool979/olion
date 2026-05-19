import Link from 'next/link'

export function EmptyState({ icon, title, description, cta, href }) {
  return (
    <div className="ud-empty">
      <div className="ud-empty__icon">{icon}</div>
      <p className="ud-empty__title">{title}</p>
      <p className="ud-empty__desc">{description}</p>
      {cta && href && (
        <Link href={href} className="ud-empty__cta">
          {cta}
        </Link>
      )}
    </div>
  )
}
