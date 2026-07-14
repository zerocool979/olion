import { useState } from "react";
import Avatar from "./Avatar";
import StatPill from "./StatPill";
import { colors } from "./tokens";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(dateStr).toLocaleDateString();
}

function compactNumber(n = 0) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return `${n}`;
}

/**
 * DiscussionCard
 * Renders one discussion/post in the feed.
 *
 * Accepts the same shapes the original feed used:
 *   post.author.profile.username / post.author.username
 *   post.title / post.content
 *   post._count.votes / post.votes
 *   post._count.comments / post.commentCount
 *   post.viewCount / post.views
 *
 * - onLike(post, nextLiked): called when the like button is toggled
 * - onComment(post): called when the comment button is clicked
 * - onOpen(post): called when the card itself is clicked (open detail)
 */
export default function DiscussionCard({ post, onLike, onComment, onOpen }) {
  // FIX: backend SELALU mengirim penulis sebagai `post.user` (lihat
  // DISCUSSION_INCLUDE di discussion/service.js dan semua endpoint terkait),
  // bukan `post.author`. Karena komponen ini hanya mencari `post.author`,
  // nama & foto penulis tidak pernah tampil di kartu diskusi manapun di
  // seluruh app — selalu jatuh ke "Anonim" tanpa avatar asli.
  const authorSource = post.user ?? post.author ?? {};
  const author = authorSource.profile ?? authorSource ?? {};
  const username = author.username ?? "Anonim";
  const avatarSrc = author.avatarUrl ?? author.avatar ?? null;
  const avatarBorder = author.avatarBorder ?? null;
  const verified = authorSource.isVerifiedExpert ?? post.author?.isExpert ?? author.isExpert ?? false;
  const text = post.title ?? post.content ?? "";
  const category = post.category?.name ?? post.category ?? null;
  const votes = post._count?.votes ?? post.votes ?? 0;
  const comments = post._count?.comments ?? post.commentCount ?? 0;
  const views = post.viewCount ?? post.views ?? 0;

  const [liked, setLiked] = useState(Boolean(post.likedByMe ?? (post.userVote === 1)));

  const handleLike = (e) => {
    e.stopPropagation();
    const next = !liked;
    setLiked(next);
    onLike?.(post, next);
  };

  const handleComment = (e) => {
    e.stopPropagation();
    onComment?.(post);
  };

  return (
    <article
      onClick={() => onOpen?.(post)}
      style={{
        display: "flex",
        gap: 12,
        padding: "14px 16px",
        borderBottom: `1px solid ${colors.border}`,
        cursor: onOpen ? "pointer" : "default",
        transition: "background-color .15s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.bgHover)}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <Avatar username={username} src={avatarSrc} border={avatarBorder} verified={verified} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>{username}</span>
          <span style={{ fontSize: 13, color: colors.textSecondary }}>· {timeAgo(post.createdAt)}</span>
          {category && (
            <span style={{ marginLeft: "auto" }}>
              <StatPill variant="tag" tone="accent" label={category} />
            </span>
          )}
        </div>

        <p style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 1.5, marginBottom: 10, whiteSpace: "pre-wrap" }}>
          {text.length > 280 ? text.slice(0, 280) + "…" : text}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: -8 }}>
          <StatPill icon="💬" label={compactNumber(comments)} onClick={handleComment} />
          <StatPill
            icon={liked ? "❤️" : "🤍"}
            label={compactNumber(votes + (liked ? 1 : 0))}
            tone="like"
            active={liked}
            onClick={handleLike}
          />
          <StatPill icon="👁" label={compactNumber(views)} />
        </div>
      </div>
    </article>
  );
}



