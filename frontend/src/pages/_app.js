// src/pages/_app.js

// ==============================
// ORIGINAL CODE (DO NOT DELETE)
// ==============================
// 'use client'; // Wajib untuk menggunakan hooks
//
// import { AuthProvider } from '../context/AuthContext';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
//
// // Custom Theme
// const theme = createTheme({
//   palette: {
//     mode: 'light',
//     primary: {
//       main: '#1976d2',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//   },
// });
//
// // Hapus getInitialProps jika ada
// // export function getInitialProps() {} // ❌ HAPUS/JANGAN GUNAKAN
//
// function MyApp({ Component, pageProps }) {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <AuthProvider>
//         <Component {...pageProps} />
//       </AuthProvider>
//     </ThemeProvider>
//   );
// }
//
// // JANGAN gunakan getInitialProps di App Router
// // MyApp.getInitialProps = async () => {} // ❌ HAPUS
//
// export default MyApp;

// ==============================
// FINAL IMPLEMENTATION
// ==============================

import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// NOTE:
// ❗ Jangan gunakan 'use client' di Pages Router
// ❗ 'use client' hanya untuk App Router (src/app)

// Theme global aplikasi
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {/* Semua halaman HARUS masuk lewat sini */}
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;
