import { colors } from "./tokens";

const TONES = {
  neutral: { color: colors.textSecondary, hoverBg: "rgba(231,233,234,0.1)", hoverColor: colors.textPrimary },
  accent: { color: colors.accent, hoverBg: colors.accentSoft, hoverColor: colors.accent },
  like: { color: colors.like, hoverBg: colors.likeSoft, hoverColor: colors.like },
  gold: { color: colors.gold, hoverBg: colors.goldSoft, hoverColor: colors.gold },
};

/**
 * StatPill
 * variant="stat" -> interactive icon+count button (comments, likes, views)
 * variant="tag"  -> static rounded label (category, "Pakar", "#1", etc.)
 *
 * tone: "neutral" | "accent" | "like" | "gold"
 * active: true once the user has performed the action (e.g. liked)
 */
export default function StatPill({ icon, label, tone = "neutral", active = false, variant = "stat", onClick }) {
  const resolvedTone = active && tone === "neutral" ? "accent" : tone;
  const t = TONES[resolvedTone] ?? TONES.neutral;

  if (variant === "tag") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          fontWeight: 600,
          color: t.color,
          background: t.hoverBg,
          borderRadius: 999,
          padding: "2px 9px",
          lineHeight: 1.6,
          whiteSpace: "nowrap",
        }}
      >
        {icon} {label}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        color: t.color,
        fontSize: 13,
        padding: "6px 8px",
        borderRadius: 999,
        transition: "background-color .15s, color .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = t.hoverBg;
        e.currentTarget.style.color = t.hoverColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "transparent";
        e.currentTarget.style.color = t.color;
      }}
    >
      <span style={{ fontSize: 15, lineHeight: 1 }}>{icon}</span>
      {label != null && <span>{label}</span>}
    </button>
  );
}



