export function ActivityItem({ item }) {
  const iconMap = {
    VOTE:    { icon: '↑', color: '#4ade80' },
    ANSWER:  { icon: '↩', color: '#60a5fa' },
    MENTION: { icon: '@', color: '#f59e0b' },
    REPORT:  { icon: '⚑', color: '#f87171' },
    DEFAULT: { icon: '·', color: '#596570' },
  }
  const { icon, color } = iconMap[item.type] ?? iconMap.DEFAULT

  return (
    <div className="ud-activity-item">
      <span className="ud-activity-item__dot" style={{ color, borderColor: `${color}30`, background: `${color}10` }}>
        {icon}
      </span>
      <div className="ud-activity-item__body">
        <p className="ud-activity-item__text">
          {item.message || item.content || 'Aktivitas baru'}
        </p>
        <span className="ud-activity-item__time">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '—'}
        </span>
      </div>
    </div>
  )
}
