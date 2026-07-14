/**
 * pages/user/dashboard.jsx
 *
 * FIX: halaman ini dulu adalah implementasi "Beranda" versi lama (604 baris),
 * duplikat penuh dari pages/user/index.js (versi aktif yang dipakai seluruh
 * nav & link di app ini — lihat lib/routes.js). Karena dua implementasi
 * paralel, bug yang sama (tab "Mengikuti" tidak benar-benar memfilter,
 * compose bar tidak fungsional, feed tidak infinite-scroll) harus diperbaiki
 * dua kali dan gampang kembali menyimpang satu sama lain.
 *
 * Tidak ada link internal di app ini yang lagi mengarah ke /user/dashboard
 * (sudah diverifikasi), jadi diubah jadi redirect murni ke halaman aktif —
 * fitur "lihat beranda" tetap ada & berfungsi penuh, cuma satu implementasi
 * yang perlu dirawat.
 */
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LegacyDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/user')
  }, [router])

  return null
}
