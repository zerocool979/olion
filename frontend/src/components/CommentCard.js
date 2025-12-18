/**
 * =====================================================
 * CommentCard
 * -----------------------------------------------------
 * Menampilkan komentar
 * =====================================================
 */

const CommentCard = ({ comment }) => {
  if (!comment) return null;

  const {
    content,
    author,
    createdAt,
  } = comment;

  return (
    <div
      style={{
        padding: '0.75rem',
        borderLeft: '3px solid #ddd',
        marginBottom: '0.5rem',
      }}
    >
      <p>{content || 'No comment.'}</p>

      <small>
        By {author?.email || 'Unknown'} •{' '}
        {createdAt
          ? new Date(createdAt).toLocaleString()
          : 'Unknown time'}
      </small>
    </div>
  );
};

export default CommentCard;
