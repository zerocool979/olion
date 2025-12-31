// src/pages/users/index.js
'use client'; // Tambahkan directive untuk Next.js 13+

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getUsers, updateUserRole, deleteUser, createUser, getUserStats } from '../../api/user';
import UserTable from '../../components/UserTable';
import { useAuth } from '../../context/AuthContext';

// Import Material-UI components
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Alert,
  LinearProgress,
  Stack,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Breadcrumbs,
  Link,
  Fade,
  Avatar
} from '@mui/material';
import {
  Refresh,
  Search,
  Add,
  FilterList,
  Clear,
  Edit,
  Delete,
  Visibility,
  Person,
  Shield,
  VerifiedUser,
  Group,
  TrendingUp,
  Warning,
  CheckCircle,
  ArrowForward,
  Sort,
  MoreVert,
  Email,
  AccessTime
} from '@mui/icons-material';

/**
 * =====================================================
 * Users Page (Admin) - Enhanced Version
 * -----------------------------------------------------
 * Menampilkan dan mengelola daftar user dengan:
 * - Role-based access control (admin/moderator only)
 * - Advanced filtering & search
 * - Pagination
 * - User statistics
 * - Modern UI with Material-UI
 * =====================================================
 */

const UsersPage = () => {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  // Filter and search state
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // UI state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
    userName: '',
    userEmail: ''
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    userId: null,
    userData: null
  });

  // User stats
  const [userStats, setUserStats] = useState({
    total: 0,
    admins: 0,
    moderators: 0,
    pakars: 0,
    regularUsers: 0,
    activeUsers: 0
  });

  // Role-based permissions
  const userRole = currentUser?.role || 'user';
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;
  const canEditUsers = isAdmin; // Hanya admin yang bisa edit role
  const canDeleteUsers = isAdmin; // Hanya admin yang bisa delete
  const canAddUsers = isAdmin; // Hanya admin yang bisa add

  /**
   * =====================================================
   * Data Fetching
   * =====================================================
   */
  const fetchUsers = useCallback(async (page = 1, filterParams = {}) => {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError(null);

      // Prepare query parameters
      const queryParams = {
        page: page.toString(),
        limit: pagination.itemsPerPage.toString(),
        ...filterParams
      };

      // Remove 'all' filters
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === 'all') {
          delete queryParams[key];
        }
      });

      const response = await getUsers(queryParams);

      // Handle response based on API structure
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            page: response.pagination.page || page,
            totalPages: response.pagination.totalPages || 1,
            totalItems: response.pagination.totalItems || response.data.length
          }));
        }
      } else {
        // Handle array response directly
        setUsers(response);
        setPagination(prev => ({
          ...prev,
          page,
          totalItems: response.length
        }));
      }

    } catch (err) {
      console.error('Error fetching users:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load users. Please try again.'
      );

      setSnackbar({
        open: true,
        message: 'Failed to load users',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }

    return () => controller.abort();
  }, [pagination.itemsPerPage]);

  const fetchUserStats = useCallback(async () => {
    try {
      const stats = await getUserStats();
      setUserStats(stats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  }, []);

  /**
   * =====================================================
   * Effects
   * =====================================================
   */
  useEffect(() => {
    fetchUsers(pagination.page, filters);
    fetchUserStats();
  }, [fetchUsers, fetchUserStats, pagination.page, filters]);

  /**
   * =====================================================
   * Event Handlers
   * =====================================================
   */
  const handleSearch = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      role: 'all',
      status: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((event, page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers(pagination.page, filters);
    fetchUserStats();
  }, [fetchUsers, fetchUserStats, pagination.page, filters]);

  const handleAddUser = useCallback(() => {
    router.push('/users/create');
  }, [router]);

  const handleEditUser = useCallback((userId) => {
    const userToEdit = users.find(user => user.id === userId);
    if (userToEdit) {
      setEditDialog({
        open: true,
        userId,
        userData: userToEdit
      });
    }
  }, [users]);

  const handleViewUser = useCallback((userId) => {
    router.push(`/users/${userId}`);
  }, [router]);

  const handleOpenDeleteDialog = useCallback((userId, userName, userEmail) => {
    // Prevent deleting yourself
    if (userId === currentUser?.id) {
      setSnackbar({
        open: true,
        message: 'You cannot delete your own account',
        severity: 'warning'
      });
      return;
    }

    setDeleteDialog({
      open: true,
      userId,
      userName,
      userEmail
    });
  }, [currentUser]);

  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialog({
      open: false,
      userId: null,
      userName: '',
      userEmail: ''
    });
  }, []);

  const handleDeleteUser = useCallback(async () => {
    if (!deleteDialog.userId) return;

    try {
      await deleteUser(deleteDialog.userId);

      setSnackbar({
        open: true,
        message: `User "${deleteDialog.userName}" has been deleted successfully`,
        severity: 'success'
      });

      // Refresh user list and stats
      fetchUsers(pagination.page, filters);
      fetchUserStats();

    } catch (err) {
      console.error('Error deleting user:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to delete user',
        severity: 'error'
      });
    } finally {
      handleCloseDeleteDialog();
    }
  }, [deleteDialog, fetchUsers, fetchUserStats, pagination.page, filters, handleCloseDeleteDialog]);

  const handleCloseEditDialog = useCallback(() => {
    setEditDialog({
      open: false,
      userId: null,
      userData: null
    });
  }, []);

  /**
   * =========================================
   * FIX: handler untuk update role user
   * =========================================
   */
  const onUpdateRole = async (userId, role) => {
    try {
      await updateUserRole(userId, { role });

      setSnackbar({
        open: true,
        message: `User role updated to ${role}`,
        severity: 'success'
      });

      // refresh data
      fetchUsers(pagination.page, filters);

    } catch (err) {
      console.error('Error updating user role:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update user role',
        severity: 'error'
      });
    }
  };

  const handleSaveEdit = async () => {
    if (!editDialog.userId || !editDialog.userData) return;

    try {
      await updateUserRole(editDialog.userId, {
        role: editDialog.userData.role,
        isActive: editDialog.userData.isActive
      });

      setSnackbar({
        open: true,
        message: 'User updated successfully',
        severity: 'success'
      });

      fetchUsers(pagination.page, filters);
      handleCloseEditDialog();

    } catch (err) {
      console.error('Error updating user:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update user',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  /**
   * =====================================================
   * Memoized Values
   * =====================================================
   */
  const filteredUsers = users.filter(user => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.username?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Role filter
    if (filters.role !== 'all' && user.role !== filters.role) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all') {
      const isActive = user.isActive !== false;
      if (filters.status === 'active' && !isActive) return false;
      if (filters.status === 'inactive' && isActive) return false;
    }

    return true;
  });

  /**
   * =====================================================
   * Render Components
   * =====================================================
   */

  // Loading State
  const renderLoading = () => (
    <Box sx={{ width: '100%', py: 4 }}>
      <LinearProgress />
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        Loading users...
      </Typography>
    </Box>
  );

  // Error State
  const renderError = () => (
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={handleRefresh}>
          Retry
        </Button>
      }
      sx={{ mb: 3 }}
    >
      <Typography variant="body1" fontWeight="medium">
        {error}
      </Typography>
      <Typography variant="body2">
        Please check your connection and try again.
      </Typography>
    </Alert>
  );

  // Empty State
  const renderEmptyState = () => (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        borderRadius: 2,
        backgroundColor: 'background.default'
      }}
    >
      <Box sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}>
        👥
      </Box>
      <Typography variant="h5" gutterBottom color="text.secondary">
        No Users Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {filters.search || filters.role !== 'all' || filters.status !== 'all'
          ? 'Try adjusting your search or filters'
          : 'No users have been registered yet'}
      </Typography>
      {canAddUsers && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddUser}
          sx={{ mt: 2 }}
        >
          Add First User
        </Button>
      )}
    </Paper>
  );

  // Stats Cards
  const renderStats = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {userStats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Users
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="error">
              {userStats.admins}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Admins
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning">
              {userStats.moderators}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Moderators
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success">
              {userStats.pakars}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pakars
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="info">
              {userStats.regularUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Regular Users
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {userStats.activeUsers}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  // Filters Component
  const renderFilters = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        {/* Search */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name, email..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: filters.search && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => handleSearch('')}
                    edge="end"
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Role Filter */}
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={filters.role}
              label="Role"
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
              <MenuItem value="pakar">Pakar</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Status Filter */}
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort By */}
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="createdAt">Created Date</MenuItem>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
              <MenuItem value="role">Role</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort Order */}
        <Grid item xs={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Order</InputLabel>
            <Select
              value={filters.sortOrder}
              label="Order"
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} md={2}>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                color="primary"
              >
                <Refresh />
              </IconButton>
            </Tooltip>

            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              disabled={!Object.values(filters).some(val => val !== 'all' && val !== '' && val !== 'createdAt' && val !== 'desc')}
            >
              Clear
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );

  // Header Component
  const renderHeader = () => (
    <Box sx={{ mb: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" href="/" underline="hover">
          Home
        </Link>
        <Typography color="text.primary">User Management</Typography>
      </Breadcrumbs>

      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Group color="primary" />
              User Management
            </Box>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage user accounts, roles, and permissions
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          {canAddUsers && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddUser}
            >
              Add User
            </Button>
          )}

          <Tooltip title="Refresh Data">
            <IconButton
              onClick={handleRefresh}
              disabled={refreshing}
              color="primary"
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  /**
   * =====================================================
   * Main Render
   * =====================================================
   */
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      {renderHeader()}

      {/* Stats */}
      {!loading && !error && users.length > 0 && renderStats()}

      {/* Filters */}
      {renderFilters()}

      {/* Loading State */}
      {loading && !refreshing && renderLoading()}

      {/* Error State */}
      {error && renderError()}

      {/* Empty State */}
      {!loading && !error && filteredUsers.length === 0 && renderEmptyState()}

      {/* Users Table */}
      {!loading && !error && filteredUsers.length > 0 && (
        <Fade in={true}>
          <Box>
            <Paper sx={{ overflow: 'hidden' }}>
              <UserTable
                users={filteredUsers}
                onEdit={canEditUsers ? handleEditUser : null}
                onDelete={canDeleteUsers ? handleOpenDeleteDialog : null}
                onView={handleViewUser}
                onUpdateRole={canEditUsers ? onUpdateRole : null}
                currentUserRole={userRole}
                currentUserId={currentUser?.id}
              />
            </Paper>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}

            {/* Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredUsers.length} of {pagination.totalItems} users
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Page {pagination.page} of {pagination.totalPages}
              </Typography>
            </Box>
          </Box>
        </Fade>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Warning color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Delete User
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'error.main' }}>
              {deleteDialog.userName?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {deleteDialog.userName || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {deleteDialog.userEmail}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" paragraph>
            Are you sure you want to permanently delete this user?
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. All user data, discussions, and contributions will be permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            startIcon={<Delete />}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialog.open}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Edit User
        </DialogTitle>
        <DialogContent>
          {editDialog.userData && (
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  src={editDialog.userData.avatar}
                  sx={{ width: 60, height: 60 }}
                >
                  {editDialog.userData.name?.charAt(0) || editDialog.userData.email?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{editDialog.userData.name || 'No Name'}</Typography>
                  <Typography variant="body2" color="text.secondary">{editDialog.userData.email}</Typography>
                </Box>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editDialog.userData.role || 'user'}
                  label="Role"
                  onChange={(e) => setEditDialog(prev => ({
                    ...prev,
                    userData: { ...prev.userData, role: e.target.value }
                  }))}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="moderator">Moderator</MenuItem>
                  <MenuItem value="pakar">Pakar</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editDialog.userData.isActive ? 'active' : 'inactive'}
                  label="Status"
                  onChange={(e) => setEditDialog(prev => ({
                    ...prev,
                    userData: { ...prev.userData, isActive: e.target.value === 'active' }
                  }))}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="caption" color="text.secondary">
                Created: {new Date(editDialog.userData.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            startIcon={<CheckCircle />}
          >
            Save Changes
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
const UsersPageWithProtection = () => (
  <ProtectedRoute roles={['admin', 'moderator']}>
    <UsersPage />
  </ProtectedRoute>
);

export default UsersPageWithProtection;

// =====================================================
// CATATAN:
// 1. Hanya ADMIN dan MODERATOR yang bisa akses halaman users
// 2. Admin bisa edit/delete user, moderator hanya bisa view
// 3. User table komponen terpisah untuk modularitas
// 4. Fitur search, filter, dan pagination lengkap
// =====================================================
