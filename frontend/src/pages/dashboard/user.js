// src/pages/dashboard/user.js
'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack,
  LinearProgress,
  Alert,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Forum,
  QuestionAnswer,
  ThumbUp,
  Person,
  Add,
  TrendingUp,
  AccessTime,
  Comment,
  Visibility,
  Refresh,
  Bookmark,
  Share,
  Notifications
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';
import dayjs from 'dayjs';

const UserDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentDiscussions, setRecentDiscussions] = useState([]);
  const [myDiscussions, setMyDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch user stats
      const statsRes = await api.get('/dashboard/user-stats');
      setStats(statsRes.data);

      // Fetch recent discussions
      const discussionsRes = await api.get('/discussions/recent');
      setRecentDiscussions(discussionsRes.data.slice(0, 3));

      // Fetch my discussions
      const myDiscussionsRes = await api.get('/discussions/my');
      setMyDiscussions(myDiscussionsRes.data.slice(0, 2));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Loading your dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome back, {user?.name || user?.email}!
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Here's what's happening in your community
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchDashboardData}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/discussions/create')}
            >
              New Discussion
            </Button>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Forum color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">My Discussions</Typography>
              </Box>
              <Typography variant="h4">{stats?.myDiscussions || 0}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/discussions/my')}>
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuestionAnswer color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary">My Answers</Typography>
              </Box>
              <Typography variant="h4">{stats?.myAnswers || 0}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/answers/my')}>
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThumbUp color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary">My Reputation</Typography>
              </Box>
              <Typography variant="h4">{stats?.reputation || 0}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/reputation')}>
                Details
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Notifications</Typography>
              </Box>
              <Typography variant="h4">{stats?.unreadNotifications || 0}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/notifications')}>
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Quick Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Forum />}
                  onClick={() => router.push('/discussions/create')}
                >
                  New Discussion
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<QuestionAnswer />}
                  onClick={() => router.push('/discussions?filter=unanswered')}
                >
                  Answer Questions
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Bookmark />}
                  onClick={() => router.push('/discussions/bookmarked')}
                >
                  Bookmarks
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<TrendingUp />}
                  onClick={() => router.push('/discussions/trending')}
                >
                  Trending
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* My Recent Discussions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">My Recent Discussions</Typography>
              <Button size="small" onClick={() => router.push('/discussions/my')}>
                View All
              </Button>
            </Box>

            {myDiscussions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">You haven't created any discussions yet</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => router.push('/discussions/create')}
                  sx={{ mt: 2 }}
                >
                  Create Your First Discussion
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {myDiscussions.map((discussion) => (
                  <Paper key={discussion.id} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" gutterBottom>
                          {discussion.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {discussion.content.substring(0, 100)}...
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Chip
                            icon={<Comment />}
                            label={discussion.commentCount || 0}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<ThumbUp />}
                            label={discussion.upvotes || 0}
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            icon={<Visibility />}
                            label={discussion.views || 0}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => router.push(`/discussions/${discussion.id}`)}
                      >
                        View
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Recent Community Discussions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">Recent Community Discussions</Typography>
              <Button size="small" onClick={() => router.push('/discussions')}>
                View All
              </Button>
            </Box>

            <Stack spacing={2}>
              {recentDiscussions.map((discussion) => (
                <Paper key={discussion.id} variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {discussion.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }} src={discussion.author?.avatar}>
                      {discussion.author?.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {discussion.author?.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    <AccessTime fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    {dayjs(discussion.createdAt).fromNow()}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>

          {/* Quick Tips */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Tips</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  💡 Earn Reputation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get upvotes on your answers to increase your reputation score.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  🔖 Bookmark Helpful Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Save useful discussions for quick access later.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  🏆 Become a Pakar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Apply to become an expert in your field to help others.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

// =====================================================
// FINAL IMPLEMENTATION - WRAP WITH PROTECTEDROUTE
// =====================================================
const UserDashboardPage = () => (
  <ProtectedRoute roles={['user']}>
    <UserDashboard />
  </ProtectedRoute>
);

export default UserDashboardPage;

// =====================================================
// CATATAN:
// 1. Hanya USER role yang bisa akses halaman ini
// 2. Merupakan salah satu dashboard role-specific di /dashboard/*
// 3. Di-redirect dari index.js untuk role USER
// =====================================================
