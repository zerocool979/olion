import { formatDateTime } from '../utils/format';

/**
 * =====================================================
 * CommentCard
 * -----------------------------------------------------
 * Single comment renderer
 * =====================================================
 */

const CommentCard = ({ comment }) => {
  if (!comment) return null;

  const { content, createdAt, user } = comment;

  return (
    <div className="comment-item">
      <span className="comment-author">
        {user?.profile?.pseudonym || 'Anonymous'}
      </span>
      : {content}
      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
        {formatDateTime(createdAt)}
      </div>
    </div>
  );
};

export default CommentCard;
