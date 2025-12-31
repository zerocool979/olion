// src/pages/dashboard/moderator.js
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
  Badge
} from '@mui/material';
import {
  Shield,
  Warning,
  Flag,
  Group,
  Timer,
  CheckCircle,
  Cancel,
  Refresh,
  Visibility,
  TrendingUp,
  BarChart
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';

const ModeratorDashboard = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [moderationStats, setModerationStats] = useState(null);
  const [pendingReports, setPendingReports] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch moderation stats
      const statsRes = await api.get('/moderation/stats');
      setModerationStats(statsRes.data);

      // Fetch pending reports
      const reportsRes = await api.get('/moderation/reports/pending');
      setPendingReports(reportsRes.data.slice(0, 5));

      // Fetch recent moderation actions
      const actionsRes = await api.get('/moderation/actions/recent');
      setRecentActions(actionsRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching moderator dashboard:', err);
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
          Loading moderator dashboard...
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Shield color="warning" />
              <Typography variant="h4">
                Moderator Dashboard
              </Typography>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome, Moderator {user?.name}! Keep the community safe and respectful
            </Typography>
            <Chip
              icon={<Shield />}
              label="Community Moderator"
              color="warning"
              variant="outlined"
              sx={{ mt: 1 }}
            />
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
              color="warning"
              startIcon={<Flag />}
              onClick={() => router.push('/admin/content-moderation')}
            >
              Moderate Content
            </Button>
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Moderation Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderLeft: '4px solid', borderColor: 'warning.main' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Flag color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Pending Reports</Typography>
              </Box>
              <Typography variant="h4">
                <Badge badgeContent={pendingReports.length} color="error">
                  {moderationStats?.pendingReports || 0}
                </Badge>
              </Typography>
            </CardContent>
            <CardContent sx={{ py: 1 }}>
              <Button
                fullWidth
                size="small"
                onClick={() => router.push('/admin/content-moderation')}
              >
                Review Now
              </Button>
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
              <Typography variant="h4">{moderationStats?.avgResponseTime || 'N/A'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Resolved Today</Typography>
              </Box>
              <Typography variant="h4">{moderationStats?.resolvedToday || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="primary" sx={{ mr: 1 }} />
                <Typography color="text.secondary">Moderation Score</Typography>
              </Box>
              <Typography variant="h4">{moderationStats?.moderationScore || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Pending Reports */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                <Badge badgeContent={pendingReports.length} color="error" sx={{ mr: 1 }}>
                  Pending Reports
                </Badge>
              </Typography>
              <Button size="small" onClick={() => router.push('/admin/content-moderation')}>
                View All
              </Button>
            </Box>

            {pendingReports.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">No pending reports. Great job!</Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {pendingReports.map((report) => (
                  <Paper key={report.id} variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={report.contentType}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                          <Chip
                            label={report.priority}
                            size="small"
                            color={report.priority === 'high' ? 'error' : 'warning'}
                          />
                        </Box>
                        <Typography variant="subtitle2" gutterBottom>
                          {report.reason}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Reported by: {report.reporter?.name} • {report.createdAt}
                        </Typography>
                      </Box>
                      <Stack direction="column" spacing={1}>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => router.push(`/moderation/reports/${report.id}`)}
                        >
                          Review
                        </Button>
                      </Stack>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>

          {/* Recent Moderation Actions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Moderation Actions</Typography>
            {recentActions.length === 0 ? (
              <Typography color="text.secondary" align="center" py={2}>
                No recent moderation actions
              </Typography>
            ) : (
              <Stack spacing={2}>
                {recentActions.map((action, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
                    {action.action === 'approved' ? (
                      <CheckCircle color="success" />
                    ) : action.action === 'removed' ? (
                      <Cancel color="error" />
                    ) : (
                      <Warning color="warning" />
                    )}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        {action.action.charAt(0).toUpperCase() + action.action.slice(1)} {action.contentType}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        By {action.moderator?.name} • {action.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Quick Moderation Actions */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                startIcon={<Flag />}
                onClick={() => router.push('/admin/content-moderation')}
              >
                Content Moderation
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Group />}
                onClick={() => router.push('/users?filter=reported')}
              >
                Reported Users
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<BarChart />}
                onClick={() => router.push('/moderation/analytics')}
              >
                Moderation Analytics
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Shield />}
                onClick={() => router.push('/moderation/guidelines')}
              >
                Moderation Guidelines
              </Button>
            </Stack>
          </Paper>

          {/* Moderation Guidelines */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Moderation Principles</Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" gutterBottom color="warning.main">
                  ⚖️ Be Fair & Consistent
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Apply rules consistently to all users.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom color="warning.main">
                  📝 Document Actions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Always provide clear reasons for moderation actions.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom color="warning.main">
                  🤝 Respect Privacy
                </Typography>
                <Typography variant="body2" color="text-secondary">
                  Protect user privacy while maintaining community standards.
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" gutterBottom color="warning.main">
                  🕒 Respond Promptly
                </Typography>
                <Typography variant="body2" color="text-secondary">
                  Address reports in a timely manner.
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
const ModeratorDashboardPage = () => (
  <ProtectedRoute roles={['moderator']}>
    <ModeratorDashboard />
  </ProtectedRoute>
);

export default ModeratorDashboardPage;

// =====================================================
// CATATAN:
// 1. Hanya MODERATOR role yang bisa akses halaman ini
// 2. Merupakan salah satu dashboard role-specific di /dashboard/*
// 3. Di-redirect dari index.js untuk role MODERATOR
// 4. Moderator dashboard dengan akses ke content moderation
// =====================================================
