/**
 * =====================================================
 * AnswerCard
 * -----------------------------------------------------
 * Menampilkan jawaban pada diskusi
 * =====================================================
 */

const AnswerCard = ({ answer }) => {
  if (!answer) return null;

  const {
    content,
    author,
    createdAt,
    votes,
    _count,
  } = answer;

  const voteCount =
    typeof votes === 'number'
      ? votes
      : _count?.votes ?? 0;

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '6px',
        background: '#fafafa',
      }}
    >
      <p>{content || 'No content.'}</p>

      <small>
        By {author?.email || 'Unknown'} •{' '}
        {createdAt
          ? new Date(createdAt).toLocaleString()
          : 'Unknown time'}
      </small>

      <div style={{ marginTop: '0.5rem' }}>
        <span>Votes: {voteCount}</span>{' '}
        <span>
          Comments:{' '}
          {_count?.comments ?? 0}
        </span>
      </div>
    </div>
  );
};

export default AnswerCard;
