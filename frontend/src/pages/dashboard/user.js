// src/pages/dashboard/user.js

'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  CircularProgress,
  LinearProgress,
  Tooltip
} from '@mui/material';
import {
  Forum,
  QuestionAnswer,
  ThumbUp,
  Add,
  TrendingUp,
  AccessTime,
  Comment,
  Visibility,
  Refresh,
  Bookmark,
  Notifications,
  School,
  Rocket,
  Stars,
  Close,
  Logout,
  Dashboard as DashboardIcon,
  History,
  EmojiEvents,
  Help
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';
import dayjs from '../../utils/dayjs';

// 🔧 UTILITY HELPER UNTUK SAFE RENDERING
const safeText = (value, fallback = '-') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';

  if (typeof value === 'object') {
    return value.name || value.title || value.label ||
           value.username || value.email ||
           (value.id ? value.id.toString() : fallback);
  }

  return fallback;
};

const normalizeAuthor = (author) => {
  if (!author) return 'Anonim';
  if (typeof author === 'string') return author;
  if (typeof author === 'object') {
    return author.name || author.username ||
           author.pseudonym || author.email || 'Anonim';
  }
  return 'Anonim';
};

const safeDate = (dateString) => {
  if (!dateString) return '';

  try {
    const date = dayjs(dateString);
    if (!date.isValid()) return '';
    return date.fromNow();
  } catch (error) {
    return '';
  }
};

const UserDashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [recentDiscussions, setRecentDiscussions] = useState([]);
  const [myDiscussions, setMyDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk pengajuan pakar
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applicationReason, setApplicationReason] = useState('');
  const [applicationField, setApplicationField] = useState('');
  const [applicationYears, setApplicationYears] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // State untuk quick stats
  const [userStats, setUserStats] = useState({
    myDiscussions: 0,
    myAnswers: 0,
    reputation: 0,
    unreadNotifications: 0,
    upvotesReceived: 0,
    bookmarksCount: 0
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user stats
      const statsRes = await api.get('/users/dashboard-stats');
      const statsData = statsRes.data || {};
      console.log('Dashboard stats:', statsData);
      
      setUserStats({
        myDiscussions: statsData.discussionCount || statsData.myDiscussions || 0,
        myAnswers: statsData.answerCount || statsData.myAnswers || 0,
        reputation: statsData.reputation || 0,
        unreadNotifications: statsData.unreadNotifications || statsData.unreadNotificationCount || 0,
        upvotesReceived: statsData.upvotesReceived || 0,
        bookmarksCount: statsData.bookmarksCount || 0
      });

      // Fetch recent discussions
      try {
        const discussionsRes = await api.get('/discussions?limit=3&sort=-createdAt');
  // Timeout untuk mencegah infinite loading  useEffect(() => {    const timeout = setTimeout(() => {      if (loading) {        setError('Request timeout. Please try refreshing.');        setLoading(false);      }    }, 10000);    return () => clearTimeout(timeout);  }, [loading]);
        const discussionsData = discussionsRes.data?.data || discussionsRes.data?.discussions || discussionsRes.data || [];
        const normalizedRecentDiscussions = discussionsData.slice(0, 3).map(discussion => ({
          ...discussion,
          displayTitle: safeText(discussion.title, 'No Title'),
          displayContent: safeText(discussion.content, 'No content'),
          displayAuthor: normalizeAuthor(discussion.author || discussion.user || discussion.createdBy),
          displayCreatedAt: safeDate(discussion.createdAt || discussion.created_at || discussion.createdDate),
          commentCount: discussion.commentCount || discussion.comments_count || discussion.comments || 0,
          upvotes: discussion.upvotes || discussion.upvote_count || discussion.likes || 0,
          views: discussion.views || discussion.view_count || discussion.viewsCount || 0,
          author: discussion.author || discussion.user || discussion.createdBy || {}
        }));
        setRecentDiscussions(normalizedRecentDiscussions);
      } catch (discussionErr) {
        console.error('Error fetching recent discussions:', discussionErr);
        setRecentDiscussions([]);
      }

      // Fetch my discussions
      try {
        const myDiscussionsRes = await api.get('/discussions/my?limit=2');
        const myDiscussionsData = myDiscussionsRes.data?.data || myDiscussionsRes.data || [];
        const normalizedMyDiscussions = myDiscussionsData.slice(0, 2).map(discussion => ({
          ...discussion,
          displayTitle: safeText(discussion.title, 'No Title'),
          displayContent: safeText(discussion.content, 'No content'),
          commentCount: discussion.commentCount || discussion.comments_count || discussion.comments || 0,
          upvotes: discussion.upvotes || discussion.upvote_count || discussion.likes || 0,
          views: discussion.views || discussion.view_count || discussion.viewsCount || 0
        }));
        setMyDiscussions(normalizedMyDiscussions);
      } catch (myDiscussionsErr) {
        console.error('Error fetching my discussions:', myDiscussionsErr);
        setMyDiscussions([]);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handler untuk logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Handler untuk pengajuan menjadi pakar
  const handleApplyPakar = async () => {
    if (!applicationReason.trim() || !applicationField.trim()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    try {
      setApplying(true);

      // Data payload untuk pengajuan pakar
      const payload = {
        reason: applicationReason,
        field: applicationField,
        yearsOfExperience: applicationYears || '0',
        qualifications: `Applying as ${applicationField} expert`,
        status: 'pending'
      };

      // Coba endpoint berdasarkan konvensi REST
      let response;
      try {
        // Endpoint untuk user mengajukan diri sebagai pakar
        response = await api.post('/pakars/apply', payload);
      } catch (firstErr) {
        console.log('First endpoint failed, trying alternative...', firstErr);
        try {
          // Alternatif: endpoint khusus user
          response = await api.post('/users/apply-pakar', payload);
        } catch (secondErr) {
          // Alternatif: endpoint general
          response = await api.post('/pakar-applications', payload);
        }
      }

      setSnackbar({
        open: true,
        message: 'Application submitted successfully! Admin will review your application.',
        severity: 'success'
      });

      // Reset form dan tutup dialog
      setApplicationReason('');
      setApplicationField('');
      setApplicationYears('');
      setApplyDialogOpen(false);

    } catch (err) {
      console.error('Error applying for pakar:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to submit application. Please try again.',
        severity: 'error'
      });
    } finally {
      setApplying(false);
    }
  };

  // Navigate ke halaman status pengajuan pakar
  const handleViewPakarStatus = () => {
    router.push('/pakar/application-status');
  };

  // Navigate ke halaman pengajuan pakar lengkap
  const handleGoToPakarApplication = () => {
    router.push('/pakar/apply');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Check if user is eligible to apply for pakar
  const canApplyPakar = user?.role === 'user' &&
                       !user?.hasAppliedPakar &&
                       (userStats.reputation >= 50 || userStats.myAnswers >= 10);

  // Progress untuk reputation
  const reputationProgress = Math.min((userStats.reputation / 50) * 100, 100);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading your dashboard...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DashboardIcon sx={{ mr: 1, color: 'primary.main' }} />
              Welcome back, {safeText(user?.name || user?.username || user?.email)}!
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
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchDashboardData}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Forum color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">My Discussions</Typography>
              </Box>
              <Typography variant="h4">{userStats.myDiscussions}</Typography>
              <Typography variant="caption" color="text.secondary">
                Total discussions created
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => router.push('/discussions/my')}
                startIcon={<History />}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QuestionAnswer color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">My Answers</Typography>
              </Box>
              <Typography variant="h4">{userStats.myAnswers}</Typography>
              <Typography variant="caption" color="text.secondary">
                Total answers provided
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => router.push('/answers/my')}
                startIcon={<History />}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThumbUp color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">My Reputation</Typography>
              </Box>
              <Typography variant="h4">{userStats.reputation}</Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={reputationProgress} 
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {userStats.reputation}/50 for Pakar eligibility
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => router.push('/reputation')}
                startIcon={<EmojiEvents />}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary" variant="body2">Notifications</Typography>
              </Box>
              <Typography variant="h4">{userStats.unreadNotifications}</Typography>
              <Typography variant="caption" color="text.secondary">
                Unread notifications
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => router.push('/notifications')}
                startIcon={<History />}
              >
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
          <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Rocket sx={{ mr: 1, fontSize: 20 }} />
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => router.push('/discussions/create')}
                  sx={{ py: 1.5 }}
                >
                  New Discussion
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<QuestionAnswer />}
                  onClick={() => router.push('/discussions?filter=unanswered')}
                  sx={{ py: 1.5 }}
                >
                  Answer Questions
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<Bookmark />}
                  onClick={() => router.push('/discussions/bookmarked')}
                  sx={{ py: 1.5 }}
                >
                  Bookmarks
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<TrendingUp />}
                  onClick={() => router.push('/discussions/trending')}
                  sx={{ py: 1.5 }}
                >
                  Trending
                </Button>
              </Grid>
            </Grid>

            {/* Pakar Application Section */}
            <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <School sx={{ mr: 1, color: 'secondary.main' }} />
                Pakar Program
              </Typography>
              
              {/* Jika user sudah menjadi pakar */}
              {user?.role === 'pakar' && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Chip
                    icon={<School />}
                    label="Verified Pakar"
                    color="success"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Thank you for contributing as an expert!
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => router.push('/pakar/dashboard')}
                    sx={{ mt: 1 }}
                  >
                    Go to Pakar Dashboard
                  </Button>
                </Box>
              )}

              {/* Jika sudah mengajukan */}
              {user?.hasAppliedPakar && user?.role !== 'pakar' && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Chip
                    icon={<School />}
                    label="Application Pending"
                    color="warning"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your Pakar application is under review by admin
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleViewPakarStatus}
                    >
                      Check Status
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => router.push('/pakar/application-status')}
                    >
                      View Details
                    </Button>
                  </Stack>
                </Box>
              )}

              {/* Jika eligible untuk apply */}
              {canApplyPakar && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    You're eligible to become a Pakar! Unlock expert features.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<School />}
                      onClick={() => setApplyDialogOpen(true)}
                      sx={{
                        background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF5252 30%, #FF7B39 90%)',
                        }
                      }}
                    >
                      Quick Apply
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Help />}
                      onClick={handleGoToPakarApplication}
                    >
                      Full Application
                    </Button>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                    Requirements met: {userStats.reputation >= 50 ? '✓ 50+ Reputation' : '✓ 10+ Answers'}
                  </Typography>
                </Box>
              )}

              {/* Jika belum eligible */}
              {user?.role === 'user' && !user?.hasAppliedPakar && !canApplyPakar && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Become a Pakar to help the community and unlock expert features
                  </Typography>
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                      Requirements:
                    </Typography>
                    <Typography variant="caption" color={userStats.reputation >= 50 ? 'success.main' : 'text.secondary'}>
                      • 50+ Reputation ({userStats.reputation}/50)
                    </Typography>
                    <br />
                    <Typography variant="caption" color={userStats.myAnswers >= 10 ? 'success.main' : 'text.secondary'}>
                      • OR 10+ Answers ({userStats.myAnswers}/10)
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleGoToPakarApplication}
                    sx={{ mt: 2 }}
                  >
                    Learn More
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>

          {/* My Recent Discussions */}
          <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <Forum sx={{ mr: 1, fontSize: 20 }} />
                My Recent Discussions
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => router.push('/discussions/my')}
                startIcon={<History />}
              >
                View All
              </Button>
            </Box>

            {myDiscussions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary" gutterBottom>
                  You haven't created any discussions yet
                </Typography>
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
                {myDiscussions.map((discussion, index) => (
                  <Paper 
                    key={discussion.id || `discussion-${index}`} 
                    variant="outlined" 
                    sx={{ 
                      p: 2,
                      '&:hover': {
                        boxShadow: 2,
                        borderColor: 'primary.main'
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          {discussion.displayTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {discussion.displayContent.substring(0, 100)}...
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                          <Chip
                            icon={<Comment />}
                            label={discussion.commentCount}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                          <Chip
                            icon={<ThumbUp />}
                            label={discussion.upvotes}
                            size="small"
                            variant="outlined"
                            color="success"
                          />
                          <Chip
                            icon={<Visibility />}
                            label={discussion.views}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => router.push(`/discussions/${discussion.id}`)}
                        sx={{ ml: 2, minWidth: 80 }}
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
          <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1, fontSize: 20 }} />
                Recent Community Discussions
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={() => router.push('/discussions')}
                startIcon={<History />}
              >
                View All
              </Button>
            </Box>

            <Stack spacing={2}>
              {recentDiscussions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent discussions
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => router.push('/discussions/create')}
                    sx={{ mt: 1 }}
                  >
                    Start a Discussion
                  </Button>
                </Box>
              ) : (
                recentDiscussions.map((discussion, index) => (
                  <Paper 
                    key={discussion.id || `recent-${index}`} 
                    variant="outlined" 
                    sx={{ 
                      p: 2,
                      '&:hover': {
                        boxShadow: 1,
                        cursor: 'pointer'
                      },
                      transition: 'all 0.2s'
                    }}
                    onClick={() => router.push(`/discussions/${discussion.id}`)}
                  >
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      {discussion.displayTitle}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar
                        sx={{ width: 24, height: 24, fontSize: '0.75rem' }}
                        src={discussion.author?.avatar}
                      >
                        {discussion.displayAuthor?.charAt(0)?.toUpperCase() || 'A'}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        {discussion.displayAuthor}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
                      <AccessTime fontSize="inherit" sx={{ mr: 0.5 }} />
                      {discussion.displayCreatedAt || 'Recently'}
                    </Typography>
                  </Paper>
                ))
              )}
            </Stack>
          </Paper>

          {/* Quick Tips */}
          <Paper sx={{ p: 3 }} elevation={2}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ mr: 1, fontSize: 20 }} />
              Quick Tips
            </Typography>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                  <ThumbUp fontSize="small" sx={{ mr: 1 }} />
                  Earn Reputation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get upvotes on your answers to increase your reputation score.
                  {userStats.reputation < 50 && (
                    <>
                      <br />
                      <Box sx={{ mt: 1, p: 1, bgcolor: 'warning.50', borderRadius: 1 }}>
                        <Typography variant="caption" fontWeight="bold">
                          Current: {userStats.reputation}/50 to apply for Pakar
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={reputationProgress} 
                          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </>
                  )}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'info.main' }}>
                  <Bookmark fontSize="small" sx={{ mr: 1 }} />
                  Bookmark Helpful Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Save useful discussions for quick access later. You can find them in the Bookmarks section.
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <School fontSize="small" sx={{ mr: 1 }} />
                  Become a Pakar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Apply to become an expert in your field to help others and unlock special features.
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => router.push('/pakar/guide')}
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Learn about Pakar benefits →
                  </Button>
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Apply Pakar Dialog */}
      <Dialog
        open={applyDialogOpen}
        onClose={() => !applying && setApplyDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          bgcolor: 'secondary.light',
          color: 'secondary.contrastText'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <School sx={{ mr: 1 }} />
            Apply to Become a Pakar
          </Box>
          {!applying && (
            <IconButton
              size="small"
              onClick={() => setApplyDialogOpen(false)}
              disabled={applying}
              sx={{ color: 'secondary.contrastText' }}
            >
              <Close />
            </IconButton>
          )}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            Share your expertise with the community! Pakars get special badges, early access to new features, and help guide discussions.
          </Typography>

          <Box sx={{ mb: 3, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              ✓ You meet the eligibility requirements:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Reputation: {userStats.reputation}/50 ✓
              <br />
              • Answers: {userStats.myAnswers}/10 ✓
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Expertise Field *"
            placeholder="e.g., Agriculture, Technology, Finance, Health, Education"
            value={applicationField}
            onChange={(e) => setApplicationField(e.target.value)}
            disabled={applying}
            sx={{ mb: 2 }}
            required
            helperText="What field are you an expert in?"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Years of Experience"
            placeholder="e.g., 3 years"
            value={applicationYears}
            onChange={(e) => setApplicationYears(e.target.value)}
            disabled={applying}
            sx={{ mb: 2 }}
            helperText="Optional: How many years of experience do you have?"
            variant="outlined"
            type="number"
          />

          <TextField
            fullWidth
            label="Why should you become a Pakar? *"
            placeholder="Share your experience, qualifications, and how you can help the community..."
            value={applicationReason}
            onChange={(e) => setApplicationReason(e.target.value)}
            disabled={applying}
            multiline
            rows={4}
            required
            helperText="This will be reviewed by our admin team"
            variant="outlined"
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
            * Required fields. Your application will be reviewed within 3-5 business days.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setApplyDialogOpen(false)}
            disabled={applying}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleApplyPakar}
            disabled={applying || !applicationReason.trim() || !applicationField.trim()}
            startIcon={applying ? <CircularProgress size={20} /> : <School />}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5252 30%, #FF7B39 90%)',
              }
            }}
          >
            {applying ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const UserDashboardPage = () => (
  <ProtectedRoute>
    <UserDashboard />
  </ProtectedRoute>
);

export default UserDashboardPage;
