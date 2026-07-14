import { useEffect, useRef, useState } from 'react'

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

/**
 * Tombol Google Sign-In dengan tampilan custom (sesuai tema gelap app ini),
 * tapi tetap memakai Google Identity Services yang asli di baliknya.
 *
 * Trik yang dipakai: Google mengharuskan tombolnya sendiri yang di-render
 * (via `renderButton`) supaya klik dianggap gesture asli oleh browser/Google —
 * tombol custom buatan sendiri tidak bisa langsung memicu popup Google.
 * Solusinya: render tombol asli Google di container tersembunyi, lalu
 * teruskan klik dari tombol custom kita ke tombol asli itu secara terprogram,
 * dalam call stack yang sama (synchronous) sehingga browser tetap
 * menganggapnya berasal dari interaksi pengguna.
 *
 * Props:
 *  - onCredential(idToken): dipanggil saat Google berhasil mengembalikan ID token
 *  - onError(message): dipanggil kalau script gagal dimuat / konfigurasi kosong
 *  - disabled: nonaktifkan tombol (mis. saat form lain sedang submit)
 *  - label: teks tombol
 */
export default function GoogleAuthButton({ onCredential, onError, disabled = false, label = 'Lanjutkan dengan Google' }) {
  const hiddenContainerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [configMissing] = useState(!GOOGLE_CLIENT_ID)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    if (window.google?.accounts?.id) {
      setReady(true)
      return
    }

    const existing = document.querySelector('script[data-google-gsi]')
    if (existing) {
      existing.addEventListener('load', () => setReady(true))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleGsi = 'true'
    script.onload = () => setReady(true)
    script.onerror = () => onError?.('Gagal memuat skrip Google Sign-In. Periksa koneksi internet kamu.')
    document.head.appendChild(script)
  }, [onError])

  useEffect(() => {
    if (!ready || !hiddenContainerRef.current || !GOOGLE_CLIENT_ID) return

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (response) => {
        if (response?.credential) {
          onCredential(response.credential)
        } else {
          onError?.('Google tidak mengembalikan kredensial. Coba lagi.')
        }
      },
      auto_select: false,
    })

    hiddenContainerRef.current.innerHTML = ''
    window.google.accounts.id.renderButton(hiddenContainerRef.current, {
      type: 'standard',
      theme: 'filled_black',
      size: 'large',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const handleClick = () => {
    if (configMissing) {
      onError?.('Login Google belum dikonfigurasi di aplikasi ini (NEXT_PUBLIC_GOOGLE_CLIENT_ID kosong).')
      return
    }
    if (!ready) {
      onError?.('Google Sign-In masih memuat, coba lagi sebentar.')
      return
    }
    // Teruskan klik ke tombol asli Google yang tersembunyi
    const realButton = hiddenContainerRef.current?.querySelector('div[role="button"]')
    realButton?.click()
  }

  return (
    <>
      {/* Tombol asli Google — disembunyikan dari layar tapi tetap "hidup" secara DOM */}
      <div
        ref={hiddenContainerRef}
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        style={{
          width: '100%',
          height: '44px',
          borderRadius: '10px',
          background: 'var(--gbtn-bg, #22252b)',
          border: '1px solid var(--gbtn-border, #33363d)',
          color: 'var(--gbtn-text, #cbd5e1)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontWeight: 500,
          fontSize: '0.875rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          transition: 'all 180ms ease',
          opacity: disabled ? 0.4 : 1,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        {label}
      </button>
    </>
  )
}
