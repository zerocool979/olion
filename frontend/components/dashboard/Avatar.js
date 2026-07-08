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

/**
 * Avatar
 * - username: used for initials fallback + deterministic color
 * - src: real photo URL, if available
 * - size: pixel diameter
 * - verified: shows a small checkmark badge (expert / verified users)
 */
export default function Avatar({ username = "", src, size = 40, verified = false }) {
  const { bg, color } = paletteFor(username);
  const badgeSize = Math.max(12, Math.round(size * 0.34));

  return (
    <span style={{ position: "relative", display: "inline-flex", flexShrink: 0, lineHeight: 0 }}>
      {src ? (
        <img
          src={src}
          alt={username}
          style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }}
        />
      ) : (
        <span
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: bg,
            color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: Math.round(size * 0.36),
            fontWeight: 700,
            letterSpacing: 0.2,
          }}
        >
          {getInitials(username) || "?"}
        </span>
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



