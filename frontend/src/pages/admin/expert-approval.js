// src/pages/admin/expert-approval.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Avatar,
  Stack,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Snackbar,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  // Tambahkan Grid yang hilang
  Grid,
  // Tambahan komponen baru
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Breadcrumbs,
  Link,
  Fade,
  Zoom
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  VerifiedUser,
  Person,
  Search,
  Refresh,
  Visibility,
  Block,
  Email,
  CalendarToday,
  Work,
  School,
  FilterList,
  Clear,
  ArrowBack,
  Home,
  TrendingUp,
  Warning
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
// Import ProtectedRoute - PERBAIKAN: path yang benar
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';
import dayjs from '../../utils/dayjs';

const ExpertApprovalPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [remarks, setRemarks] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchTerm, setSearchTerm] = useState('');
  // Tambahan state baru
  const [filterStatus, setFilterStatus] = useState('pending');
  const [filterExperience, setFilterExperience] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      // Gunakan endpoint yang sesuai dengan backend
      const response = await api.get('/pakar/applications/pending');
      setApplications(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load expert applications'
      );
      setApplications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleApprove = async (applicationId, userId) => {
    try {
      setActionType('approve');
      setActionDialogOpen(true);
      setSelectedApp({ id: applicationId, userId });
    } catch (err) {
      console.error('Error preparing approval:', err);
      setSnackbar({
        open: true,
        message: 'Error preparing approval action',
        severity: 'error'
      });
    }
  };

  const handleReject = async (applicationId, userId) => {
    try {
      setActionType('reject');
      setActionDialogOpen(true);
      setSelectedApp({ id: applicationId, userId });
    } catch (err) {
      console.error('Error preparing rejection:', err);
      setSnackbar({
        open: true,
        message: 'Error preparing rejection action',
        severity: 'error'
      });
    }
  };

  const confirmAction = async () => {
    if (!selectedApp) return;

    try {
      const endpoint = `/pakar/${selectedApp.userId}/${actionType}`;
      const payload = actionType === 'reject' ? { remarks } : {};

      await api.post(endpoint, payload);

      setSnackbar({
        open: true,
        message: `Application ${actionType}d successfully`,
        severity: 'success'
      });

      fetchApplications(); // Refresh list
      setActionDialogOpen(false);
      setRemarks('');
      setSelectedApp(null);
    } catch (err) {
      console.error(`Error ${actionType}ing application:`, err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || `Failed to ${actionType} application`,
        severity: 'error'
      });
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApp(application);
    setDialogOpen(true);
  };

  // Fungsi filter yang lebih lengkap
  const filteredApplications = applications.filter(app => {
    // Filter search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        app.user?.name?.toLowerCase().includes(searchLower) ||
        app.user?.email?.toLowerCase().includes(searchLower) ||
        app.specialization?.toLowerCase().includes(searchLower) ||
        app.qualifications?.toLowerCase().includes(searchLower) ||
        app.additionalInfo?.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) return false;
    }

    // Filter experience
    if (filterExperience !== 'all') {
      if (filterExperience === 'junior' && app.experience >= 3) return false;
      if (filterExperience === 'mid' && (app.experience < 3 || app.experience >= 8)) return false;
      if (filterExperience === 'senior' && app.experience < 8) return false;
    }

    // Filter status (jika aplikasi punya status field)
    if (app.status && filterStatus !== 'all' && app.status !== filterStatus) {
      return false;
    }

    return true;
  });

  // Hitung statistik
  const stats = {
    total: applications.length,
    experienced: applications.filter(a => a.experience >= 5).length,
    junior: applications.filter(a => a.experience < 3).length,
    senior: applications.filter(a => a.experience >= 8).length,
    today: applications.filter(a =>
      dayjs(a.createdAt).isSame(dayjs(), 'day')
    ).length,
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterStatus('pending');
    setFilterExperience('all');
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Tambahkan breadcrumbs navigation
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/admin" onClick={(e) => {
      e.preventDefault();
      router.push('/admin');
    }}>
      Admin Dashboard
    </Link>,
    <Typography key="2" color="text.primary">
      Expert Approval
    </Typography>,
  ];

  if (loading && !refreshing) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Loading expert applications...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        {breadcrumbs}
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <VerifiedUser color="primary" />
                Expert Approval Requests
              </Box>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Review and approve/reject pakar applications
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Back to Admin Dashboard">
              <Button
                startIcon={<ArrowBack />}
                onClick={() => router.push('/admin')}
                variant="outlined"
              >
                Back
              </Button>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton
                onClick={fetchApplications}
                disabled={refreshing}
                color="primary"
              >
                <Refresh />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Admin info */}
        {user && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Logged in as: <strong>{user.name || user.email}</strong> • Role: <strong>{user.role}</strong>
          </Alert>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Applications
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success">
                {stats.experienced}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Experienced (5+ years)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning">
                {stats.today}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info">
                {stats.senior}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Senior (8+ years)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>

          {/* Experience Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Experience</InputLabel>
              <Select
                value={filterExperience}
                label="Experience"
                onChange={(e) => setFilterExperience(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="junior">Junior (&lt;3 years)</MenuItem>
                <MenuItem value="mid">Mid (3-7 years)</MenuItem>
                <MenuItem value="senior">Senior (8+ years)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Status Filter */}
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="reviewed">Reviewed</MenuItem>
                <MenuItem value="all">All Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearFilters}
                disabled={!searchTerm && filterExperience === 'all' && filterStatus === 'pending'}
              >
                Clear Filters
              </Button>
              <Button
                variant="outlined"
                startIcon={<VerifiedUser />}
                onClick={() => router.push('/pakar')}
              >
                View Approved Experts
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchApplications}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <VerifiedUser sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || filterExperience !== 'all' || filterStatus !== 'pending'
              ? 'Try adjusting your search or filters'
              : 'There are no pending expert applications at the moment'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={fetchApplications}
          >
            Refresh
          </Button>
        </Paper>
      ) : (
        <Fade in={true}>
          <div>
            <Paper sx={{ overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Applicant</TableCell>
                      <TableCell>Specialization</TableCell>
                      <TableCell>Experience</TableCell>
                      <TableCell>Qualifications</TableCell>
                      <TableCell>Applied</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <Zoom in={true} key={app.id}>
                        <TableRow
                          hover
                          sx={{
                            '&:hover': {
                              backgroundColor: 'action.hover',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => handleViewDetails(app)}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar src={app.user?.avatar} sx={{ width: 40, height: 40 }}>
                                {app.user?.name?.charAt(0) || app.user?.email?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight="medium">
                                  {app.user?.name || 'No Name'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {app.user?.email}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={app.specialization}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Work fontSize="small" color="action" />
                              <Typography variant="body2">
                                {app.experience} {app.experience === 1 ? 'year' : 'years'}
                              </Typography>
                              {app.experience >= 8 && (
                                <Chip label="Senior" size="small" color="success" />
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Tooltip title={app.qualifications}>
                              <Typography variant="body2" sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 200
                              }}>
                                {app.qualifications}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {dayjs(app.createdAt).fromNow()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {dayjs(app.createdAt).format('DD/MM/YYYY')}
                            </Typography>
                          </TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleViewDetails(app)}
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(app.id, app.userId);
                                  }}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(app.id, app.userId);
                                  }}
                                >
                                  <Cancel />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </Zoom>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredApplications.length} of {applications.length} applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated: {dayjs().format('HH:mm')}
              </Typography>
            </Box>
          </div>
        </Fade>
      )}

      {/* Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Application Details
        </DialogTitle>
        <DialogContent>
          {selectedApp && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                <Avatar
                  src={selectedApp.user?.avatar}
                  sx={{ width: 80, height: 80 }}
                >
                  {selectedApp.user?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedApp.user?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <Email fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {selectedApp.user?.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    User since: {dayjs(selectedApp.user?.createdAt).format('DD MMM YYYY')}
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Specialization
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedApp.specialization}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Experience
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedApp.experience} years
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Qualifications
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    <Typography variant="body2">
                      {selectedApp.qualifications}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Additional Information
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    <Typography variant="body2">
                      {selectedApp.additionalInfo || 'No additional information provided'}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Applied Date
                  </Typography>
                  <Typography variant="body1">
                    {dayjs(selectedApp.createdAt).format('DD MMM YYYY, HH:mm')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Application ID
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {selectedApp.id}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => {
              setDialogOpen(false);
              if (selectedApp) {
                handleApprove(selectedApp.id, selectedApp.userId);
              }
            }}
          >
            Approve Application
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Cancel />}
            onClick={() => {
              setDialogOpen(false);
              if (selectedApp) {
                handleReject(selectedApp.id, selectedApp.userId);
              }
            }}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
      >
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to {actionType} this application?
            {actionType === 'reject' && ' Please provide a reason for rejection:'}
          </DialogContentText>

          {actionType === 'reject' && (
            <TextField
              autoFocus
              margin="dense"
              label="Rejection Remarks"
              fullWidth
              multiline
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              sx={{ mt: 2 }}
              required
              placeholder="Please provide a reason for rejection..."
            />
          )}

          {actionType === 'approve' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Approving this application will grant expert privileges to the user.
                They will be able to provide verified answers and access expert-only features.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmAction}
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
            disabled={actionType === 'reject' && !remarks.trim()}
          >
            Confirm {actionType}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// =====================================================
// FINAL IMPLEMENTATION - WRAP WITH PROTECTEDROUTE
// =====================================================
// PERBAIKAN: Pindahkan WrappedExpertApproval ke bawah dan gunakan nama yang sesuai
const ExpertApprovalPageWithProtection = () => {
  return (
    <ProtectedRoute roles={['admin']}>
      <ExpertApprovalPage />
    </ProtectedRoute>
  );
};

export default ExpertApprovalPageWithProtection;

// =====================================================
// CATATAN:
// 1. Hanya ADMIN yang bisa akses expert approval
// 2. File sudah sesuai dengan struktur role-based routing
// 3. ProtectedRoute sudah menangani auth dan role checking
// =====================================================
