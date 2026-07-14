import { avatarPalette } from "./tokens";

function getInitials(name = "") {
  return name
    .split(/[\s_]/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function paletteFor(name = "") {
  const code = name.charCodeAt(0) || 0;
  return avatarPalette[code % avatarPalette.length];
}

// Preset bingkai avatar — dipilih user lewat halaman edit profil, disimpan
// sebagai Profile.avatarBorder (string key), dirender di sini jadi gradient ring.
const BORDER_GRADIENTS = {
  gold:    "linear-gradient(135deg, #fde047, #f59e0b, #fde047)",
  blue:    "linear-gradient(135deg, #7dd3fc, #1d9bf0, #7dd3fc)",
  fire:    "linear-gradient(135deg, #fda4af, #ef4444, #f59e0b)",
  emerald: "linear-gradient(135deg, #86efac, #10b981, #86efac)",
  rainbow: "linear-gradient(135deg, #f87171, #fbbf24, #34d399, #60a5fa, #a78bfa)",
};

export const AVATAR_BORDER_PRESETS = [
  { value: "none",    label: "Tanpa bingkai" },
  { value: "gold",    label: "Emas" },
  { value: "blue",    label: "Biru" },
  { value: "fire",    label: "Api" },
  { value: "emerald", label: "Emerald" },
  { value: "rainbow", label: "Pelangi" },
];

/**
 * Avatar
 * - username: used for initials fallback + deterministic color
 * - src: real photo URL, if available (Profile.avatarUrl)
 * - border: preset key for decorative ring (Profile.avatarBorder)
 * - size: pixel diameter
 * - verified: shows a small checkmark badge (expert / verified users)
 */
export default function Avatar({ username = "", src, border, size = 40, verified = false }) {
  const { bg, color } = paletteFor(username);
  const badgeSize = Math.max(12, Math.round(size * 0.34));
  const gradient = border && BORDER_GRADIENTS[border];
  const ringPad = gradient ? Math.max(2, Math.round(size * 0.06)) : 0;
  const innerSize = size - ringPad * 2;

  const avatarNode = src ? (
    <img
      src={src}
      alt={username}
      style={{ width: innerSize, height: innerSize, borderRadius: "50%", objectFit: "cover", display: "block" }}
    />
  ) : (
    <span
      style={{
        width: innerSize,
        height: innerSize,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: Math.round(innerSize * 0.36),
        fontWeight: 700,
        letterSpacing: 0.2,
      }}
    >
      {getInitials(username) || "?"}
    </span>
  );

  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, lineHeight: 0 }}>
      {gradient ? (
        <span
          style={{
            width: size, height: size, borderRadius: "50%",
            background: gradient, padding: ringPad,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          {avatarNode}
        </span>
      ) : (
        <span style={{ width: size, height: size, display: "flex" }}>{avatarNode}</span>
      )}
      {verified && (
        <span
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: badgeSize,
            height: badgeSize,
            borderRadius: "50%",
            background: "#1d9bf0",
            border: "2px solid #000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7" stroke="#000" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </span>
  );
}
