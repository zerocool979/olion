/**
 * =====================================================
 * ReputationCard
 * -----------------------------------------------------
 * Menampilkan reputasi user
 * =====================================================
 */

const ReputationCard = ({ reputation }) => {
  if (!reputation) return null;

  const {
    score,
    level,
    totalUpvotes,
    totalDownvotes,
  } = reputation;

  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '1rem',
        borderRadius: '6px',
        maxWidth: '400px',
      }}
    >
      <h3>Reputation</h3>

      <p>
        <strong>Score:</strong>{' '}
        {typeof score === 'number'
          ? score
          : 0}
      </p>

      {level && (
        <p>
          <strong>Level:</strong> {level}
        </p>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <span>
          👍 {totalUpvotes ?? 0}
        </span>{' '}
        <span>
          👎 {totalDownvotes ?? 0}
        </span>
      </div>
    </div>
  );
};

export default ReputationCard;
