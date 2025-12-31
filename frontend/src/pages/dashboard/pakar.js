// src/pages/dashboard/pakar.js
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
  Chip,
  Stack,
  LinearProgress,
  Alert,
  Avatar,
  Badge
} from '@mui/material';
import {
  VerifiedUser,
  QuestionAnswer,
  TrendingUp,
  Stars,
  Timer,
  ThumbUp,
  Comment,
  Add,
  Refresh,
  BarChart,
  School,
  Group
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';

const PakarDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [expertStats, setExpertStats] = useState(null);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch general stats
      const statsRes = await api.get('/dashboard/user-stats');
      setStats(statsRes.data);

      // Fetch expert-specific stats
      const expertRes = await api.get('/pakar/stats');
      setExpertStats(expertRes.data);

      // Fetch questions that need expert answers
      const questionsRes = await api.get('/discussions/need-expert');
      setPendingQuestions(questionsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching pakar dashboard:', err);
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
          Loading expert dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header with Expert Badge */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <VerifiedUser color="success" />
              <Typography variant="h4">
                Expert Dashboard
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome, Expert {user?.name}! Help others with your knowledge
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                icon={<School />}
                label={user?.specialization || 'General Expert'}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<Stars />}
                label={`Level ${expertStats?.expertLevel || 1}`}
                color="warning"
                variant="outlined"
              />
            </Box>
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
              startIcon={<QuestionAnswer />}
              onClick={() => router.push('/discussions?filter=unanswered')}
            >
              Answer Questions
            </Button>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Expert Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid', borderColor: 'success.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VerifiedUser color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Expert Answers</Typography>
              </Box>
              <Typography variant="h4">{expertStats?.expertAnswers || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThumbUp color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Answer Upvotes</Typography>
              </Box>
              <Typography variant="h4">{expertStats?.answerUpvotes || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Expert Score</Typography>
              </Box>
              <Typography variant="h4">{expertStats?.expertScore || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Timer color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Avg. Response Time</Typography>
              </Box>
              <Typography variant="h4">{expertStats?.avgResponseTime || 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Questions Needing Expert Attention */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                <Badge badgeContent={pendingQuestions.length} color="error" sx={{ mr: 1 }}>
                  Questions Needing Expert Help
                </Badge>
              </Typography>
              <Button size="small" onClick={() => router.push('/discussions?filter=need-expert')}>
                View All
              </Button>
            </Box>

            {pendingQuestions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No questions need expert help at the moment</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {pendingQuestions.map((question) => (
                  <Paper key={question.id} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {question.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {question.content.substring(0, 150)}...
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={question.category}
                            size="small"
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            Asked by: {question.author?.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => router.push(`/discussions/${question.id}`)}
                        sx={{ ml: 2 }}
                      >
                        Answer
                      </Button>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>

          {/* Expert Quick Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Expert Tools</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<QuestionAnswer />}
                  onClick={() => router.push('/answers/my')}
                >
                  My Answers
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BarChart />}
                  onClick={() => router.push('/pakar/analytics')}
                >
                  Analytics
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<School />}
                  onClick={() => router.push('/pakar/profile')}
                >
                  Expert Profile
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Group />}
                  onClick={() => router.push('/pakar/network')}
                >
                  Expert Network
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Expert Guidelines */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Expert Guidelines</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom color="success.main">
                  ✅ Provide Accurate Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ensure your answers are factually correct and well-researched.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom color="success.main">
                  ✅ Be Timely
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try to answer questions within 24 hours when possible.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom color="success.main">
                  ✅ Be Professional
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Maintain professional language and respect all users.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom color="success.main">
                  ✅ Cite Sources
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reference credible sources when providing information.
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Top Experts */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Top Experts This Month</Typography>
            <Stack spacing={2}>
              {[
                { name: 'Dr. Ahmad', specialization: 'Agriculture', score: 2450 },
                { name: 'Prof. Sari', specialization: 'Fisheries', score: 1980 },
                { name: 'Ir. Budi', specialization: 'Technology', score: 1765 },
              ].map((expert, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {expert.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2">{expert.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {expert.specialization}
                    </Typography>
                  </Box>
                  <Chip label={`${expert.score} pts`} size="small" />
                </Box>
              ))}
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
const PakarDashboardPage = () => (
  <ProtectedRoute roles={['pakar']}>
    <PakarDashboard />
  </ProtectedRoute>
);

export default PakarDashboardPage;

// =====================================================
// CATATAN:
// 1. Hanya PAKAR role yang bisa akses halaman ini
// 2. Merupakan salah satu dashboard role-specific di /dashboard/*
// 3. Di-redirect dari index.js untuk role PAKAR
// 4. Expert dashboard dengan fitur khusus untuk pakar
// =====================================================
