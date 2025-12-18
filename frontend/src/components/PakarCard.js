/**
 * =====================================================
 * PakarCard
 * -----------------------------------------------------
 * Menampilkan informasi pakar
 * =====================================================
 */

const PakarCard = ({ pakar }) => {
  if (!pakar) return null;

  const {
    user,
    expertise,
    isApproved,
    createdAt,
  } = pakar;

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
        {user?.profile?.pseudonym ||
          user?.email ||
          'Unknown Pakar'}
      </h3>

      {expertise && (
        <p>
          <strong>Expertise:</strong>{' '}
          {expertise}
        </p>
      )}

      <p>
        <strong>Status:</strong>{' '}
        {isApproved ? 'Approved' : 'Pending'}
      </p>

      <small>
        Joined:{' '}
        {createdAt
          ? new Date(createdAt).toLocaleDateString()
          : 'Unknown'}
      </small>
    </div>
  );
};

export default PakarCard;
