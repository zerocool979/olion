export function Toast({ toast }) {
  if (!toast) return null
  return (
    <div
      className={`dd-toast dd-toast--${toast.type}`}
      role="alert"
      aria-live="polite"
    >
      {toast.type === 'success' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {toast.type === 'error' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      )}
      {toast.msg}
    </div>
  )
}
