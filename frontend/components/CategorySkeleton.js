export default function CategorySkeleton() {
  return (
    <div className="category-card category-card--skeleton">
      <div className="skeleton" style={{ height: '16px', width: '55%', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '100%', marginBottom: '0.3rem' }} />
      <div className="skeleton" style={{ height: '13px', width: '80%', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ height: '12px', width: '35%' }} />
    </div>
  );
}



