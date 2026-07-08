import { colors } from "./tokens";

const actionStyle = {
  display: "inline-block",
  marginTop: 14,
  background: colors.accent,
  color: "#fff",
  textDecoration: "none",
  borderRadius: 999,
  padding: "9px 20px",
  fontSize: 14,
  fontWeight: 700,
};

/**
 * EmptyState
 * - Link: optional routing component (e.g. next/link) injected from the app,
 *   so this package has no hard dependency on a router. Falls back to <a>.
 */
export default function EmptyState({ icon = "◎", title, description, actionLabel, onAction, actionHref, Link }) {
  const LinkComp = Link || "a";

  return (
    <div style={{ padding: "48px 24px", textAlign: "center", color: colors.textSecondary }}>
      <div style={{ fontSize: 34, marginBottom: 10 }}>{icon}</div>
      {title && (
        <p style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>{title}</p>
      )}
      {description && <p style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 320, margin: "0 auto" }}>{description}</p>}

      {actionLabel &&
        (actionHref ? (
          <LinkComp href={actionHref} style={actionStyle}>
            {actionLabel}
          </LinkComp>
        ) : (
          <button onClick={onAction} style={{ ...actionStyle, border: "none", cursor: "pointer" }}>
            {actionLabel}
          </button>
        ))}
    </div>
  );
}



