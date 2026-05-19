import Link from 'next/link';

export default function EmptyState({ message, actionLabel, actionHref, icon }) {
  return (
    <div className="empty-state animate-fade-up">
      <div className="empty-state__icon">
        {icon || (
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 11C3 6.58 6.58 3 11 3s8 3.58 8 8c0 1.6-.48 3.1-1.3 4.36L19 19l-3.64-1.3A7.95 7.95 0 0111 19C6.58 19 3 15.42 3 11z" stroke="#596570" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <p className="empty-state__text">{message}</p>
      {actionHref && (
        <Link href={actionHref} className="btn-outline">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
