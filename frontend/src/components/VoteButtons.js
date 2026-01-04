// components/VoteButtons.js
import api from '../api/base';
import { useState } from 'react';

export default function VoteButtons({ discussionId, initialVotes }) {
  const [votes, setVotes] = useState(initialVotes);
  const [loading, setLoading] = useState(false);

  const handleVote = async (type) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const { data } = await api.post(`/discussions/${discussionId}/vote`, { type });
      setVotes(data.vote);
    } catch (error) {
      console.error('Vote error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnvote = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const { data } = await api.delete(`/discussions/${discussionId}/vote`);
      setVotes(data.vote);
    } catch (error) {
      console.error('Unvote error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vote-buttons">
      <button
        onClick={() => votes.userVote === 'Up' ? handleUnvote() : handleVote('Up')}
        className={`upvote ${votes.userVote === 'Up' ? 'active' : ''}`}
        disabled={loading}
      >
        👍 {votes.upvotes}
      </button>
      
      <button
        onClick={() => votes.userVote === 'Down' ? handleUnvote() : handleVote('Down')}
        className={`downvote ${votes.userVote === 'Down' ? 'active' : ''}`}
        disabled={loading}
      >
        👎 {votes.downvotes}
      </button>
    </div>
  );
}
