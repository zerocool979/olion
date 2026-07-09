/**
 * pages/user/discussions/[id].jsx
 *
 * Detail diskusi — layout 3-kolom X (Twitter) style.
 * Semua logic dari useDiscussion hook dipertahankan persis.
 * Komponen dari ../../components/discussion dipakai semua.
 * Sidebar menampilkan: Info Diskusi · Penulis · Aksi · Diskusi Terkait.
 */
import Head from 'next/head'
import { useRouter }  from 'next/router'
import Link           from 'next/link'
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useDiscussion } from '../../../hooks/useDiscussion'
import api from '../../../lib/api'
import {
  DiscussionSkeleton,
  DiscussionHeader,
  DiscussionContent,
  DiscussionVote,
  CommentList,
  CommentForm,
  Toast,
} from '../../../components/discussion'
import {
  Avatar,
  TrendingRow,
  SkeletonCard,
  colors,
} from '../../../components/dashboard'
import UserLayout from '../_layout'

/* ─── small inline helpers ─── */

function InfoRow({ icon, label, value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 0', borderBottom: `1px solid ${colors.border}`,
    }}>
      <span style={{ color: colors.textSecondary, flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: colors.textSecondary, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div style={{
      padding: '60px 24px', textAlign: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
    }}>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
        stroke={colors.textSecondary} strokeWidth="1.4" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 6 }}>
          Diskusi tidak ditemukan
        </h2>
        <p style={{ fontSize: 14, color: colors.textSecondary }}>{message}</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => window.location.reload()} style={{
          border: `1px solid ${colors.border}`, background: 'none', borderRadius: 20,
          padding: '8px 18px', color: colors.textPrimary, fontSize: 13, cursor: 'pointer',
        }}>Coba Lagi</button>
        <Link href="/user/discussions" style={{
          border: `1px solid ${colors.border}`, borderRadius: 20,
          padding: '8px 18px', color: colors.textSecondary, fontSize: 13,
          textDecoration: 'none', display: 'inline-block',
        }}>← Kembali</Link>
      </div>
    </div>
  )
}

