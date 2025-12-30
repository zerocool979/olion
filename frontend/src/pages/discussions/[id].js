import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';

import { getDiscussionById } from '../../api/discussion';
import { getAnswersByDiscussion } from '../../api/answer';

import DiscussionCard from '../../components/DiscussionCard';
import AnswerCard from '../../components/AnswerCard';

/**
 * =====================================================
 * Discussion Detail Page (FINAL)
 * =====================================================
 */

const DiscussionDetailPage = () => {
  const { query } = useRouter();
  const { id } = query;

  const [discussion, setDiscussion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        const d = await getDiscussionById(id);
        const a = await getAnswersByDiscussion(id);
        setDiscussion(d);
        setAnswers(a);
      } catch (e) {
        setError(
          e.response?.data?.message ||
            'Failed to load discussion'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>{error}</p>;
  if (!discussion) return <p>Not found</p>;

  return (
    <div>
      <DiscussionCard discussion={discussion} />

      <h2 style={{ marginTop: '1.5rem' }}>
        Answers
      </h2>

      {answers.length === 0 ? (
        <p>No answers yet</p>
      ) : (
        answers.map((a) => (
          <AnswerCard key={a.id} answer={a} />
        ))
      )}
    </div>
  );
};

export default function Wrapped() {
  return (
    <ProtectedRoute>
      <DiscussionDetailPage />
    </ProtectedRoute>
  );
}
