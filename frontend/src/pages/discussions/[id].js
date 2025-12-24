import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';

import { getDiscussionById } from '../../api/discussion';
import { getAnswersByDiscussion } from '../../api/answer';

import DiscussionCard from '../../components/DiscussionCard';
import AnswerCard from '../../components/AnswerCard';

/**
 * =====================================================
 * Discussion Detail Page
 * -----------------------------------------------------
 * Menampilkan detail diskusi + jawaban
 * =====================================================
 */

const DiscussionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [discussion, setDiscussion] = useState(null);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;

    const fetchData = async () => {
      try {
        const discussionData =
          await getDiscussionById(id);
        const answersData =
          await getAnswersByDiscussion(id);

        if (isMounted) {
          setDiscussion(discussionData);
          setAnswers(answersData);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              'Failed to load discussion'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <p>Loading discussion...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!discussion) {
    return <p>Discussion not found.</p>;
  }

  return (
    <div>
      <DiscussionCard discussion={discussion} />

      <h2>Answers</h2>

      {answers.length === 0 ? (
        <p>No answers yet.</p>
      ) : (
        answers.map((answer) => (
          <AnswerCard
            key={answer.id}
            answer={answer}
          />
        ))
      )}
    </div>
  );
};

const WrappedDiscussionDetailPage = () => (
  <ProtectedRoute>
    <DiscussionDetailPage />
  </ProtectedRoute>
);

export default WrappedDiscussionDetailPage;
