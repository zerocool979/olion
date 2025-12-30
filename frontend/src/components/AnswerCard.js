import { useEffect, useState } from 'react';
import {
  getCommentsByAnswer,
  createComment,
} from '../api/comment';

import CommentCard from './CommentCard';
import { formatDateTime } from '../utils/format';

import styles from '../styles/answer.module.css';

/**
 * =====================================================
 * AnswerCard (FINAL - Next.js Safe)
 * =====================================================
 */

const AnswerCard = ({ answer }) => {
  if (!answer) return null;

  const {
    id,
    content,
    createdAt,
    user,
    votes,
  } = answer;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const voteCount = Array.isArray(votes)
    ? votes.length
    : 0;

  /* Load comments */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getCommentsByAnswer(id);
        setComments(data);
      } catch (e) {
        console.error('Load comments failed', e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  /* Create comment */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await createComment(id, {
        content: newComment,
      });
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (e) {
      console.error('Create comment failed', e);
    }
  };

  return (
    <div className={styles.answerCard}>
      <div className={styles.answerContent}>
        {content || 'No content'}
      </div>

      <div className={styles.answerMeta}>
        <span className={styles.answerAuthor}>
          {user?.profile?.pseudonym || 'Anonymous'}
        </span>
        <span>{formatDateTime(createdAt)}</span>
      </div>

      <div className={styles.answerMeta}>
        <span>Votes: {voteCount}</span>
      </div>

      <div className={styles.answerComments}>
        <div className={styles.commentsTitle}>
          Comments
        </div>

        {loading ? (
          <div className={styles.loading}>
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className={styles.empty}>
            No comments yet
          </div>
        ) : (
          comments.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))
        )}

        <form
          className={styles.commentForm}
          onSubmit={handleSubmit}
        >
          <input
            className={styles.commentInput}
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) =>
              setNewComment(e.target.value)
            }
          />
        </form>
      </div>
    </div>
  );
};

export default AnswerCard;
