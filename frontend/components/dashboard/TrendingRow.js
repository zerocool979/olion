import { colors } from "./tokens";

/**
 * TrendingRow
 * A flexible single row for ranked lists (leaderboard) or news/trending items.
 *
 * - rank: 1-based position; shows gold for top 3 (medal-style ranking)
 * - thumbnail: image URL (string) or a custom node (e.g. small image stack)
 * - avatar: pass an <Avatar /> element directly when the row represents a person
 * - title: primary line (username, headline)
 * - subtitle: secondary line (reputation, "6 hours ago · Sports · 39K posts")
 * - trailing: right-aligned slot (e.g. <StatPill variant="tag" .../>)
 * - href/Link: optional navigation
 */
export default function TrendingRow({ rank, thumbnail, avatar, title, subtitle, trailing, href, onClick, Link }) {
  const Wrapper = href ? Link || "a" : "div";
  const wrapperProps = href ? { href } : {};

  return (
    <Wrapper
      {...wrapperProps}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        textDecoration: "none",
        color: "inherit",
        cursor: href || onClick ? "pointer" : "default",
      }}
    >
      {rank != null && (
        <span
          style={{
            width: 20,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 800,
            color: rank <= 3 ? colors.gold : colors.textSecondary,
            flexShrink: 0,
          }}
        >
          {rank}
        </span>
      )}

      {thumbnail &&
        (typeof thumbnail === "string" ? (
          <img
            src={thumbnail}
            alt=""
            style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
          />
        ) : (
          thumbnail
        ))}

      {avatar}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: colors.textPrimary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      {trailing}
    </Wrapper>
  );
}