/* ─── reply form sub-component ─── */
function ReplyForm({ target, content, onChange, onSubmit, onCancel, submitting }) {
  if (!target) return null
  return (
    <div style={{
      margin: '10px 0 0 40px',
      padding: '12px 14px',
      background: colors.bgElevated,
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
    }}>
      <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 8 }}>
        Membalas{' '}
        <strong style={{ color: colors.accent }}>@{target.username}</strong>
      </p>
      <textarea
        value={content}
        onChange={e => onChange(e.target.value)}
        rows={2}
        placeholder="Tulis balasan…"
        style={{
          width: '100%', padding: '8px 12px', borderRadius: 8,
          border: `1px solid ${colors.border}`, background: colors.bg,
          color: colors.textPrimary, fontSize: 14, resize: 'vertical',
          outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={onSubmit}
          disabled={submitting || !content.trim()}
          style={{
            background: content.trim() ? colors.accent : colors.bgElevated,
            color: content.trim() ? '#fff' : colors.textSecondary,
            border: 'none', borderRadius: 20, padding: '6px 16px',
            fontSize: 13, fontWeight: 600, cursor: content.trim() ? 'pointer' : 'default',
          }}
        >
          {submitting ? 'Mengirim…' : 'Kirim Balasan'}
        </button>
        <button
          onClick={onCancel}
          style={{
            background: 'none', border: `1px solid ${colors.border}`,
            borderRadius: 20, padding: '6px 14px',
            fontSize: 13, color: colors.textSecondary, cursor: 'pointer',
          }}
        >
          Batal
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function DiscussionDetail() {
  const router      = useRouter()
  const { id }      = router.query
  const { user }    = useContext(AuthContext)

  /* ── semua state & handler dari useDiscussion (tidak diubah) ── */
  const {
    discussion,
    comments,
    loading,
    error,
    voteState,
    voteCount,
    votePending,
    isBookmarked,
    bookmarkPending,
    handleToggleBookmark,
    isEditing,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    editSubmitting,
    editError,
    startEdit,
    cancelEdit,
    handleSaveEdit,
    deleting,
    handleDeleteDiscussion,
    handleUpdateComment,
    handleDeleteComment,
    newComment,
    setNewComment,
    submitting,
    submitError,
    toast,
    replyTarget,
    setReplyTarget,
    replyContent,
    setReplyContent,
    replySubmitting,
    commentVotes,
    votingCommentId,
    handleVote,
    handleComment,
    handleReply,
    handleCommentVote,
    handleCopyLink,
    handleShare,
  } = useDiscussion(id)

  const isOwner = !!user && discussion?.userId === user.id
  const isStaff = !!user && ['ADMIN', 'MODERATOR'].includes(user.role)

  /* ── diskusi terkait (sidebar) ── */
  const [related,        setRelated]        = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)

  useEffect(() => {
    if (!discussion) return
    setRelatedLoading(true)
    const catId = discussion.category?.id ?? discussion.categoryId
    const param = catId ? `categoryId=${catId}` : `sort=votes`
    api.get(`/discussions?${param}&limit=5`)
      .then(r => {
        const d = r.data?.data ?? r.data ?? []
        setRelated(Array.isArray(d) ? d.filter(x => x.id !== discussion.id).slice(0, 4) : [])
      })
      .catch(() => setRelated([]))
      .finally(() => setRelatedLoading(false))
  }, [discussion])

  /* ── meta ── */
  const siteTitle = discussion ? `${discussion.title} — OLION` : 'Diskusi — OLION'
  const siteDesc  = discussion
    ? `${discussion.content?.slice(0, 155)}…`
    : 'Forum diskusi anonim modern — OLION'

  const authorName = discussion?.user?.profile?.username ?? 'Anonim'
  const isExpert   = discussion?.user?.isVerifiedExpert ?? false

  /* ══ SIDEBAR ══ */
  const sidebar = discussion ? (
    <>
      {/* Info Diskusi */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 4 }}>
          ℹ️ Info Diskusi
        </span>

        <InfoRow
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          }
          label="Dibuat"
          value={discussion.createdAt
            ? new Date(discussion.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            : '—'}
        />
        <InfoRow
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          }
          label="Kategori"
          value={discussion.category?.name ?? '—'}
        />
        <InfoRow
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          }
          label="Mode"
          value={discussion.mode === 'ANONYMOUS' ? '🕶 Anonim' : '🌐 Publik'}
        />
        <InfoRow
          icon={
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M7 2v10M2 7l5-5 5 5"/>
            </svg>
          }
          label="Vote"
          value={voteCount}
        />
        <InfoRow
          icon={
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          }
          label="Komentar"
          value={discussion._count?.comments ?? 0}
        />
        {discussion.viewCount != null && (
          <InfoRow icon="👁" label="Dilihat" value={(discussion.viewCount).toLocaleString()} />
        )}
      </div>

      {/* Penulis */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 12 }}>
          ✍️ Penulis
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar username={authorName} size={40} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: colors.textPrimary }}>{authorName}</div>
            {isExpert && (
              <span style={{
                display: 'inline-block', marginTop: 3,
                fontSize: 10, fontWeight: 700, padding: '2px 8px',
                borderRadius: 99, background: colors.accent + '22',
                color: colors.accent, border: `1px solid ${colors.accent}44`,
              }}>
                ✦ Verified Expert
              </span>
            )}
            {discussion.user?.profile?.reputation != null && (
              <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
                {discussion.user.profile.reputation.toLocaleString()} rep
              </div>
            )}
          </div>
        </div>
        {authorName && authorName !== 'Anonim' && (
          <Link href={`/user/profile/${encodeURIComponent(authorName)}`} style={{
            display: 'block', marginTop: 10, textAlign: 'center',
            border: `1px solid ${colors.border}`, borderRadius: 20,
            padding: '6px 0', fontSize: 12, color: colors.textSecondary,
            textDecoration: 'none', transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Lihat Profil →
          </Link>
        )}
      </div>

      {/* Aksi */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary, display: 'block', marginBottom: 10 }}>
          ⚡ Aksi
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={handleCopyLink} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: colors.bgElevated, border: `1px solid ${colors.border}`,
            borderRadius: 10, padding: '8px 12px',
            fontSize: 13, color: colors.textPrimary, cursor: 'pointer',
            width: '100%', textAlign: 'left', transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = colors.border)}
          onMouseLeave={e => (e.currentTarget.style.background = colors.bgElevated)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
            Salin Link
          </button>

          <button onClick={handleShare} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: colors.bgElevated, border: `1px solid ${colors.border}`,
            borderRadius: 10, padding: '8px 12px',
            fontSize: 13, color: colors.textPrimary, cursor: 'pointer',
            width: '100%', textAlign: 'left', transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = colors.border)}
          onMouseLeave={e => (e.currentTarget.style.background = colors.bgElevated)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
            Bagikan
          </button>

          {user && (
            <button onClick={handleToggleBookmark} disabled={bookmarkPending} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: isBookmarked ? '#facc1522' : colors.bgElevated,
              border: `1px solid ${isBookmarked ? '#facc1566' : colors.border}`,
              borderRadius: 10, padding: '8px 12px',
              fontSize: 13, color: isBookmarked ? '#facc15' : colors.textPrimary,
              cursor: bookmarkPending ? 'default' : 'pointer',
              width: '100%', textAlign: 'left', transition: 'background 0.12s',
              opacity: bookmarkPending ? 0.6 : 1,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
              {isBookmarked ? 'Tersimpan' : 'Simpan Bookmark'}
            </button>
          )}

          {(isOwner || isStaff) && (
            <>
              <button onClick={isEditing ? cancelEdit : startEdit} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: colors.bgElevated, border: `1px solid ${colors.border}`,
                borderRadius: 10, padding: '8px 12px',
                fontSize: 13, color: colors.textPrimary, cursor: 'pointer',
                width: '100%', textAlign: 'left', transition: 'background 0.12s',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                {isEditing ? 'Batal Edit' : 'Edit Diskusi'}
              </button>

              <button onClick={() => {
                if (window.confirm('Hapus diskusi ini? Tindakan ini tidak bisa dibatalkan.')) {
                  handleDeleteDiscussion()
                }
              }} disabled={deleting} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '8px 12px',
                fontSize: 13, color: '#dc2626', cursor: deleting ? 'default' : 'pointer',
                width: '100%', textAlign: 'left', transition: 'background 0.12s',
                opacity: deleting ? 0.6 : 1,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
                {deleting ? 'Menghapus...' : 'Hapus Diskusi'}
              </button>
            </>
          )}

          {!isOwner && (
            <Link href={`/user/report?targetId=${discussion.id}&type=discussion`} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10, padding: '8px 12px',
              fontSize: 13, color: '#dc2626', textDecoration: 'none',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fef2f2')}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
              </svg>
              Laporkan Diskusi
            </Link>
          )}
        </div>
      </div>

      {/* Diskusi Terkait */}
      <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: colors.textPrimary }}>🔗 Terkait</span>
          <Link href="/user/discussions" style={{ fontSize: 12, color: colors.accent, textDecoration: 'none' }}>Semua →</Link>
        </div>
        {relatedLoading
          ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="row" />)
          : related.length === 0
          ? <p style={{ fontSize: 13, color: colors.textSecondary }}>Tidak ada diskusi terkait.</p>
          : related.map((d, i) => (
              <TrendingRow key={d.id} rank={i + 1}
                title={d.title ?? ''}
                subtitle={`${d._count?.votes ?? 0} vote · ${d._count?.comments ?? 0} komentar`}
                href={`/user/discussions/${d.id}`}
              />
            ))
        }
      </div>
    </>
  ) : null

  /* ══ RENDER ══ */
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description"        content={siteDesc} />
        <meta property="og:title"       content={siteTitle} />
        <meta property="og:description" content={siteDesc} />
        <meta property="og:type"        content="article" />
        {discussion && typeof window !== 'undefined' && (
          <meta property="og:url" content={window.location.href} />
        )}
      </Head>

      {/* Toast tetap di luar layout agar z-index bebas */}
      <Toast toast={toast} />

      <UserLayout sidebar={sidebar}>

        {/* ── sticky back-bar ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${colors.border}`,
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button
            onClick={() => router.back()}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: colors.textPrimary, fontSize: 20, lineHeight: 1,
              display: 'flex', alignItems: 'center', padding: 4, borderRadius: 8,
            }}
            aria-label="Kembali"
            onMouseEnter={e => (e.currentTarget.style.background = colors.bgElevated)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            ←
          </button>
          <span style={{ fontWeight: 700, fontSize: 16, color: colors.textPrimary }}>
            {loading ? 'Memuat…' : (discussion?.title ?? 'Diskusi')}
          </span>
        </div>

        {/* ── loading skeleton ── */}
        {loading && (
          <div style={{ padding: '16px' }}>
            <DiscussionSkeleton />
          </div>
        )}

        {/* ── error ── */}
        {!loading && (error || !discussion) && (
          <ErrorState message={error || 'Diskusi tidak dapat dimuat.'} />
        )}

        {/* ── konten utama ── */}
        {!loading && discussion && (
          <div style={{ padding: '0 16px 32px' }}>

            {/* Header (judul, author, tags, waktu) */}
            <div style={{ paddingTop: 16 }}>
              <DiscussionHeader
                discussion={discussion}
                onCopyLink={handleCopyLink}
                onShare={handleShare}
                isOwner={isOwner}
                isStaff={isStaff}
                isLoggedIn={!!user}
                isBookmarked={isBookmarked}
                bookmarkPending={bookmarkPending}
                onToggleBookmark={handleToggleBookmark}
                onEditToggle={isEditing ? cancelEdit : startEdit}
                isEditing={isEditing}
                onDelete={() => {
                  if (window.confirm('Hapus diskusi ini? Tindakan ini tidak bisa dibatalkan.')) {
                    handleDeleteDiscussion()
                  }
                }}
                deleting={deleting}
              />
            </div>

            {/* Konten diskusi */}
            <DiscussionContent
              discussion={discussion}
              isEditing={isEditing}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editContent={editContent}
              setEditContent={setEditContent}
              editSubmitting={editSubmitting}
              editError={editError}
              onSaveEdit={handleSaveEdit}
              onCancelEdit={cancelEdit}
            />

            {/* Vote bar + lapor */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 0', borderTop: `1px solid ${colors.border}`,
              borderBottom: `1px solid ${colors.border}`, margin: '12px 0',
            }}>
              <DiscussionVote
                voteCount={voteCount}
                voteState={voteState}
                votePending={votePending}
                onVote={handleVote}
              />
              {!isOwner && (
                <Link href={`/user/report?targetId=${discussion.id}&type=discussion`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 12, color: colors.textSecondary, textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#dc2626')}
                  onMouseLeave={e => (e.currentTarget.style.color = colors.textSecondary)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>
                  </svg>
                  Laporkan
                </Link>
              )}
            </div>

            {/* ── Komentar ── */}
            <section aria-label="Komentar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
                  Komentar
                </h2>
                <span style={{
                  background: colors.bgElevated, border: `1px solid ${colors.border}`,
                  borderRadius: 99, padding: '1px 8px', fontSize: 12,
                  color: colors.textSecondary, fontWeight: 600,
                }}>
                  {discussion._count?.comments ?? 0}
                </span>
              </div>

              {/* Daftar komentar */}
              <CommentList
                comments={comments}
                loading={false}
                onVote={handleCommentVote}
                onReply={setReplyTarget}
                commentVotes={commentVotes}
                votingCommentId={votingCommentId}
                currentUserId={user?.id}
                isStaff={isStaff}
                onEdit={handleUpdateComment}
                onDelete={handleDeleteComment}
              />

              {/* Reply form */}
              <ReplyForm
                target={replyTarget}
                content={replyContent}
                onChange={setReplyContent}
                onSubmit={handleReply}
                onCancel={() => { setReplyTarget(null); setReplyContent('') }}
                submitting={replySubmitting}
              />

              {/* Form komentar baru */}
              <div style={{
                marginTop: 20, paddingTop: 16,
                borderTop: `1px solid ${colors.border}`,
              }}>
                <CommentForm
                  value={newComment}
                  onChange={setNewComment}
                  onSubmit={handleComment}
                  submitting={submitting}
                  error={submitError}
                  isLoggedIn={!!user}
                />
              </div>
            </section>

          </div>
        )}

      </UserLayout>
    </>
  )
}



