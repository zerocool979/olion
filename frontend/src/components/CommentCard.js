import { useState } from 'react';
import {
  updateComment,
  deleteComment,
} from '../api/comment';
import api from '../api/base';
import { useAuth } from '../context/AuthContext';
import { formatDateTime } from '../utils/format';

/**
 * =====================================================
 * CommentCard (MAXIMAL FINAL)
 * -----------------------------------------------------
 * Feature:
 * - Owner: edit & delete
 * - Admin/Moderator: admin delete
 * - Badge: Pakar, Deleted by Admin
 * - Moderation status + log (read-only)
 * - Flagged indicator
 * - Role-based UI
 * =====================================================
 */

const CommentCard = ({ comment }) => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  if (!comment) return null;

  const isOwner = user?.id === comment.userId;
  const isAdmin =
    user?.role === 'ADMIN' ||
    user?.role === 'MODERATOR';

  const isPakar =
    comment.user?.role === 'PAKAR';

  const isAdminDeleted =
    comment.isDeleted &&
    !isOwner &&
    isAdmin;

  /* ======================
     UPDATE COMMENT
  ====================== */
  const handleUpdate = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      await updateComment(comment.id, { content });
      setIsEditing(false);
    } catch (e) {
      alert('Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     DELETE (OWNER)
  ====================== */
  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;

    try {
      setLoading(true);
      await deleteComment(comment.id);
      setDeleted(true);
    } catch (e) {
      alert('Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     ADMIN DELETE
  ====================== */
  const handleAdminDelete = async () => {
    if (!confirm('Admin delete this comment?')) return;

    try {
      setLoading(true);
      await api.delete(`/comments/${comment.id}/admin`);
      setDeleted(true);
    } catch (e) {
      alert('Failed to admin delete');
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     DELETED STATE UI
  ====================== */
  if (deleted || comment.isDeleted) {
    return (
      <div style={deletedStyle}>
        🧾 Komentar ini telah dihapus oleh admin
      </div>
    );
  }

  return (
    <div
      style={{
        ...cardStyle,
        background: isPakar
          ? '#fefce8'
          : '#ffffff',
        borderLeft: isPakar
          ? '4px solid #facc15'
          : '4px solid transparent',
        opacity: comment.isFlagged ? 0.7 : 1,
      }}
    >
      {/* HEADER */}
      <div style={headerStyle}>
        <span>
          <strong>
            {comment.user?.profile?.pseudonym ||
              'Anonymous'}
          </strong>

          {isPakar && (
            <span style={badge('#facc15')}>
              ⭐ Pakar
            </span>
          )}

          {comment.isFlagged && (
            <span style={badge('#f97316')}>
              🚩 Flagged
            </span>
          )}
        </span>

        <span style={timeStyle}>
          {formatDateTime(comment.createdAt)}
        </span>
      </div>

      {/* CONTENT */}
      {isEditing ? (
        <textarea
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          style={textareaStyle}
        />
      ) : (
        <div style={contentStyle}>
          {comment.content}
        </div>
      )}

      {/* MODERATION INFO */}
      {comment.moderation && (
        <div style={moderationStyle}>
          🛡️ Moderation:{' '}
          <strong>
            {comment.moderation}
          </strong>
        </div>
      )}

      {/* ACTIONS */}
      <div style={actionRowStyle}>
        {/* OWNER */}
        {isOwner && !isEditing && (
          <>
            <ActionBtn
              label="Edit"
              color="#2563eb"
              onClick={() =>
                setIsEditing(true)
              }
              disabled={loading}
            />
            <ActionBtn
              label="Delete"
              color="#dc2626"
              onClick={handleDelete}
              disabled={loading}
            />
          </>
        )}

        {/* EDIT MODE */}
        {isOwner && isEditing && (
          <>
            <ActionBtn
              label="Save"
              color="#16a34a"
              onClick={handleUpdate}
              disabled={loading}
            />
            <ActionBtn
              label="Cancel"
              color="#6b7280"
              onClick={() => {
                setIsEditing(false);
                setContent(comment.content);
              }}
              disabled={loading}
            />
          </>
        )}

        {/* ADMIN */}
        {!isOwner && isAdmin && (
          <ActionBtn
            label="Admin Delete"
            color="#b91c1c"
            onClick={handleAdminDelete}
            disabled={loading}
          />
        )}
      </div>
    </div>
  );
};

/* =====================================================
   SMALL COMPONENT
===================================================== */
const ActionBtn = ({
  label,
  color,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      background: 'none',
      border: 'none',
      color,
      cursor: 'pointer',
      fontSize: '0.75rem',
    }}
  >
    {label}
  </button>
);

/* =====================================================
   STYLES
===================================================== */
const cardStyle = {
  fontSize: '0.85rem',
  padding: '0.6rem',
  marginBottom: '0.6rem',
  borderRadius: '4px',
  border: '1px solid #e5e7eb',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentStyle = {
  marginTop: '0.3rem',
  color: '#111827',
};

const timeStyle = {
  fontSize: '0.7rem',
  color: '#6b7280',
};

const textareaStyle = {
  width: '100%',
  fontSize: '0.85rem',
  marginTop: '0.3rem',
};

const actionRowStyle = {
  display: 'flex',
  gap: '0.6rem',
  marginTop: '0.4rem',
};

const moderationStyle = {
  marginTop: '0.3rem',
  fontSize: '0.7rem',
  color: '#7c2d12',
};

const deletedStyle = {
  fontSize: '0.75rem',
  fontStyle: 'italic',
  color: '#6b7280',
  marginBottom: '0.6rem',
};

const badge = (bg) => ({
  marginLeft: '0.4rem',
  padding: '0.1rem 0.4rem',
  fontSize: '0.65rem',
  borderRadius: '4px',
  background: bg,
  color: '#000',
});

export default CommentCard;
