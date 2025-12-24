// =====================================================
// FILE: src/pages/discussions.js
// ROLE: User / Pakar / Admin
// USE CASE: Melihat daftar diskusi
// ACCESS: AUTHENTICATED USERS
// =====================================================

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../api/base';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function DiscussionsPage() {
  return (
    <ProtectedRoute>
      <DiscussionsContent />
    </ProtectedRoute>
  );
}

function DiscussionsContent() {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDiscussions = async () => {
      try {
        const res = await api.get('/discussions');
        setDiscussions(res.data);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat diskusi');
      } finally {
        setLoading(false);
      }
    };

    loadDiscussions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Memuat diskusi...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Diskusi</h1>
        <p className="text-sm text-gray-600">
          Diskusi komunitas & pakar OLION
        </p>
      </header>

      {discussions.length === 0 ? (
        <p className="text-gray-500">Belum ada diskusi</p>
      ) : (
        <ul className="space-y-4">
          {discussions.map((d) => (
            <li
              key={d.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow transition"
            >
              <Link href={`/discussions/${d.id}`}>
                <h2 className="text-lg font-semibold mb-1">
                  {d.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {d.content}
                </p>
                <div className="text-xs text-gray-400 mt-2">
                  Oleh {d.author?.pseudonym || 'Anonim'}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
