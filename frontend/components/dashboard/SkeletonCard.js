import { colors } from "./tokens";

const pulseKeyframes = "@keyframes dash-skeleton-pulse{0%,100%{opacity:1}50%{opacity:.4}}";

function Bar({ w = "100%", h = 12, radius = 6 }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: colors.bgElevated,
        animation: "dash-skeleton-pulse 1.4s ease-in-out infinite",
      }}
    />
  );
}

/**
 * SkeletonCard
 * variant="post"  -> avatar + 3 lines (feed loading state)
 * variant="row"   -> small avatar + 2 lines, optional rank/action slot (leaderboard, follow list)
 * variant="panel" -> bare lines only (generic panel content)
 */
export default function SkeletonCard({ variant = "post", rank = false, action = false }) {
  return (
    <>
      <style>{pulseKeyframes}</style>

      {variant === "post" && (
        <div style={{ display: "flex", gap: 12, padding: "14px 16px", borderBottom: `1px solid ${colors.border}` }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: colors.bgElevated,
              flexShrink: 0,
              animation: "dash-skeleton-pulse 1.4s ease-in-out infinite",
            }}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <Bar w="35%" h={12} />
            <Bar w="100%" h={12} />
            <Bar w="70%" h={12} />
          </div>
        </div>
      )}

      {variant === "row" && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
          {rank && <Bar w={16} h={14} radius={4} />}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: colors.bgElevated,
              flexShrink: 0,
              animation: "dash-skeleton-pulse 1.4s ease-in-out infinite",
            }}
          />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <Bar w="60%" h={12} />
            <Bar w="35%" h={10} />
          </div>
          {action && <Bar w={56} h={26} radius={999} />}
        </div>
      )}

      {variant === "panel" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "6px 0" }}>
          <Bar w="80%" h={12} />
          <Bar w="55%" h={12} />
        </div>
      )}
    </>
  );
}



