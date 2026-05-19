export default function FilterPill({ active, onClick, children }) {
  return (
    <button
      className={`filter-pill${active ? ' active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
