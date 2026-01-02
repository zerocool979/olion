'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Chip,
  Stack,
  LinearProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  Forum,
  Comment,
  ThumbUp,
  Visibility,
  AccessTime,
  Refresh,
  ArrowBack
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const safeText = (value, fallback = '-') => {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'object') {
    return value.name || value.title || fallback;
  }
  return fallback;
};

const normalizeAuthor = (author) => {
  if (!author) return 'Anonim';
  if (typeof author === 'string') return author;
  if (typeof author === 'object') {
    return author.name || author.username || 'Anonim';
  }
  return 'Anonim';
};

const BookmarkedDiscussionsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/discussions/bookmarked');
      const normalized = (res.data || []).map(d => ({
        ...d,
        displayTitle: safeText(d.title, 'No Title'),
        displayContent: safeText(d.content, 'No content'),
        displayCategory: safeText(d.category, 'Uncategorized'),
        displayAuthor: normalizeAuthor(d.author),
        commentCount: d.commentCount || 0,
        upvotes: d.upvotes || 0,
        views: d.views || 0,
        createdAt: d.createdAt || new Date().toISOString(),
        isBookmarked: true
      }));
      setDiscussions(normalized);
    } catch (err) {
      console.error('Error fetching bookmarked discussions:', err);
      setError('Failed to load bookmarked discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (discussionId, currentlyBookmarked) => {
    try {
      if (currentlyBookmarked) {
        await api.delete(`/discussions/${discussionId}/bookmark`);
      } else {
        await api.post(`/discussions/${discussionId}/bookmark`);
      }
      fetchBookmarkedDiscussions(); // Refresh list
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  useEffect(() => {
    fetchBookmarkedDiscussions();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Loading bookmarked discussions...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/dashboard/user')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" gutterBottom>
          Bookmarked Discussions
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {discussions.length} discussion{discussions.length !== 1 ? 's' : ''} bookmarked
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchBookmarkedDiscussions}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {discussions.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Bookmark sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No bookmarked discussions
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Bookmark helpful discussions to find them easily later!
          </Typography>
          <Button
            variant="contained"
            startIcon={<Forum />}
            onClick={() => router.push('/discussions')}
          >
            Browse Discussions
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {discussions.map((discussion) => (
            <Grid item xs={12} key={discussion.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {discussion.displayTitle}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {discussion.displayContent.substring(0, 200)}...
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                        <Chip
                          label={discussion.displayCategory}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          By {discussion.displayAuthor}
                        </Typography>
                      </Box>
                      
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        <Chip
                          icon={<Comment />}
                          label={discussion.commentCount}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<ThumbUp />}
                          label={discussion.upvotes}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<Visibility />}
                          label={discussion.views}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<AccessTime />}
                          label={dayjs(discussion.createdAt).fromNow()}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    </Box>
                    
                    <IconButton
                      color="primary"
                      onClick={() => handleToggleBookmark(discussion.id, discussion.isBookmarked)}
                    >
                      {discussion.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    onClick={() => router.push(`/discussions/${discussion.id}`)}
                  >
                    View Discussion
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ProtectedRoute(BookmarkedDiscussionsPage);
