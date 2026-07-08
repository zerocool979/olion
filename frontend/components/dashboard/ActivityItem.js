import { colors } from "./tokens";

/**
 * ActivityItem
 * Generic row used for:
 *  - follow suggestions (avatar + name + rep + Follow button)
 *  - notifications / activity feed entries (avatar + message + timestamp)
 *
 * - avatar: pass an <Avatar /> element
 * - primary: bold leading text (username, actor name)
 * - secondary: muted trailing text on the same line (rep · "followed you", etc.)
 * - action: { label, onClick, active } -> renders a pill button (e.g. Follow/Following)
 * - unread: shows a small accent dot for unread notifications
 */
export default function ActivityItem({ avatar, primary, secondary, timestamp, action, onClick, unread = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 0",
        borderBottom: `1px solid ${colors.border}`,
        cursor: onClick ? "pointer" : "default",
        position: "relative",
      }}
    >
      {unread && (
        <span
          style={{
            position: "absolute",
            left: -10,
            top: "50%",
            transform: "translateY(-50%)",
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: colors.accent,
          }}
        />
      )}

      {avatar}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            color: colors.textPrimary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span style={{ fontWeight: 700 }}>{primary}</span>
          {secondary ? <span style={{ color: colors.textSecondary }}> {secondary}</span> : null}
        </div>
        {timestamp && <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{timestamp}</div>}
      </div>

      {action && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            action.onClick?.();
          }}
          style={{
            border: action.active ? `1px solid ${colors.border}` : "none",
            background: action.active ? "transparent" : colors.textPrimary,
            color: action.active ? colors.textPrimary : "#000",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}



