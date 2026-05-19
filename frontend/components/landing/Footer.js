import Link from 'next/link'

export function Footer() {
  const columns = [
    {
      heading: 'Platform',
      links: [
        { label: 'Beranda',      href: '/' },
        { label: 'Trending',     href: '/trending' },
        { label: 'Kategori',     href: '/categories' },
        { label: 'Leaderboard', href: '/leaderboard' },
        { label: 'Cari Diskusi', href: '/search' },
      ],
    },
    {
      heading: 'Komunitas',
      links: [
        { label: 'Daftar',          href: '/guest/register' },
        { label: 'Masuk',           href: '/guest/login' },
        { label: 'Verified Expert', href: '/guest/register' },
        { label: 'Moderator',       href: '/guest/register' },
      ],
    },
    {
      heading: 'Kebijakan',
      links: [
        { label: 'Privasi', href: '/privacy' },
        { label: 'Syarat Penggunaan', href: '/terms' },
        { label: 'Panduan Komunitas', href: '/community-guidelines' },
        { label: 'Kontak',            href: 'mailto:bilalfarhani635@gmail.com' },
      ],
    },
  ]

  return (
    <footer className="landing-footer">
      <div className="landing-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand__logo">
              <span className="footer-brand__dot" />
              OLION
            </div>
            <p className="footer-brand__tagline">
              Platform diskusi anonim untuk komunitas yang berpikir kritis.
            </p>
            <div className="footer-social">
              <a href="https://github.com/zerocool979/" target="_blank" rel="noreferrer" className="footer-social__link" title="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="footer-social__link" title="Discord">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M7.5 7.5c1.5-1 9-1 10.5 0l1 8.5c-2 1.5-4 2-6 2s-4-.5-6-2l1-8.5z"/></svg>
              </a>
              <a href="mailto:bilalfarhani635@gmail.com" className="footer-social__link" title="Kontak">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.heading} className="footer-col">
              <h4 className="footer-col__heading">{col.heading}</h4>
              <ul className="footer-col__links">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="footer-col__link">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="footer-bottom__copy">
            © {new Date().getFullYear()} OLION · Platform diskusi anonim terstruktur
          </p>
        </div>
      </div>
    </footer>
  )
}
