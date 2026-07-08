import { useState, useEffect, useContext, useCallback, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import api from "../../lib/api";
import olionLogo from "../../components/images/olion.png";
import {
  Avatar,
  StatPill,
  EmptyState,
  DiscussionCard,
  TrendingRow,
  SkeletonCard,
  AchievementPanel,
  ActivityItem,
  colors,
} from "../../components/dashboard";

/* ─── nav items ─── */
const navItems = [
  { icon: "🏠", label: "Beranda", href: "/user", active: true },
  { icon: "🔍", label: "Jelajahi", href: "/user/discussions" },
  { icon: "🔔", label: "Notifikasi", href: "/user/notifications", dot: true },
  { icon: "👥", label: "Ikuti", href: "/user/following" },
  { icon: "💬", label: "Obrolan", href: "/user/chat" },
  { icon: "🎓", label: "Pakar", href: "/user/experts" },
  { icon: "👤", label: "Profil", href: "/user/profile" },
  { icon: "•••", label: "Lainnya", href: "#" },
];

/* ─── reputation tiers → derived achievements (no fake numbers, just thresholds on the real `reputation` value) ─── */
const REPUTATION_TIERS = [
  { id: "pemula", icon: "🌱", label: "Pemula", threshold: 0 },
  { id: "aktif", icon: "✍️", label: "Aktif", threshold: 100 },
  { id: "tepercaya", icon: "🔥", label: "Tepercaya", threshold: 500 },
  { id: "ahli", icon: "🎓", label: "Ahli", threshold: 2000 },
];

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j`;
  return `${Math.floor(diff / 86400)}h`;
}

/* ─── main component ─── */
export default function UserDashboard() {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("untukmu");
  const [composeText, setComposeText] = useState("");

  /* feed */
  const [feed, setFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);

  /* top 10 leaderboard */
  const [top10, setTop10] = useState([]);
  const [top10Loading, setTop10Loading] = useState(true);

  /* suggested follows = users + experts */
  const [suggested, setSuggested] = useState([]);
  const [suggestedLoading, setSuggestedLoading] = useState(true);
  const [followingMap, setFollowingMap] = useState({});

  /* recent activity / notifications */
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  /* new-post count banner */
  const [newCount, setNewCount] = useState(0);

  const username = user?.profile?.username ?? user?.username ?? "Kamu";
  const reputation = user?.profile?.reputation ?? user?.reputation ?? 0;

  const achievements = REPUTATION_TIERS.map((tier) => ({
    id: tier.id,
    icon: tier.icon,
    label: tier.label,
    unlocked: reputation >= tier.threshold,
    hint: `${tier.threshold.toLocaleString()} rep`,
  }));

  // FIX: the 30s poll below used to compare against `feed` captured by the
  // effect's closure (always [] since setFeed resolves asynchronously after
  // the effect runs), so `!feed[0]` was always true and newCount kept
  // incrementing every 30s even with no new discussion. Track the latest
  // feed's first id in a ref that always reflects the current render.
  const latestFeedIdRef = useRef(null);
  useEffect(() => {
    latestFeedIdRef.current = feed[0]?.id ?? null;
  }, [feed]);

  /* fetch on mount */
  useEffect(() => {
    if (!user) return;

    /* feed */
    api
      .get("/discussions?limit=10&sort=recent")
      .then((r) => {
        const d = r.data?.data ?? r.data ?? [];
        setFeed(Array.isArray(d) ? d : []);
      })
      .catch(() => setFeed([]))
      .finally(() => setFeedLoading(false));

    /* top-10 leaderboard */
    api
      .get("/leaderboard?limit=10")
      .then((r) => {
        const d = r.data?.data ?? r.data ?? [];
        setTop10(Array.isArray(d) ? d : []);
      })
      .catch(() => setTop10([]))
      .finally(() => setTop10Loading(false));

    /* suggested: experts first, then regular users */
    Promise.allSettled([api.get("/users?role=expert&limit=5"), api.get("/users?limit=5&sort=reputation")])
      .then(([expertsRes, usersRes]) => {
        const experts = (expertsRes.status === "fulfilled" ? expertsRes.value.data?.data ?? expertsRes.value.data ?? [] : []).map((u) => ({
          ...u,
          isExpert: true,
        }));

        const users = usersRes.status === "fulfilled" ? usersRes.value.data?.data ?? usersRes.value.data ?? [] : [];

        const seen = new Set(experts.map((e) => e.id));
        const merged = [...experts, ...users.filter((u) => !seen.has(u.id) && u.id !== user.id)].slice(0, 8);

        setSuggested(merged);
      })
      .finally(() => setSuggestedLoading(false));

    /* recent activity / notifications */
    api
      .get("/notifications?limit=6")
      .then((r) => {
        const d = r.data?.data ?? r.data ?? [];
        setActivity(Array.isArray(d) ? d : []);
      })
      .catch(() => setActivity([]))
      .finally(() => setActivityLoading(false));

    /* poll for new posts every 30 s */
    const poll = setInterval(() => {
      api
        .get("/discussions?limit=1&sort=recent")
        .then((r) => {
          const d = r.data?.data ?? r.data ?? [];
          if (Array.isArray(d) && d[0] && d[0].id !== latestFeedIdRef.current) setNewCount((c) => c + 1);
        })
        .catch(() => {});
    }, 30_000);
    return () => clearInterval(poll);
  }, [user]);

  const handleShowNew = useCallback(() => {
    setFeedLoading(true);
    setNewCount(0);
    api
      .get("/discussions?limit=10&sort=recent")
      .then((r) => {
        const d = r.data?.data ?? r.data ?? [];
        setFeed(Array.isArray(d) ? d : []);
      })
      .catch(() => {})
      .finally(() => setFeedLoading(false));
  }, []);

  const handleVote = useCallback(async (post, liked) => {
    try {
      await api.post("/votes", { discussionId: post.id, value: liked ? 1 : 0 });
    } catch (err) {
      console.error("Vote error:", err);
    }
  }, []);

  const handleFollow = useCallback(
    (targetId) => {
      const nextFollowing = !followingMap[targetId];
      setFollowingMap((prev) => ({ ...prev, [targetId]: nextFollowing }));

      (async () => {
        try {
          if (nextFollowing) await api.post(`/users/${targetId}/follow`);
          else await api.delete(`/users/${targetId}/follow`);
        } catch (err) {
          console.error("Follow error:", err);
          setFollowingMap((prev) => ({ ...prev, [targetId]: !nextFollowing }));
        }
      })();
    },
    [followingMap]
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "220px 1fr 300px",
        height: "100vh",
        fontFamily: "system-ui, sans-serif",
        background: colors.bg,
      }}
    >
      {/* ══ LEFT NAV ══ */}
      <nav
        style={{
          borderRight: `1px solid ${colors.border}`,
          display: "flex",
          flexDirection: "column",
          padding: "8px 0",
          background: colors.bg,
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "12px 20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <Image
            src={olionLogo}
            alt="OLION"
            width={32}
            height={32}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <span style={{ fontWeight: 700, fontSize: 16, color: colors.textPrimary }}>OLION</span>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "10px 20px",
              textDecoration: "none",
              fontWeight: item.active ? 700 : 400,
              color: item.active ? colors.textPrimary : colors.textSecondary,
              fontSize: 15,
              position: "relative",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = colors.bgElevated)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: 18, width: 22, textAlign: "center" }}>{item.icon}</span>
            {item.label}
            {item.dot && (
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: colors.accent,
                  position: "absolute",
                  top: 10,
                  left: 32,
                }}
              />
            )}
          </Link>
        ))}

        <div style={{ padding: "12px 16px", marginTop: 8 }}>
          <Link
            href="/user/create"
            style={{
              display: "block",
              textAlign: "center",
              background: colors.textPrimary,
              color: "#000",
              textDecoration: "none",
              borderRadius: 24,
              padding: "10px 0",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            Buat Diskusi
          </Link>
        </div>

        <div
          style={{
            marginTop: "auto",
            borderTop: `1px solid ${colors.border}`,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Avatar username={username} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: colors.textPrimary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {username}
            </div>
            <div style={{ fontSize: 11, color: colors.textSecondary }}>{reputation.toLocaleString()} rep</div>
          </div>
          <span style={{ color: colors.textSecondary, fontSize: 16, cursor: "pointer" }}>···</span>
        </div>
      </nav>

      {/* ══ MAIN FEED ══ */}
      <main
        style={{
          borderRight: `1px solid ${colors.border}`,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: `1px solid ${colors.border}`,
            position: "sticky",
            top: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 10,
          }}
        >
          {[["untukmu", "Untukmu"], ["mengikuti", "Mengikuti"]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveTab(val)}
              style={{
                flex: 1,
                padding: "14px 0",
                background: "none",
                border: "none",
                borderBottom: activeTab === val ? `2px solid ${colors.accent}` : "2px solid transparent",
                fontWeight: activeTab === val ? 700 : 400,
                color: activeTab === val ? colors.textPrimary : colors.textSecondary,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* compose */}
        <div style={{ padding: "12px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", gap: 12 }}>
          <Avatar username={username} />
          <div style={{ flex: 1 }}>
            <textarea
              value={composeText}
              onChange={(e) => setComposeText(e.target.value)}
              placeholder="Apa yang sedang kamu pikirkan?"
              rows={2}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: 15,
                resize: "none",
                color: colors.textPrimary,
                background: "transparent",
                fontFamily: "inherit",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderTop: `1px solid ${colors.border}`,
                paddingTop: 10,
              }}
            >
              <div style={{ flex: 1 }} />
              <Link
                href="/user/create"
                style={{
                  background: composeText ? colors.accent : colors.accentHover,
                  opacity: composeText ? 1 : 0.5,
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: 20,
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Post
              </Link>
            </div>
          </div>
        </div>

        {/* new posts banner */}
        {newCount > 0 && (
          <div style={{ display: "flex", justifyContent: "center", padding: "6px 0", borderBottom: `1px solid ${colors.border}` }}>
            <StatPill icon="↑" label={`Tampilkan ${newCount} diskusi baru`} tone="accent" active onClick={handleShowNew} />
          </div>
        )}

        {/* posts */}
        {feedLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="post" />)
        ) : feed.length === 0 ? (
          <EmptyState
            icon="◎"
            title="Belum ada diskusi"
            description="Jadilah yang pertama membagikan pertanyaan atau wawasan di OLION."
            actionLabel="Buat Diskusi"
            actionHref="/user/create"
            Link={Link}
          />
        ) : (
          feed.map((post) => (
            <Link
              key={post.id}
              href={`/user/discussions/${post.id}`}
              style={{ textDecoration: "none", display: "block" }}
            >
             <DiscussionCard key={post.id} post={post} onLike={handleVote} />
            </Link>
        ))
        )}
      </main>

      {/* ══ RIGHT SIDEBAR ══ */}
      <aside
        style={{
          background: colors.bg,
          padding: "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto",
        }}
      >
        {/* search */}
        <div
          style={{
            background: colors.bgElevated,
            border: `1px solid ${colors.border}`,
            borderRadius: 24,
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: colors.textSecondary }}>🔍</span>
          <input
            placeholder="Cari diskusi…"
            style={{
              border: "none",
              outline: "none",
              fontSize: 14,
              background: "transparent",
              color: colors.textPrimary,
              width: "100%",
            }}
          />
        </div>

        {/* ── TOP 10 ── */}
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>Top 10 Tier</span>
            <Link href="/user/leaderboard" style={{ fontSize: 12, color: colors.accent, textDecoration: "none" }}>
              Lihat semua →
            </Link>
          </div>
          {top10Loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} variant="row" rank />)
          ) : top10.length === 0 ? (
            <p style={{ fontSize: 13, color: colors.textSecondary }}>Belum ada data.</p>
          ) : (
            top10.slice(0, 10).map((u, i) => {
              const uname = u.profile?.username ?? u.username ?? "Anonim";
              const rep = u.profile?.reputation ?? u.reputation ?? 0;
              return (
                <TrendingRow
                  key={u.id ?? i}
                  rank={i + 1}
                  avatar={<Avatar username={uname} size={28} verified={u.isExpert ?? u.profile?.isExpert ?? false} />}
                  title={uname}
                  subtitle={`${rep.toLocaleString()} rep`}
                  trailing={i === 0 ? <StatPill variant="tag" tone="gold" label="#1" /> : null}
                />
              );
            })
          )}
        </div>

        {/* ── REPUTASI ── */}
        <AchievementPanel
          title="Reputasi"
          icon="🏆"
          achievements={achievements}
          footer={
            <Link href="/user/leaderboard" style={{ fontSize: 12, color: colors.accent, textDecoration: "none" }}>
              Lihat papan peringkat →
            </Link>
          }
        />

        {/* ── AKTIVITAS ── */}
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>🔔 Aktivitas</span>
            <Link href="/user/notifications" style={{ fontSize: 12, color: colors.accent, textDecoration: "none" }}>
              Semua →
            </Link>
          </div>
          {activityLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
          ) : activity.length === 0 ? (
            <p style={{ fontSize: 13, color: colors.textSecondary }}>Belum ada aktivitas terbaru.</p>
          ) : (
            activity.slice(0, 6).map((item, i) => {
              const actor = item.actor?.profile ?? item.actor ?? {};
              const actorName = actor.username ?? "Seseorang";
              const message = item.message ?? item.text ?? item.type ?? "";
              return (
                <ActivityItem
                  key={item.id ?? i}
                  avatar={<Avatar username={actorName} src={actor.avatarUrl ?? actor.avatar} size={32} />}
                  primary={actorName}
                  secondary={message}
                  timestamp={timeAgo(item.createdAt)}
                  unread={!item.read}
                />
              );
            })
          )}
        </div>

        {/* ── SIAPA UNTUK DIIKUTI ── */}
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>👥 Siapa untuk diikuti</span>
            <Link href="/user/experts" style={{ fontSize: 12, color: colors.accent, textDecoration: "none" }}>
              Lihat →
            </Link>
          </div>
          {suggestedLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} variant="row" action />)
          ) : suggested.length === 0 ? (
            <p style={{ fontSize: 13, color: colors.textSecondary }}>Tidak ada saran saat ini.</p>
          ) : (
            suggested.map((person) => {
              const uname = person.profile?.username ?? person.username ?? "Anonim";
              const rep = person.profile?.reputation ?? person.reputation ?? 0;
              const isExpert = person.isExpert ?? false;
              const isFollowing = Boolean(followingMap[person.id]);
              return (
                <ActivityItem
                  key={person.id}
                  avatar={<Avatar username={uname} size={34} />}
                  primary={
                    <>
                      {uname}
                      {isExpert && (
                        <span style={{ marginLeft: 6 }}>
                          <StatPill variant="tag" tone="accent" label="Pakar" />
                        </span>
                      )}
                    </>
                  }
                  secondary={`${rep.toLocaleString()} rep`}
                  action={{
                    label: isFollowing ? "Mengikuti" : "Ikuti",
                    active: isFollowing,
                    onClick: () => handleFollow(person.id),
                  }}
                />
              );
            })
          )}
        </div>

        {/* footer */}
        <p style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.9 }}>
          Syarat Layanan · Kebijakan Privasi · Cookie · Tentang
          <br />© 2026 OLION Corp.
        </p>
      </aside>
    </div>
  );
}



