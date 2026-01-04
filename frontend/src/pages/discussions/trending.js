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
  Chip,
  Divider,
  Button
} from '@mui/material';
import { Forum, Comment, ThumbUp, Visibility, AccessTime } from '@mui/icons-material';
import { useRouter } from 'next/router';
import api from '../../api/discussion';
import dayjs from '../../utils/dayjs';

const TrendingDiscussionsPage = () => {
  const router = useRouter();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getTrendingDiscussions(10);
      const data = res.data || res;
      setDiscussions(data);
    } catch (err) {
      console.error('Error fetching trending discussions:', err);
      setError('Failed to load trending discussions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
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
        <Button onClick={fetchTrending}>Retry</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        <Forum sx={{ mr: 1 }} /> Trending Discussions
      </Typography>

      <Stack spacing={2}>
        {discussions.length === 0 ? (
          <Typography>No trending discussions found.</Typography>
        ) : (
          discussions.map((discussion) => (
            <Card key={discussion.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{discussion.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {discussion.content?.substring(0, 200)}...
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    icon={<AccessTime />}
                    label={dayjs(discussion.createdAt).format('DD MMM YYYY')}
                  />
                  {discussion.category && (
                    <Chip size="small" label={discussion.category} color="primary" />
                  )}
                  <Chip
                    size="small"
                    icon={<Comment />}
                    label={discussion.commentCount || discussion._count?.comments || 0}
                  />
                  <Chip
                    size="small"
                    icon={<ThumbUp />}
                    label={discussion.upvotes || discussion.vote?.upvote || 0}
                    color="success"
                  />
                  <Chip
                    size="small"
                    icon={<Visibility />}
                    label={discussion.views || 0}
                    color="info"
                  />
                </Box>
              </CardContent>
              <Divider />
              <Box sx={{ p: 1 }}>
                <Button size="small" onClick={() => router.push(`/discussions/${discussion.id}`)}>
                  View Discussion
                </Button>
              </Box>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
};

export default TrendingDiscussionsPage;
