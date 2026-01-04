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
  CircularProgress,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  InputAdornment,
  Alert,
} from '@mui/material';
import {
  Forum,
  Comment,
  ThumbUp,
  Visibility,
  Edit,
  Delete,
  Search,
  Add,
  ArrowBack,
  AccessTime,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/discussion'; // gunakan API service yang fix
import dayjs from '../../utils/dayjs';

const MyDiscussionsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchMyDiscussions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyDiscussions();
      setDiscussions(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load discussions. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDiscussions();
  }, []);

  const handleDeleteDiscussion = async (id) => {
    if (!confirm('Are you sure you want to delete this discussion?')) return;

    try {
      setDeletingId(id);
      await api.deleteDiscussion(id);
      setDiscussions(discussions.filter(d => d.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete discussion. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditDiscussion = (id) => router.push(`/discussions/${id}/edit`);

  const filteredDiscussions = discussions.filter(d =>
    d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Forum sx={{ mr: 1 }} />
              My Discussions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You have {discussions.length} discussion{discussions.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/discussions/create')}
          >
            New Discussion
          </Button>
        </Box>

        <TextField
          fullWidth
          placeholder="Search my discussions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button onClick={fetchMyDiscussions} sx={{ ml: 2 }} size="small">
            Retry
          </Button>
        </Alert>
      )}

      {filteredDiscussions.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Forum sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {searchTerm ? 'No discussions found' : 'No discussions yet'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm
              ? 'Try a different search term'
              : 'Start sharing your thoughts with the community'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/discussions/create')}
          >
            Create Your First Discussion
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {filteredDiscussions.map((discussion) => (
            <Card key={discussion.id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
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
                      {discussion.category?.name && (
                        <Chip
                          size="small"
                          label={discussion.category.name}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                      <Chip
                        size="small"
                        icon={<Comment />}
                        label={discussion._count?.comments || 0}
                        variant="outlined"
                      />
                      <Chip
                        size="small"
                        icon={<ThumbUp />}
                        label={discussion.vote?.upvote || 0}
                        variant="outlined"
                        color="success"
                      />
                      <Chip
                        size="small"
                        icon={<Visibility />}
                        label={discussion.views || 0}
                        variant="outlined"
                        color="info"
                      />
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      Created by: {discussion.author?.profile?.pseudonym || discussion.author?.email}
                      <br />
                      {dayjs(discussion.createdAt).fromNow()}
                      {discussion.updatedAt !== discussion.createdAt &&
                        ` • Updated: ${dayjs(discussion.updatedAt).fromNow()}`}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                <Box>
                  <Button size="small" onClick={() => router.push(`/discussions/${discussion.id}`)}>
                    View Discussion
                  </Button>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => handleEditDiscussion(discussion.id)}
                    color="primary"
                    disabled={deletingId === discussion.id}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteDiscussion(discussion.id)}
                    color="error"
                    disabled={deletingId === discussion.id}
                  >
                    {deletingId === discussion.id ? <CircularProgress size={20} /> : <Delete />}
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default function MyDiscussionsPageWrapper() {
  return (
    <ProtectedRoute>
      <MyDiscussionsPage />
    </ProtectedRoute>
  );
}
