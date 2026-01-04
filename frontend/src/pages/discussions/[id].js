'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/discussion';
import DiscussionCard from '../../components/DiscussionCard';
import CommentCard from '../../components/CommentCard';

const DiscussionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDiscussion = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.getDiscussionById(id);
      const data = res.data?.data || res.data;

      setDiscussion(data.discussion || data);
      setComments(data.comments || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load discussion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!discussion) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="warning">Discussion not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <DiscussionCard discussion={discussion} />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Answers & Comments ({comments.length})
      </Typography>

      {comments.length === 0 ? (
        <Typography color="text.secondary">
          No answers yet.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default function DiscussionDetailWrapper() {
  return (
    <ProtectedRoute>
      <DiscussionDetailPage />
    </ProtectedRoute>
  );
}
