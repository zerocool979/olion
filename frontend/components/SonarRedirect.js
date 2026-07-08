import { useState, useEffect } from 'react'

/**
 * Komponen animasi redirect dengan efek sonar, typewriter, partikel,
 * dan progress bar. Teks yang ditampilkan bisa diubah via props.
 *
 * @param {string} [message='Kamu belum login :)'] - Teks yang akan diketik
 */
export default function SonarRedirect({ message = 'Kamu belum login :)' }) {
  const [displayedText, setDisplayedText] = useState('')
  const [step, setStep] = useState(0)

  // Efek typewriter
  useEffect(() => {
    if (step >= message.length) return
    const timer = setTimeout(() => {
      setDisplayedText((prev) => prev + message[step])
      setStep((s) => s + 1)
    }, 50)
    return () => clearTimeout(timer)
  }, [step, message])

  // Partikel (statis, dihitung sekali)
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }))

  return (
    <div className="sonar-redirect">
      <div className="page-grid-bg" />

      {/* Partikel */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="sonar-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <div className="sonar-redirect__inner animate-fade-up">
        {/* Logo dengan sonar */}
        <div className="sonar-logo">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="sonar-ring"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}
          <span className="sonar-dot" />
        </div>

        {/* Teks typewriter dengan gradasi */}
        <p className="sonar-text">
          {displayedText}
          <span className="sonar-cursor">|</span>
        </p>

        {/* Progress bar */}
        <div className="sonar-progress">
          <div className="sonar-progress-bar" />
        </div>
      </div>
    </div>
  )
}



