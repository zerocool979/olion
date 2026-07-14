import { useState } from 'react'
import Link from 'next/link'
import Avatar from '../dashboard/Avatar'
import { timeAgo } from '../../lib/timeAgo'

export function CommentItem({
  comment,
  onVote,
  onReply,
  voteState,
  voteLoading,
  commentVotes,
  votingCommentId,
  currentUserId,
  isStaff = false,
  onEdit,
  onDelete,
}) {
  const username = comment.user?.profile?.username ?? 'Anonim'
  const avatarUrl = comment.user?.profile?.avatarUrl ?? null
  const avatarBorder = comment.user?.profile?.avatarBorder ?? null
  const isExpert = comment.user?.isVerifiedExpert
  const isOptimistic = comment._optimistic
  const isOwner = !!currentUserId && comment.userId === currentUserId
  const canManage = isOwner || isStaff

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(comment.content)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editErr, setEditErr] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const startEdit = () => {
    setEditValue(comment.content)
    setEditErr('')
    setIsEditing(true)
  }

  const saveEdit = async () => {
    if (!editValue.trim()) {
      setEditErr('Komentar tidak boleh kosong.')
      return
    }
    setSavingEdit(true)
    const res = await onEdit?.(comment.id, editValue)
    setSavingEdit(false)
    if (res?.ok !== false) {
      setIsEditing(false)
    } else {
      setEditErr(res?.message ?? 'Gagal menyimpan.')
    }
  }

  const handleDeleteClick = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true)
      return
    }
    setConfirmingDelete(false)
    onDelete?.(comment.id)
  }

  return (
    <article className={`dd-comment${isOptimistic ? ' dd-comment--optimistic' : ''}`}>
      <Avatar username={username} src={avatarUrl} border={avatarBorder} size={32} />
      <div className="dd-comment__body">
        <header className="dd-comment__header">
          <div className="dd-comment__author-row">
            <span className="dd-comment__username">{username}</span>
            {isExpert && <span className="badge badge--expert">✦ Expert</span>}
          </div>
          <time dateTime={comment.createdAt}>
            {isOptimistic ? 'Mengirim...' : timeAgo(comment.createdAt)}
          </time>
        </header>

        {isEditing ? (
          <div style={{ marginTop: '0.4rem' }}>
            <textarea
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              rows={2}
              disabled={savingEdit}
              style={{ width: '100%', padding: '0.5rem', fontFamily: 'inherit' }}
            />
            {editErr && <p className="dd-comment-form__error" role="alert">{editErr}</p>}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              <button className="btn-primary" style={{ fontSize: '0.78rem' }} disabled={savingEdit} onClick={saveEdit}>
                {savingEdit ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button className="btn-ghost" style={{ fontSize: '0.78rem' }} disabled={savingEdit} onClick={() => setIsEditing(false)}>
                Batal
              </button>
            </div>
          </div>
        ) : (
          <p className="dd-comment__text">{comment.content}</p>
        )}

        <div className="dd-comment__actions">
          <button
            className="dd-comment__vote-btn"
            onClick={() => onVote(comment.id, 1)}
            disabled={voteLoading}
            aria-pressed={voteState === 1}
          >
            ▲ {comment._count?.votes ?? 0}
          </button>
          <button
            className="dd-comment__vote-btn"
            onClick={() => onVote(comment.id, -1)}
            disabled={voteLoading}
            aria-pressed={voteState === -1}
          >
            ▼
          </button>
          <button
            className="dd-comment__reply-btn"
            onClick={() => onReply({ commentId: comment.id, username })}
          >
            Balas
          </button>

          {!isOptimistic && canManage && !isEditing && (
            <>
              <button className="dd-comment__reply-btn" onClick={startEdit}>Edit</button>
              <button
                className="dd-comment__reply-btn"
                onClick={handleDeleteClick}
                onBlur={() => setConfirmingDelete(false)}
                style={confirmingDelete ? { color: '#f87171', borderColor: '#f87171' } : undefined}
              >
                {confirmingDelete ? 'Yakin hapus?' : 'Hapus'}
              </button>
            </>
          )}

          {!isOptimistic && !isOwner && currentUserId && (
            <Link
              className="dd-comment__reply-btn"
              href={`/user/report?targetId=${comment.id}&type=comment`}
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              Laporkan
            </Link>
          )}
        </div>

        {comment.replies?.length > 0 && (
          <div className="dd-comment__replies">
            {comment.replies.map(reply => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onVote={onVote}
                onReply={onReply}
                voteState={commentVotes?.[reply.id] ?? null}
                voteLoading={voteLoading}
                currentUserId={currentUserId}
                isStaff={isStaff}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
