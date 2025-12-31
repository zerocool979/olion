// LEGACY FILE
// DUPLIKAT dari: src/pages/users/index.js
// ROUTING AKTIF MENGGUNAKAN /users
// File ini dinonaktifkan untuk mencegah ambiguitas routing

export default function UserPage() {
  return null;
}



// // frontend/src/pages/UserPage.js
// 'use client'; // Untuk Next.js 13+
// 
// import React, { useEffect, useState, useCallback, useMemo } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Container,
//   Paper,
//   Typography,
//   Box,
//   Button,
//   TextField,
//   InputAdornment,
//   IconButton,
//   Chip,
//   Alert,
//   LinearProgress,
//   Stack,
//   Grid,
//   Card,
//   CardContent,
//   CardActions,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Tooltip,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Pagination,
//   Breadcrumbs,
//   Link,
//   Divider,
//   Fade,
//   Zoom
// } from '@mui/material';
// import {
//   Refresh,
//   Search,
//   Add,
//   FilterList,
//   Clear,
//   Edit,
//   Delete,
//   Visibility,
//   Person,
//   Shield,
//   VerifiedUser,
//   Group,
//   TrendingUp,
//   Warning,
//   Error as ErrorIcon,
//   CheckCircle,
//   ArrowForward,
//   Sort,
//   MoreVert
// } from '@mui/icons-material';
// import { useAuth } from '../context/AuthContext';
// import { listUsers, deleteUser } from '../api/user';
// import UserTable from '../components/UserTable';
// import { useRouter } from 'next/router'; // Untuk Pages Router
// // import { useRouter } from 'next/navigation'; // Untuk App Router
// // Import ProtectedRoute untuk role-based access control
// import ProtectedRoute from '../components/ProtectedRoute';
// 
// /**
//  * =====================================================
//  * UserPage - Enhanced Version with ProtectedRoute
//  * -----------------------------------------------------
//  * User management page with role-based access,
//  * pagination, search, filtering, and modern UI
//  * =====================================================
//  */
// 
// const UserPage = () => {
//   const { user: currentUser } = useAuth();
//   const router = useRouter();
// 
//   // State management
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);
// 
//   // Pagination state
//   const [pagination, setPagination] = useState({
//     page: 1,
//     totalPages: 1,
//     totalItems: 0,
//     itemsPerPage: 10
//   });
// 
//   // Filter and search state
//   const [filters, setFilters] = useState({
//     search: '',
//     role: 'all',
//     status: 'all',
//     sortBy: 'createdAt',
//     sortOrder: 'desc'
//   });
// 
//   // UI state
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });
//   const [deleteDialog, setDeleteDialog] = useState({
//     open: false,
//     userId: null,
//     userName: ''
//   });
// 
//   // Role-based permissions
//   const userRole = currentUser?.role || 'user';
//   const isAdmin = userRole === 'admin';
//   const isModerator = userRole === 'moderator' || isAdmin;
//   const canEditUsers = isAdmin || isModerator;
//   const canDeleteUsers = isAdmin; // Only admin can delete users
//   const canAddUsers = isAdmin; // Only admin can add users
// 
//   /**
//    * =====================================================
//    * Data Fetching
//    * =====================================================
//    */
//   const fetchUsers = useCallback(async (page = 1, filterParams = {}) => {
//     const controller = new AbortController();
// 
//     try {
//       setLoading(true);
//       setError(null);
// 
//       // Prepare query parameters
//       const queryParams = {
//         page: page.toString(),
//         limit: pagination.itemsPerPage.toString(),
//         ...filterParams
//       };
// 
//       // Remove 'all' filters
//       Object.keys(queryParams).forEach(key => {
//         if (queryParams[key] === 'all') {
//           delete queryParams[key];
//         }
//       });
// 
//       const response = await listUsers(queryParams, controller.signal);
// 
//       // Handle response based on your API structure
//       if (response.data && Array.isArray(response.data)) {
//         setUsers(response.data);
//         // If your API returns pagination info
//         if (response.pagination) {
//           setPagination(prev => ({
//             ...prev,
//             page: response.pagination.page || page,
//             totalPages: response.pagination.totalPages || 1,
//             totalItems: response.pagination.totalItems || response.data.length
//           }));
//         }
//       } else {
//         // Handle array response directly
//         setUsers(response);
//         setPagination(prev => ({
//           ...prev,
//           page,
//           totalItems: response.length
//         }));
//       }
// 
//     } catch (err) {
//       // Handle abort errors
//       if (err.name === 'AbortError') {
//         console.log('Fetch aborted');
//         return;
//       }
// 
//       console.error('Error fetching users:', err);
//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         'Failed to load users. Please try again.'
//       );
// 
//       setSnackbar({
//         open: true,
//         message: 'Failed to load users',
//         severity: 'error'
//       });
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
// 
//     return () => controller.abort();
//   }, [pagination.itemsPerPage]);
// 
//   /**
//    * =====================================================
//    * Effects
//    * =====================================================
//    */
//   useEffect(() => {
//     fetchUsers(pagination.page, filters);
//   }, [fetchUsers, pagination.page, filters]);
// 
//   /**
//    * =====================================================
//    * Event Handlers
//    * =====================================================
//    */
//   const handleSearch = useCallback((value) => {
//     setFilters(prev => ({ ...prev, search: value }));
//     setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
//   }, []);
// 
//   const handleFilterChange = useCallback((key, value) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
//   }, []);
// 
//   const handleClearFilters = useCallback(() => {
//     setFilters({
//       search: '',
//       role: 'all',
//       status: 'all',
//       sortBy: 'createdAt',
//       sortOrder: 'desc'
//     });
//     setPagination(prev => ({ ...prev, page: 1 }));
//   }, []);
// 
//   const handlePageChange = useCallback((event, page) => {
//     setPagination(prev => ({ ...prev, page }));
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);
// 
//   const handleRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchUsers(pagination.page, filters);
//   }, [fetchUsers, pagination.page, filters]);
// 
//   const handleAddUser = useCallback(() => {
//     router.push('/users/create');
//   }, [router]);
// 
//   const handleEditUser = useCallback((userId) => {
//     router.push(`/users/${userId}/edit`);
//   }, [router]);
// 
//   const handleViewUser = useCallback((userId) => {
//     router.push(`/users/${userId}`);
//   }, [router]);
// 
//   const handleOpenDeleteDialog = useCallback((userId, userName) => {
//     setDeleteDialog({
//       open: true,
//       userId,
//       userName
//     });
//   }, []);
// 
//   const handleCloseDeleteDialog = useCallback(() => {
//     setDeleteDialog({
//       open: false,
//       userId: null,
//       userName: ''
//     });
//   }, []);
// 
//   const handleDeleteUser = useCallback(async () => {
//     if (!deleteDialog.userId) return;
// 
//     // Prevent user from deleting themselves
//     if (deleteDialog.userId === currentUser?.id) {
//       setSnackbar({
//         open: true,
//         message: 'You cannot delete your own account',
//         severity: 'error'
//       });
//       handleCloseDeleteDialog();
//       return;
//     }
// 
//     try {
//       await deleteUser(deleteDialog.userId);
// 
//       setSnackbar({
//         open: true,
//         message: `User "${deleteDialog.userName}" has been deleted successfully`,
//         severity: 'success'
//       });
// 
//       // Refresh user list
//       fetchUsers(pagination.page, filters);
// 
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setSnackbar({
//         open: true,
//         message: err.response?.data?.message || 'Failed to delete user',
//         severity: 'error'
//       });
//     } finally {
//       handleCloseDeleteDialog();
//     }
//   }, [deleteDialog, fetchUsers, pagination.page, filters, handleCloseDeleteDialog, currentUser]);
// 
//   const handleCloseSnackbar = useCallback(() => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   }, []);
// 
//   /**
//    * =====================================================
//    * Memoized Values
//    * =====================================================
//    */
//   const filteredUsers = useMemo(() => {
//     return users.filter(user => {
//       // Search filter
//       if (filters.search) {
//         const searchLower = filters.search.toLowerCase();
//         const matchesSearch =
//           user.name?.toLowerCase().includes(searchLower) ||
//           user.email?.toLowerCase().includes(searchLower) ||
//           user.username?.toLowerCase().includes(searchLower);
//         if (!matchesSearch) return false;
//       }
// 
//       // Role filter
//       if (filters.role !== 'all' && user.role !== filters.role) {
//         return false;
//       }
// 
//       // Status filter (example: active/inactive)
//       if (filters.status !== 'all') {
//         // Adapt this based on your user model
//         const isActive = user.isActive !== false;
//         if (filters.status === 'active' && !isActive) return false;
//         if (filters.status === 'inactive' && isActive) return false;
//       }
// 
//       return true;
//     });
//   }, [users, filters]);
// 
//   const userStats = useMemo(() => {
//     const total = users.length;
//     const admins = users.filter(u => u.role === 'admin').length;
//     const moderators = users.filter(u => u.role === 'moderator').length;
//     const pakars = users.filter(u => u.role === 'pakar').length;
//     const regularUsers = users.filter(u => u.role === 'user').length;
//     const activeUsers = users.filter(u => u.isActive !== false).length;
// 
//     return { total, admins, moderators, pakars, regularUsers, activeUsers };
//   }, [users]);
// 
//   /**
//    * =====================================================
//    * Render Components
//    * =====================================================
//    */
// 
//   // Loading State
//   const renderLoading = () => (
//     <Box sx={{ width: '100%', py: 4 }}>
//       <LinearProgress />
//       <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
//         Loading users...
//       </Typography>
//     </Box>
//   );
// 
//   // Error State
//   const renderError = () => (
//     <Alert
//       severity="error"
//       action={
//         <Button color="inherit" size="small" onClick={handleRefresh}>
//           Retry
//         </Button>
//       }
//       sx={{ mb: 3 }}
//     >
//       <Typography variant="body1" fontWeight="medium">
//         {error}
//       </Typography>
//       <Typography variant="body2">
//         Please check your connection and try again.
//       </Typography>
//     </Alert>
//   );
// 
//   // Empty State
//   const renderEmptyState = () => (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 6,
//         textAlign: 'center',
//         borderRadius: 2,
//         backgroundColor: 'background.default'
//       }}
//     >
//       <Box sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}>
//         👥
//       </Box>
//       <Typography variant="h5" gutterBottom color="text.secondary">
//         No Users Found
//       </Typography>
//       <Typography variant="body1" color="text.secondary" paragraph>
//         {filters.search || filters.role !== 'all' || filters.status !== 'all'
//           ? 'Try adjusting your search or filters'
//           : 'No users have been registered yet'}
//       </Typography>
//       {canAddUsers && (
//         <Button
//           variant="contained"
//           startIcon={<Add />}
//           onClick={handleAddUser}
//           sx={{ mt: 2 }}
//         >
//           Add First User
//         </Button>
//       )}
//     </Paper>
//   );
// 
//   // Stats Cards
//   const renderStats = () => (
//     <Grid container spacing={2} sx={{ mb: 3 }}>
//       <Grid item xs={6} sm={4} md={2}>
//         <Card>
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" color="primary">
//               {userStats.total}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Total Users
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
//       <Grid item xs={6} sm={4} md={2}>
//         <Card>
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" color="error">
//               {userStats.admins}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Admins
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
//       <Grid item xs={6} sm={4} md={2}>
//         <Card>
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" color="warning">
//               {userStats.moderators}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Moderators
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
//       <Grid item xs={6} sm={4} md={2}>
//         <Card>
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" color="success">
//               {userStats.pakars}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Pakars
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
//       <Grid item xs={6} sm={4} md={2}>
//         <Card>
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" color="info">
//               {userStats.regularUsers}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Regular Users
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
//       <Grid item xs={6} sm={4} md={2}>
//         <Card>
//           <CardContent sx={{ textAlign: 'center' }}>
//             <Typography variant="h4" color="primary">
//               {userStats.activeUsers}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               Active
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// 
//   // Filters Component
//   const renderFilters = () => (
//     <Paper sx={{ p: 3, mb: 3 }}>
//       <Grid container spacing={2} alignItems="center">
//         {/* Search */}
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             placeholder="Search users by name, email..."
//             value={filters.search}
//             onChange={(e) => handleSearch(e.target.value)}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <Search />
//                 </InputAdornment>
//               ),
//               endAdornment: filters.search && (
//                 <InputAdornment position="end">
//                   <IconButton
//                     size="small"
//                     onClick={() => handleSearch('')}
//                     edge="end"
//                   >
//                     <Clear />
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Grid>
// 
//         {/* Role Filter */}
//         <Grid item xs={6} md={2}>
//           <FormControl fullWidth>
//             <InputLabel>Role</InputLabel>
//             <Select
//               value={filters.role}
//               label="Role"
//               onChange={(e) => handleFilterChange('role', e.target.value)}
//             >
//               <MenuItem value="all">All Roles</MenuItem>
//               <MenuItem value="admin">Admin</MenuItem>
//               <MenuItem value="moderator">Moderator</MenuItem>
//               <MenuItem value="pakar">Pakar</MenuItem>
//               <MenuItem value="user">User</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
// 
//         {/* Status Filter */}
//         <Grid item xs={6} md={2}>
//           <FormControl fullWidth>
//             <InputLabel>Status</InputLabel>
//             <Select
//               value={filters.status}
//               label="Status"
//               onChange={(e) => handleFilterChange('status', e.target.value)}
//             >
//               <MenuItem value="all">All Status</MenuItem>
//               <MenuItem value="active">Active</MenuItem>
//               <MenuItem value="inactive">Inactive</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
// 
//         {/* Sort By */}
//         <Grid item xs={6} md={2}>
//           <FormControl fullWidth>
//             <InputLabel>Sort By</InputLabel>
//             <Select
//               value={filters.sortBy}
//               label="Sort By"
//               onChange={(e) => handleFilterChange('sortBy', e.target.value)}
//             >
//               <MenuItem value="createdAt">Created Date</MenuItem>
//               <MenuItem value="name">Name</MenuItem>
//               <MenuItem value="email">Email</MenuItem>
//               <MenuItem value="role">Role</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
// 
//         {/* Sort Order */}
//         <Grid item xs={6} md={2}>
//           <FormControl fullWidth>
//             <InputLabel>Order</InputLabel>
//             <Select
//               value={filters.sortOrder}
//               label="Order"
//               onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
//             >
//               <MenuItem value="desc">Descending</MenuItem>
//               <MenuItem value="asc">Ascending</MenuItem>
//             </Select>
//           </FormControl>
//         </Grid>
// 
//         {/* Action Buttons */}
//         <Grid item xs={12} md={2}>
//           <Stack direction="row" spacing={1}>
//             <Tooltip title="Refresh">
//               <IconButton
//                 onClick={handleRefresh}
//                 disabled={refreshing}
//                 color="primary"
//               >
//                 <Refresh />
//               </IconButton>
//             </Tooltip>
// 
//             <Button
//               variant="outlined"
//               startIcon={<Clear />}
//               onClick={handleClearFilters}
//               disabled={!Object.values(filters).some(val => val !== 'all' && val !== '' && val !== 'createdAt' && val !== 'desc')}
//             >
//               Clear
//             </Button>
//           </Stack>
//         </Grid>
//       </Grid>
//     </Paper>
//   );
// 
//   // Header Component
//   const renderHeader = () => (
//     <Box sx={{ mb: 4 }}>
//       <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
//         <Link color="inherit" href="/" underline="hover">
//           Home
//         </Link>
//         <Typography color="text.primary">User Management</Typography>
//       </Breadcrumbs>
// 
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         flexDirection: { xs: 'column', sm: 'row' },
//         gap: 2
//       }}>
//         <Box>
//           <Typography variant="h4" component="h1" gutterBottom>
//             <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//               <Group color="primary" />
//               User Management
//             </Box>
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary">
//             Manage user accounts, roles, and permissions
//           </Typography>
//         </Box>
// 
//         <Stack direction="row" spacing={2}>
//           {canAddUsers && (
//             <Button
//               variant="contained"
//               startIcon={<Add />}
//               onClick={handleAddUser}
//             >
//               Add User
//             </Button>
//           )}
// 
//           <Tooltip title="Refresh Data">
//             <IconButton
//               onClick={handleRefresh}
//               disabled={refreshing}
//               color="primary"
//               sx={{
//                 border: 1,
//                 borderColor: 'divider',
//                 borderRadius: 1
//               }}
//             >
//               <Refresh />
//             </IconButton>
//           </Tooltip>
//         </Stack>
//       </Box>
//     </Box>
//   );
// 
//   /**
//    * =====================================================
//    * Main Render
//    * =====================================================
//    */
//   return (
//     <Container maxWidth="xl" sx={{ py: 4 }}>
//       {/* Header */}
//       {renderHeader()}
// 
//       {/* Stats */}
//       {!loading && !error && users.length > 0 && renderStats()}
// 
//       {/* Filters */}
//       {renderFilters()}
// 
//       {/* Loading State */}
//       {loading && !refreshing && renderLoading()}
// 
//       {/* Error State */}
//       {error && renderError()}
// 
//       {/* Empty State */}
//       {!loading && !error && filteredUsers.length === 0 && renderEmptyState()}
// 
//       {/* Users Table */}
//       {!loading && !error && filteredUsers.length > 0 && (
//         <Fade in={true}>
//           <Box>
//             <Paper sx={{ overflow: 'hidden' }}>
//               <UserTable
//                 users={filteredUsers}
//                 onEdit={canEditUsers ? handleEditUser : null}
//                 onDelete={canDeleteUsers ? handleOpenDeleteDialog : null}
//                 onView={handleViewUser}
//                 currentUserRole={userRole}
//                 currentUserId={currentUser?.id}
//               />
//             </Paper>
// 
//             {/* Pagination */}
//             {pagination.totalPages > 1 && (
//               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
//                 <Pagination
//                   count={pagination.totalPages}
//                   page={pagination.page}
//                   onChange={handlePageChange}
//                   color="primary"
//                   size="large"
//                   showFirstButton
//                   showLastButton
//                 />
//               </Box>
//             )}
// 
//             {/* Summary */}
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
//               <Typography variant="body2" color="text.secondary">
//                 Showing {filteredUsers.length} of {pagination.totalItems} users
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Page {pagination.page} of {pagination.totalPages}
//               </Typography>
//             </Box>
//           </Box>
//         </Fade>
//       )}
// 
//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={deleteDialog.open}
//         onClose={handleCloseDeleteDialog}
//         maxWidth="sm"
//         fullWidth
//       >
//         <DialogTitle>
//           <Warning color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
//           Delete User
//         </DialogTitle>
//         <DialogContent>
//           <Typography>
//             Are you sure you want to delete user <strong>"{deleteDialog.userName}"</strong>?
//           </Typography>
//           <Alert severity="warning" sx={{ mt: 2 }}>
//             This action cannot be undone. All user data will be permanently deleted.
//           </Alert>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDeleteDialog}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDeleteUser}
//             variant="contained"
//             color="error"
//             startIcon={<Delete />}
//           >
//             Delete User
//           </Button>
//         </DialogActions>
//       </Dialog>
// 
//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert
//           onClose={handleCloseSnackbar}
//           severity={snackbar.severity}
//           sx={{ width: '100%' }}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Container>
//   );
// };
// 
// UserPage.propTypes = {
//   // Add any props if needed
// };
// 
// // =====================================================
// // WRAP WITH PROTECTEDROUTE
// // =====================================================
// const UserPageWithProtection = () => {
//   return (
//     <ProtectedRoute roles={['admin', 'moderator']}>
//       <UserPage />
//     </ProtectedRoute>
//   );
// };
// 
// export default UserPageWithProtection;
// 
// /**
//  * =====================================================
//  * IMPLEMENTATION NOTES - UPDATED
//  * =====================================================
//  *
//  * PERUBAHAN YANG DIBUAT:
//  * 1. ✅ Added ProtectedRoute wrapper with roles=['admin', 'moderator']
//  * 2. ✅ Enhanced delete user handler to prevent self-deletion
//  * 3. ✅ Added 'use client' directive for Next.js 13+
//  * 
//  * SECURITY FEATURES:
//  * 1. ✅ Only admin and moderator can access this page
//  * 2. ✅ Only admin can delete users
//  * 3. ✅ Users cannot delete their own accounts
//  * 4. ✅ All API calls are protected with authentication
//  * 5. ✅ Role-based UI elements (buttons shown/hidden based on role)
//  *
//  * USAGE:
//  * - Admin: Can view, edit, delete all users
//  * - Moderator: Can view, edit users (cannot delete)
//  * - Other roles: Cannot access this page (redirected to unauthorized)
//  *
//  * API ENDPOINTS EXPECTED:
//  * 1. GET /users?page=1&limit=10&search=...&role=...&status=...&sortBy=...&sortOrder=...
//  * 2. DELETE /users/:id
//  *
//  * DEPENDENCIES:
//  * npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
//  */
