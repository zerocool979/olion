// components/BookmarkButton.js
import api from '../api/base';
import { useState } from 'react';

export default function BookmarkButton({ discussionId, initialBookmarked }) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (bookmarked) {
        const { data } = await api.delete(`/discussions/${discussionId}/bookmark`);
        setBookmarked(data.bookmark.isBookmarked);
      } else {
        const { data } = await api.post(`/discussions/${discussionId}/bookmark`);
        setBookmarked(data.bookmark.isBookmarked);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`bookmark-btn ${bookmarked ? 'active' : ''}`}
      disabled={loading}
      title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
    </button>
  );
}
