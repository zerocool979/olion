// src/pages/404.js

// ==============================
// FILE INI SUDAH FIX - TIDAK PERLU DIUBAH
// ==============================
import Link from 'next/link';

export default function Custom404() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f9fafb',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        Halaman yang kamu cari tidak ditemukan.
      </p>

      <Link href="/">
        <button
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontSize: '1rem'
          }}
        >
          Kembali ke Beranda
        </button>
      </Link>
    </div>
  );
}
