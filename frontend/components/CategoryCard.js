import Link from 'next/link';

/**
 * Kartu kategori untuk ditampilkan di halaman Categories.
 * Menampilkan nama, deskripsi, jumlah diskusi, dan tautan ke halaman pencarian.
 */
export default function CategoryCard({ cat }) {
  const count = cat.totalDiscussions ?? 0;
  return (
    <Link href={`/search?category=${cat.slug}`} className="category-card">
      <p className="category-card__name">{cat.name}</p>
      {cat.description && (
        <p className="category-card__description">{cat.description}</p>
      )}
      <div className="category-card__footer">
        <span className="category-card__count">
          {count.toLocaleString()} diskusi
        </span>
        <span className="category-card__arrow">
          Lihat diskusi
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
