'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider
} from '@mui/material';
import { Forum, Comment, ThumbUp, Visibility, AccessTime } from '@mui/icons-material';
import { useRouter } from 'next/router';
import api from '../../api/discussion';
import ProtectedRoute from '../../components/ProtectedRoute';
import dayjs from '../../utils/dayjs';

const BookmarkedDiscussionsPage = () => {
  const router = useRouter();
  const [bookmarkedDiscussions, setBookmarkedDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBookmarkedDiscussions();
      const data = res.data?.data || res.data || [];
      setBookmarkedDiscussions(data);
    } catch (err) {
      console.error('Error fetching bookmarked discussions:', err);
      setError('Failed to load bookmarked discussions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarkedDiscussions();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchBookmarkedDiscussions}>Retry</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookmarked Discussions
      </Typography>

      {bookmarkedDiscussions.length === 0 ? (
        <Typography>No bookmarked discussions yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {bookmarkedDiscussions.map((discussion) => (
            <Card key={discussion.id} variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {discussion.title || 'Untitled Discussion'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {discussion.content?.substring(0, 200)}...
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip
                    size="small"
                    icon={<AccessTime />}
                    label={dayjs(discussion.createdAt).format('DD MMM YYYY')}
                    variant="outlined"
                  />
                  {discussion.category && (
                    <Chip
                      size="small"
                      label={discussion.category}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    size="small"
                    icon={<Comment />}
                    label={discussion.commentCount || discussion.comments_count || 0}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    icon={<ThumbUp />}
                    label={discussion.upvotes || discussion.upvote_count || 0}
                    variant="outlined"
                    color="success"
                  />
                  <Chip
                    size="small"
                    icon={<Visibility />}
                    label={discussion.views || discussion.view_count || 0}
                    variant="outlined"
                    color="info"
                  />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Created: {dayjs(discussion.createdAt).fromNow()}
                  {discussion.updatedAt !== discussion.createdAt &&
                    ` • Updated: ${dayjs(discussion.updatedAt).fromNow()}`
                  }
                </Typography>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end', px: 2, py: 1 }}>
                <Button
                  size="small"
                  onClick={() => router.push(`/discussions/${discussion.id}`)}
                >
                  View Discussion
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default function BookmarkedDiscussionsWrapper() {
  return (
    <ProtectedRoute>
      <BookmarkedDiscussionsPage />
    </ProtectedRoute>
  );
}
