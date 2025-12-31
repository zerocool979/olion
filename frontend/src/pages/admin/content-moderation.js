// src/pages/admin/content-moderation.js
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid, // Grid sudah diimport langsung
  Badge,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Flag,
  Delete,
  CheckCircle,
  Warning,
  Comment,
  Forum,
  QuestionAnswer,
  Person,
  Refresh,
  Search,
  MoreVert,
  Block,
  Report,
  Visibility,
  FilterList,
  Sort,
  Download,
  Archive,
  Restore,
  Email,
  CalendarToday,
  TrendingUp,
  BarChart,
  Clear
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs
dayjs.extend(relativeTime);

const ContentModerationPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedReport, setSelectedReport] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [actionRemarks, setActionRemarks] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    highPriority: 0,
    today: 0
  });

  // Cek apakah user memiliki akses sebagai admin/moderator
  const isAdmin = user?.role === 'admin';
  const isModerator = user?.role === 'moderator';
  const canTakeAction = isAdmin || isModerator;

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/moderation/reports', {
        params: {
          status: tabValue === 0 ? 'pending' : tabValue === 1 ? 'resolved' : 'all',
          contentType: filter !== 'all' ? filter : undefined,
          search: searchTerm || undefined,
          sortBy,
          sortOrder,
          page: page + 1,
          limit: rowsPerPage
        }
      });

      // Handle response based on your API structure
      if (response.data && Array.isArray(response.data.data)) {
        setReports(response.data.data || []);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
      } else {
        setReports(response.data || []);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load reports'
      );
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [tabValue, filter, searchTerm, sortBy, sortOrder, page, rowsPerPage]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleAction = async (reportId, action, remarks = '') => {
    try {
      await api.post(`/moderation/reports/${reportId}/${action}`, {
        remarks,
        moderatorId: user?.id
      });
      setSnackbar({
        open: true,
        message: `Report ${action}d successfully`,
        severity: 'success'
      });
      fetchReports(); // Refresh data
    } catch (err) {
      console.error(`Error ${action}ing report:`, err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || `Failed to ${action} report`,
        severity: 'error'
      });
    }
  };

  const confirmAction = async () => {
    if (!selectedReport || !selectedAction) return;

    try {
      await handleAction(selectedReport.id, selectedAction, actionRemarks);
      setActionDialogOpen(false);
      setSelectedAction('');
      setActionRemarks('');
      setSelectedReport(null);
    } catch (err) {
      console.error('Error confirming action:', err);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'discussion': return <Forum fontSize="small" />;
      case 'answer': return <QuestionAnswer fontSize="small" />;
      case 'comment': return <Comment fontSize="small" />;
      default: return <Flag fontSize="small" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'rejected': return 'error';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Warning fontSize="small" />;
      case 'medium': return <Warning fontSize="small" />;
      case 'low': return <Warning fontSize="small" />;
      default: return null;
    }
  };

  const handleExportData = () => {
    // Implement export functionality
    console.log('Exporting reports data...');
    setSnackbar({
      open: true,
      message: 'Export feature coming soon',
      severity: 'info'
    });
  };

  const handleBulkAction = (action) => {
    // Implement bulk action functionality
    console.log(`Bulk ${action} selected`);
    setSnackbar({
      open: true,
      message: `Bulk ${action} feature coming soon`,
      severity: 'info'
    });
  };

  // Filter reports based on tab and search
  const filteredReports = reports.filter(report => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        report.reason?.toLowerCase().includes(searchLower) ||
        report.content?.toLowerCase().includes(searchLower) ||
        report.reporter?.name?.toLowerCase().includes(searchLower) ||
        report.contentAuthor?.name?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (filter !== 'all' && report.contentType !== filter) {
      return false;
    }

    return true;
  });

  if (loading && page === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header dengan stats */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Flag color="primary" />
                Content Moderation
              </Box>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Review reported content and take appropriate actions
              {user && ` • Logged in as: ${user.name} (${user.role})`}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={fetchReports} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Data">
              <IconButton onClick={handleExportData}>
                <Download />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="primary">
                  {stats.total || reports.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Reports
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="warning.main">
                  {stats.pending || reports.filter(r => r.status === 'pending').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="success.main">
                  {stats.resolved || reports.filter(r => r.status === 'resolved').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Resolved
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="error.main">
                  {stats.highPriority || reports.filter(r => r.priority === 'high').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High Priority
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h4" color="info.main">
                  {stats.today || reports.filter(r =>
                    dayjs(r.createdAt).isSame(dayjs(), 'day')).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs dan Filters */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => {
              setTabValue(v);
              setPage(0); // Reset ke halaman pertama saat ganti tab
            }}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              label={
                <Badge badgeContent={reports.filter(r => r.status === 'pending').length} color="warning" max={99}>
                  <span>Pending</span>
                </Badge>
              }
            />
            <Tab
              label={
                <Badge badgeContent={reports.filter(r => r.status === 'resolved').length} color="success" max={99}>
                  <span>Resolved</span>
                </Badge>
              }
            />
            <Tab label="All Reports" />
            <Tab label="Archived" />
          </Tabs>
        </Box>

        {/* Filter Controls */}
        <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <Clear fontSize="small" />
                </IconButton>
              )
            }}
            size="small"
            sx={{ width: { xs: '100%', sm: 300 } }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Content Type</InputLabel>
            <Select
              value={filter}
              label="Content Type"
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="discussion">Discussions</MenuItem>
              <MenuItem value="answer">Answers</MenuItem>
              <MenuItem value="comment">Comments</MenuItem>
              <MenuItem value="user">User Profiles</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filter}
              label="Priority"
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1}>
            <Tooltip title="Sort by Date">
              <IconButton
                size="small"
                onClick={() => handleSort('createdAt')}
                color={sortBy === 'createdAt' ? 'primary' : 'default'}
              >
                <Sort />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FilterList />}
              onClick={() => {/* Advanced filter dialog */}}
            >
              More Filters
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={fetchReports}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Reports Table */}
      {filteredReports.length === 0 ? (
        <Paper sx={{ p: 8, textAlign: 'center' }}>
          <Flag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No reports found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No reports match the current criteria'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper sx={{ mb: 2, overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="40px">#</TableCell>
                    <TableCell>Content</TableCell>
                    <TableCell>Reporter</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reported</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReports
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((report, index) => (
                    <TableRow
                      key={report.id}
                      hover
                      sx={{
                        '&:hover': { cursor: 'pointer' },
                        bgcolor: report.priority === 'high' && report.status === 'pending'
                          ? 'error.light'
                          : 'inherit'
                      }}
                      onClick={() => {
                        setSelectedReport(report);
                        setDialogOpen(true);
                      }}
                    >
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Box sx={{ maxWidth: 300 }}>
                          <Typography variant="body2" noWrap>
                            {report.content?.substring(0, 100)}...
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Reason: {report.reason}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 24, height: 24 }} src={report.reporter?.avatar}>
                            {report.reporter?.name?.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">
                            {report.reporter?.name || 'Anonymous'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {report.contentAuthor ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24 }} src={report.contentAuthor?.avatar}>
                              {report.contentAuthor?.name?.charAt(0)}
                            </Avatar>
                            <Typography variant="body2">
                              {report.contentAuthor?.name}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Deleted
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getContentIcon(report.contentType)}
                          label={report.contentType}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getPriorityIcon(report.priority)}
                          label={report.priority}
                          color={getPriorityColor(report.priority)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={report.status}
                          color={getStatusColor(report.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {dayjs(report.createdAt).format('DD/MM/YY')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(report.createdAt).fromNow()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" onClick={e => e.stopPropagation()}>
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReport(report);
                                setDialogOpen(true);
                              }}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          {report.status === 'pending' && canTakeAction && (
                            <>
                              <Tooltip title="Approve">
                                <IconButton
                                  size="small"
                                  color="success"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedReport(report);
                                    setSelectedAction('approve');
                                    setActionDialogOpen(true);
                                  }}
                                >
                                  <CheckCircle fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedReport(report);
                                    setSelectedAction('remove');
                                    setActionDialogOpen(true);
                                  }}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Warn User">
                                <IconButton
                                  size="small"
                                  color="warning"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedReport(report);
                                    setSelectedAction('warn');
                                    setActionDialogOpen(true);
                                  }}
                                >
                                  <Warning fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}

                          {(report.status === 'resolved' || report.status === 'pending') && isAdmin && (
                            <Tooltip title="Archive">
                              <IconButton
                                size="small"
                                color="default"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedReport(report);
                                  setSelectedAction('archive');
                                  setActionDialogOpen(true);
                                }}
                              >
                                <Archive fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filteredReports.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Paper>

          {/* Bulk Actions */}
          {canTakeAction && tabValue === 0 && filteredReports.length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Bulk Actions
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  onClick={() => handleBulkAction('approve')}
                >
                  Approve Selected
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleBulkAction('remove')}
                >
                  Remove Selected
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  startIcon={<Warning />}
                  onClick={() => handleBulkAction('warn')}
                >
                  Warn Authors
                </Button>
              </Stack>
            </Paper>
          )}
        </>
      )}

      {/* Report Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getContentIcon(selectedReport?.contentType)}
            <span>Report Details</span>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedReport && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={3}>
                {/* Basic Info */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    BASIC INFORMATION
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Report ID
                      </Typography>
                      <Typography variant="body2">
                        {selectedReport.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Content Type
                      </Typography>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {selectedReport.contentType}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Priority
                      </Typography>
                      <Chip
                        label={selectedReport.priority}
                        color={getPriorityColor(selectedReport.priority)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={selectedReport.status}
                        color={getStatusColor(selectedReport.status)}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* People Involved */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    PEOPLE INVOLVED
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Reporter
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Avatar src={selectedReport.reporter?.avatar} sx={{ width: 48, height: 48 }}>
                              {selectedReport.reporter?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body1">
                                {selectedReport.reporter?.name || 'Anonymous'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {selectedReport.reporter?.email || 'No email'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Role: {selectedReport.reporter?.role || 'Unknown'}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Content Author
                          </Typography>
                          {selectedReport.contentAuthor ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                              <Avatar src={selectedReport.contentAuthor?.avatar} sx={{ width: 48, height: 48 }}>
                                {selectedReport.contentAuthor?.name?.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1">
                                  {selectedReport.contentAuthor?.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {selectedReport.contentAuthor?.email}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Role: {selectedReport.contentAuthor?.role}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              User account has been deleted or is unavailable
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Report Details */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    REPORT DETAILS
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="body2" paragraph>
                      <strong>Reason:</strong> {selectedReport.reason}
                    </Typography>
                    {selectedReport.description && (
                      <Typography variant="body2" paragraph>
                        <strong>Detailed Description:</strong> {selectedReport.description}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">
                      Reported: {dayjs(selectedReport.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Content Preview */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    CONTENT PREVIEW
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      bgcolor: 'background.default',
                      maxHeight: 300,
                      overflow: 'auto'
                    }}
                  >
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {selectedReport.content}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Resolution Details */}
                {selectedReport.status === 'resolved' && selectedReport.resolution && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="subtitle2" gutterBottom>
                        RESOLUTION DETAILS
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {selectedReport.resolution.remarks}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Resolved by: {selectedReport.resolution.moderator?.name}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Resolved at: {dayjs(selectedReport.resolution.resolvedAt).format('DD/MM/YYYY HH:mm')}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Action taken: {selectedReport.resolution.action}
                      </Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Close
          </Button>
          {selectedReport?.status === 'pending' && canTakeAction && (
            <>
              <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => {
                  setDialogOpen(false);
                  setSelectedAction('approve');
                  setActionDialogOpen(true);
                }}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  setDialogOpen(false);
                  setSelectedAction('remove');
                  setActionDialogOpen(true);
                }}
              >
                Remove Content
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedAction === 'approve' && 'Approve Content'}
          {selectedAction === 'remove' && 'Remove Content'}
          {selectedAction === 'warn' && 'Warn User'}
          {selectedAction === 'archive' && 'Archive Report'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Are you sure you want to {selectedAction} this content?
            {selectedReport && ` (Report ID: ${selectedReport.id})`}
          </Typography>

          {(selectedAction === 'remove' || selectedAction === 'warn' || selectedAction === 'archive') && (
            <TextField
              autoFocus
              margin="dense"
              label="Remarks (required)"
              placeholder="Explain your decision..."
              fullWidth
              multiline
              rows={3}
              value={actionRemarks}
              onChange={(e) => setActionRemarks(e.target.value)}
              required
              error={!actionRemarks.trim()}
              helperText={!actionRemarks.trim() ? 'Remarks are required' : ''}
            />
          )}

          {selectedAction === 'remove' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>Warning:</strong> This action will permanently remove the content.
              The author may be notified depending on your system settings.
            </Alert>
          )}

          {selectedAction === 'warn' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Note:</strong> A warning will be sent to the content author.
              Repeated violations may lead to account restrictions.
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
            color={
              selectedAction === 'approve' ? 'success' :
              selectedAction === 'remove' ? 'error' :
              selectedAction === 'archive' ? 'default' :
              'warning'
            }
            disabled={(selectedAction === 'remove' || selectedAction === 'warn' || selectedAction === 'archive')
              && !actionRemarks.trim()}
          >
            Confirm {selectedAction}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
          elevation={6}
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
const ContentModerationPageWithProtection = () => {
  return (
    <ProtectedRoute roles={['admin', 'moderator']}>
      <ContentModerationPage />
    </ProtectedRoute>
  );
};

export default ContentModerationPageWithProtection;

// =====================================================
// CATATAN:
// 1. Hanya ADMIN dan MODERATOR yang bisa akses content moderation
// 2. File sudah sesuai dengan struktur role-based routing
// 3. ProtectedRoute sudah menangani auth dan role checking
// =====================================================
