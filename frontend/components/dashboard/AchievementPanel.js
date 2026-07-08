import { colors } from "./tokens";
import SkeletonCard from "./SkeletonCard";

/**
 * AchievementPanel
 * Boxed sidebar panel (same shape as a "Subscribe to Premium" / "Today's News"
 * card) used to show a user's earned badges / reputation milestones.
 *
 * achievements: [{ id, icon, label, unlocked, hint }]
 * footer: optional node rendered below the grid (e.g. a "Lihat semua" link)
 */
export default function AchievementPanel({
  title = "Pencapaian",
  icon = "🏆",
  achievements = [],
  loading = false,
  emptyMessage = "Belum ada pencapaian.",
  footer,
}) {
  return (
    <div
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 16,
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontWeight: 800, fontSize: 16, color: colors.textPrimary }}>{title}</span>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} variant="panel" />
          ))}
        </div>
      ) : achievements.length === 0 ? (
        <p style={{ fontSize: 13, color: colors.textSecondary }}>{emptyMessage}</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {achievements.map((a) => (
            <div
              key={a.id}
              title={a.hint}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "12px 8px",
                borderRadius: 12,
                background: a.unlocked ? colors.goldSoft : colors.bgElevated,
                opacity: a.unlocked ? 1 : 0.45,
              }}
            >
              <span style={{ fontSize: 22 }}>{a.icon ?? "🏅"}</span>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: colors.textPrimary, textAlign: "center" }}>
                {a.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {footer && <div style={{ marginTop: 12 }}>{footer}</div>}
    </div>
  );
}



