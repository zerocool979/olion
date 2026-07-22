import { useState, useRef, useEffect } from 'react'
import { colors } from '../dashboard/tokens'

const EMOJI_CATEGORIES = [
  {
    label: 'Sering dipakai',
    icon: '🕐',
    emojis: ['😀', '😂', '🥹', '😍', '🥰', '😘', '😎', '🤔', '😅', '😭', '😡', '👍', '👎', '🙏', '👏', '🔥', '❤️', '💯'],
  },
  {
    label: 'Wajah & Emosi',
    icon: '😀',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗',
      '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏',
      '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '😵', '🤯',
      '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢',
      '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬'],
  },
  {
    label: 'Gestur & Tangan',
    icon: '👍',
    emojis: ['👍', '👎', '👌', '🤌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👋', '🤚', '🖐️',
      '✋', '🖖', '👏', '🙌', '🤝', '🙏', '✊', '👊', '🤛', '🤜', '💪'],
  },
  {
    label: 'Hati & Simbol',
    icon: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘',
      '💝', '💯', '💢', '💥', '💫', '💦', '💨', '🔥', '⭐', '🌟', '✨', '🎉', '🎊', '✅', '❌', '⚠️'],
  },
]

export default function EmojiPicker({ onSelect, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose?.()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [onClose])

  return (
    <div ref={ref} style={{
      position: 'absolute', bottom: '100%', right: 0, marginBottom: 8,
      width: 300, maxHeight: 320, background: colors.bgElevated,
      border: `1px solid ${colors.border}`, borderRadius: 14,
      boxShadow: '0 8px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', zIndex: 60,
    }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
        {EMOJI_CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            onClick={() => setActiveTab(i)}
            title={cat.label}
            style={{
              flex: 1, padding: '8px 0', background: activeTab === i ? colors.bg : 'none',
              border: 'none', borderBottom: activeTab === i ? `2px solid ${colors.accent}` : '2px solid transparent',
              fontSize: 16, cursor: 'pointer',
            }}
          >
            {cat.icon}
          </button>
        ))}
      </div>
      <div style={{
        padding: 8, overflowY: 'auto', display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)', gap: 2,
      }}>
        {EMOJI_CATEGORIES[activeTab].emojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => onSelect(emoji)}
            style={{
              background: 'none', border: 'none', fontSize: 20, padding: 6,
              borderRadius: 8, cursor: 'pointer', lineHeight: 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = colors.border)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
