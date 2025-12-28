import { useEffect, useState } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getPakars } from '../../api/pakar';
import PakarCard from '../../components/PakarCard';

/**
 * =====================================================
 * Pakar Page
 * -----------------------------------------------------
 * Menampilkan daftar pakar (Admin / User)
 * =====================================================
 */

const PakarPage = () => {
  const [pakars, setPakars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPakars = async () => {
      try {
        const res = await getPakars();

        /**
         * ❌ SEBELUM:
         * setPakars(res);
         *
         * Backend mengembalikan:
         * { success: true, data: [...] }
         */

        // ✅ FIX
        if (mounted) {
          setPakars(res.data || []);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err.response?.data?.message ||
              'Gagal memuat data pakar'
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPakars();
    return () => (mounted = false);
  }, []);

  if (loading) return <p>Loading pakar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Daftar Pakar
      </h1>

      {pakars.length === 0 ? (
        <p>No pakars found.</p>
      ) : (
        pakars.map((pakar) => (
          <PakarCard
            key={pakar.id}
            pakar={pakar}
          />
        ))
      )}
    </div>
  );
};

export default function WrappedPakarPage() {
  return (
    <ProtectedRoute>
      <PakarPage />
    </ProtectedRoute>
  );
}
