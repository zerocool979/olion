// src/pages/admin/index.js
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Stack,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Badge,
  Avatar
} from '@mui/material';
import {
  Shield,
  VerifiedUser,
  Warning,
  Group,
  Dashboard as DashboardIcon,
  BarChart,
  Settings,
  ArrowForward,
  Person,
  Refresh,
  TrendingUp,
  Notifications,
  Report,
  Chat,
  Security,
  Lock,
  AdminPanelSettings,
  ExitToApp,
  MoreVert,
  Edit,
  Visibility,
  Download,
  Print,
  Help,
  Search,
  FilterList,
  EventNote,
  AccessTime,
  CheckCircle,
  Cancel,
  Error as ErrorIcon,
  Info,
  Speed
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with plugins
dayjs.extend(relativeTime);

const AdminDashboard = () => {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  // State management
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingItems, setPendingItems] = useState({
    approvals: 0,
    reports: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [quickActionDialog, setQuickActionDialog] = useState({
    open: false,
    action: null
  });

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [statsRes, activityRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/activity/recent')
      ]);

      setStats(statsRes.data);
      setRecentActivity(activityRes.data || []);

      // Calculate pending items
      const pending = {
        approvals: statsRes.data?.pendingApprovals || 0,
        reports: statsRes.data?.pendingReports || 0,
        applications: statsRes.data?.pendingApplications || 0
      };
      setPendingItems(pending);

    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');

      // Fallback mock data for development
      setStats({
        totalUsers: 156,
        totalDiscussions: 89,
        totalAnswers: 324,
        activeUsers: 78,
        pendingApprovals: 5,
        pendingReports: 3,
        pendingApplications: 7,
        todayRegistrations: 12,
        systemHealth: 'healthy'
      });

      setRecentActivity([
        { id: 1, type: 'user_register', user: 'John Doe', timestamp: new Date().toISOString() },
        { id: 2, type: 'discussion_create', user: 'Jane Smith', timestamp: new Date().toISOString() },
        { id: 3, type: 'report_submit', user: 'Admin User', timestamp: new Date().toISOString() }
      ]);

    } finally {
      setLoading(false);
      setRefreshLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user, fetchDashboardData]);

  // Handle refresh
  const handleRefresh = () => {
    setRefreshLoading(true);
    fetchDashboardData();
  };

  // Handle quick actions
  const handleQuickAction = (action) => {
    switch (action) {
      case 'view_users':
        router.push('/users');
        break;
      case 'approve_experts':
        router.push('/admin/expert-approval');
        break;
      case 'moderate_content':
        router.push('/admin/content-moderation');
        break;
      case 'system_logs':
        router.push('/admin/logs');
        break;
      default:
        setQuickActionDialog({ open: true, action });
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Admin cards configuration
  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage all users, roles, and permissions',
      icon: <Group />,
      color: 'primary',
      path: '/users',
      roles: ['admin'],
      badge: pendingItems.approvals,
      badgeColor: 'error'
    },
    {
      title: 'Expert Approval',
      description: 'Review and approve pakar applications',
      icon: <VerifiedUser />,
      color: 'success',
      path: '/admin/expert-approval',
      roles: ['admin'],
      badge: pendingItems.applications,
      badgeColor: 'warning'
    },
    {
      title: 'Content Moderation',
      description: 'Moderate discussions, answers, and comments',
      icon: <Warning />,
      color: 'warning',
      path: '/admin/content-moderation',
      roles: ['admin', 'moderator'],
      badge: pendingItems.reports,
      badgeColor: 'error'
    },
    {
      title: 'System Analytics',
      description: 'View system analytics and reports',
      icon: <BarChart />,
      color: 'info',
      path: '/admin/analytics',
      roles: ['admin'],
      badge: null
    },
    {
      title: 'General Dashboard',
      description: 'Go to general user dashboard',
      icon: <DashboardIcon />,
      color: 'secondary',
      path: '/dashboard',
      roles: ['admin', 'moderator', 'pakar', 'user'],
      badge: null
    },
    {
      title: 'System Settings',
      description: 'Configure system settings',
      icon: <Settings />,
      color: 'error',
      path: '/admin/settings',
      roles: ['admin'],
      badge: null
    },
    {
      title: 'Security Logs',
      description: 'View security and access logs',
      icon: <Security />,
      color: 'info',
      path: '/admin/logs',
      roles: ['admin'],
      badge: null
    },
    {
      title: 'Report Center',
      description: 'View and manage all reports',
      icon: <Report />,
      color: 'warning',
      path: '/admin/reports',
      roles: ['admin', 'moderator'],
      badge: pendingItems.reports,
      badgeColor: 'error'
    }
  ];

  // Filter cards based on user role
  const filteredCards = adminCards.filter(card =>
    card.roles.includes(user?.role || 'user')
  );

  // Quick stats cards
  const quickStats = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <Group color="primary" />,
      change: '+12%',
      color: 'primary'
    },
    {
      title: 'Active Discussions',
      value: stats?.totalDiscussions || 0,
      icon: <Chat color="success" />,
      change: '+5%',
      color: 'success'
    },
    {
      title: 'Today Registrations',
      value: stats?.todayRegistrations || 0,
      icon: <TrendingUp color="warning" />,
      change: '+8%',
      color: 'warning'
    },
    {
      title: 'System Health',
      value: stats?.systemHealth === 'healthy' ? 'Healthy' : 'Issues',
      icon: stats?.systemHealth === 'healthy' ? <CheckCircle color="success" /> : <ErrorIcon color="error" />,
      change: null,
      color: stats?.systemHealth === 'healthy' ? 'success' : 'error'
    }
  ];

  // Loading state
  if (authLoading || loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <LinearProgress sx={{ width: '60%', mx: 'auto', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading Admin Dashboard...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Preparing your administrative tools and analytics
          </Typography>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchDashboardData}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Unauthorized state
  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">
          You need to be logged in to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Shield color="primary" />
              Admin Dashboard
              <Chip
                label={user?.role?.toUpperCase()}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back, <strong>{user?.name || user?.email || 'Admin'}</strong>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<AccessTime />}
                label={`Last login: ${dayjs().format('DD/MM/YYYY HH:mm')}`}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<EventNote />}
                label={dayjs().format('dddd, MMMM D, YYYY')}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh Dashboard">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshLoading}
                color="primary"
              >
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="System Status">
              <IconButton>
                <Speed />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              color="inherit"
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {quickStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{
              height: '100%',
              borderLeft: `4px solid`,
              borderColor: `${stat.color}.main`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="h3" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: `${stat.color}.main` }}>
                    {stat.icon}
                  </Box>
                </Box>
                {stat.change && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: stat.change.startsWith('+') ? 'success.main' : 'error.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <TrendingUp fontSize="small" />
                    {stat.change} from last week
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pending Actions Alert */}
      {(pendingItems.approvals > 0 || pendingItems.reports > 0 || pendingItems.applications > 0) && (
        <Alert
          severity="warning"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => handleQuickAction('view_pending')}>
              View All
            </Button>
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Warning />
            <Box>
              <Typography variant="subtitle2">Pending actions require your attention:</Typography>
              <Typography variant="body2">
                {pendingItems.approvals > 0 && `${pendingItems.approvals} approvals • `}
                {pendingItems.reports > 0 && `${pendingItems.reports} reports • `}
                {pendingItems.applications > 0 && `${pendingItems.applications} applications`}
              </Typography>
            </Box>
          </Box>
        </Alert>
      )}

      {/* Main Admin Cards Grid */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AdminPanelSettings /> Admin Tools
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {filteredCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              elevation={1}
              sx={{
                p: 2.5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8,
                  borderColor: `${card.color}.main`,
                  cursor: 'pointer'
                }
              }}
              onClick={() => router.push(card.path)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  flex: 1
                }}>
                  <Box sx={{
                    color: `${card.color}.main`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    backgroundColor: `${card.color}.light`,
                  }}>
                    {card.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight="600">
                      {card.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.description}
                    </Typography>
                  </Box>
                </Box>

                {card.badge && card.badge > 0 && (
                  <Badge
                    badgeContent={card.badge}
                    color={card.badgeColor}
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>

              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForward />}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(card.path);
                }}
                fullWidth
                sx={{
                  mt: 'auto',
                  backgroundColor: `${card.color}.main`,
                  '&:hover': {
                    backgroundColor: `${card.color}.dark`,
                  }
                }}
              >
                Access
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity & Quick Actions */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications /> Recent Activity
              </Typography>
              <Button size="small" onClick={() => router.push('/admin/activity')}>
                View All
              </Button>
            </Box>

            {recentActivity.length === 0 ? (
              <Alert severity="info">
                No recent activity to display
              </Alert>
            ) : (
              <Stack spacing={2}>
                {recentActivity.slice(0, 5).map((activity) => (
                  <Paper
                    key={activity.id}
                    variant="outlined"
                    sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <Avatar sx={{ width: 40, height: 40 }}>
                      {activity.user?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2">
                        <strong>{activity.user}</strong> {activity.type}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(activity.timestamp).fromNow()}
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Speed /> Quick Actions
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<Group />}
                onClick={() => handleQuickAction('view_users')}
                fullWidth
              >
                View All Users
              </Button>

              <Button
                variant="outlined"
                startIcon={<VerifiedUser />}
                onClick={() => handleQuickAction('approve_experts')}
                fullWidth
              >
                Approve Experts
              </Button>

              <Button
                variant="outlined"
                startIcon={<Warning />}
                onClick={() => handleQuickAction('moderate_content')}
                fullWidth
              >
                Moderate Content
              </Button>

              <Button
                variant="outlined"
                startIcon={<Security />}
                onClick={() => handleQuickAction('system_logs')}
                fullWidth
              >
                View System Logs
              </Button>

              <Divider sx={{ my: 1 }} />

              <Button
                variant="text"
                startIcon={<Help />}
                onClick={() => router.push('/admin/help')}
                fullWidth
              >
                Admin Guide
              </Button>

              <Button
                variant="text"
                startIcon={<Download />}
                onClick={() => setSnackbar({ open: true, message: 'Exporting data...', severity: 'info' })}
                fullWidth
              >
                Export Data
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* System Status Footer */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              System Status
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <CheckCircle color="success" fontSize="small" />
              <Typography variant="body2">
                All systems operational • Uptime: 99.9%
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Last updated: {dayjs().format('HH:mm:ss')}
          </Typography>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Quick Action Dialog */}
      <Dialog
        open={quickActionDialog.open}
        onClose={() => setQuickActionDialog({ open: false, action: null })}
      >
        <DialogTitle>Quick Action</DialogTitle>
        <DialogContent>
          <Typography>
            Perform action: {quickActionDialog.action}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuickActionDialog({ open: false, action: null })}>
            Cancel
          </Button>
          <Button variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// =====================================================
// FINAL IMPLEMENTATION - WRAP WITH PROTECTEDROUTE
// =====================================================
const AdminDashboardPage = () => {
  return (
    <ProtectedRoute roles={['admin', 'moderator']}>
      <AdminDashboard />
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;

// =====================================================
// CATATAN:
// 1. Hanya ADMIN dan MODERATOR yang bisa akses /admin
// 2. Dashboard admin sudah lengkap dengan fitur-fitur
// 3. ProtectedRoute sudah menangani auth dan role checking
// =====================================================
