import Link from 'next/link';

/**
 * =====================================================
 * DiscussionCard
 * -----------------------------------------------------
 * Menampilkan ringkasan diskusi
 * =====================================================
 */

const DiscussionCard = ({ discussion }) => {
  if (!discussion) return null;

  const {
    id,
    title,
    content,
    author,
    createdAt,
    _count,
  } = discussion;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '6px',
      }}
    >
      <h3>
        <Link href={`/discussions/${id}`}>
          {title || 'Untitled discussion'}
        </Link>
      </h3>

      {content && (
        <p>
          {content.length > 150
            ? content.slice(0, 150) + '...'
            : content}
        </p>
      )}

      <small>
        By {author?.email || 'Unknown'} •{' '}
        {createdAt
          ? new Date(createdAt).toLocaleString()
          : 'Unknown time'}
      </small>

      {_count && (
        <div style={{ marginTop: '0.5rem' }}>
          <span>
            Answers: {_count.answers ?? 0}
          </span>
        </div>
      )}
    </div>
  );
};

export default DiscussionCard;
