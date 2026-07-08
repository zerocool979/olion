export default function StatPill({ icon, value, label }) {
  return (
    <span className="stat-pill">
      {icon}
      <span className="stat-pill__value">{value ?? 0}</span>
      <span className="stat-pill__label">{label}</span>
    </span>
  );
}



