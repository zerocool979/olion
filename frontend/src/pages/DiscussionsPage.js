// frontend/src/pages/DiscussionsPage.js
'use client'; // Untuk Next.js 13+ App Router

import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Divider,
  Pagination,
  Stack,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Fade,
  Zoom,
  Badge,
  Avatar,
  Rating,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Sort,
  Refresh,
  Delete,
  Edit,
  Flag,
  TrendingUp,
  Comment,
  ThumbUp,
  Visibility,
  AccessTime,
  Person,
  Category,
  ArrowForward,
  Clear,
  MoreVert,
  Whatshot,
  NewReleases,
  Forum,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useRouter } from 'next/router'; // Untuk Pages Router
// import { useRouter } from 'next/navigation'; // Untuk App Router
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { useDiscussions } from '../hooks/useDiscussions';
import ProtectedRoute from '../components/ProtectedRoute';
import DiscussionCard from '../components/DiscussionCard';
import api from '../api/base';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.locale('id');

/**
 * =====================================================
 * Custom Hook: useDiscussions
 * -----------------------------------------------------
 * Memisahkan logic fetching discussions
 * =====================================================
 */

// Jika ingin membuat custom hook terpisah, file: frontend/src/hooks/useDiscussions.js
const useDiscussionsHook = (initialFilters = {}) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchDiscussions = useCallback(async (page = 1, filters = {}) => {
    let abortController = null;

    try {
      abortController = new AbortController();
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...filters
      });

      const response = await api.get(`/discussions?${params}`, {
        signal: abortController.signal
      });

      const { data, pagination } = response.data;

      setDiscussions(data);
      setTotalPages(pagination?.totalPages || 1);
      setTotalItems(pagination?.totalItems || data.length);
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }

      console.error('Error fetching discussions:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Gagal memuat diskusi. Silakan coba lagi.'
      );
    } finally {
      if (!abortController?.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchDiscussions(1, initialFilters);

    return () => {
      // Cleanup bisa dilakukan di sini jika perlu
    };
  }, [fetchDiscussions, initialFilters]);

  const retry = () => {
    fetchDiscussions(1, initialFilters);
  };

  return {
    discussions,
    loading,
    error,
    totalPages,
    totalItems,
    fetchDiscussions,
    retry
  };
};

/**
 * =====================================================
 * Components untuk bagian-bagian UI
 * =====================================================
 */

// Empty State Component
const EmptyState = ({ onCreateDiscussion }) => (
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
      💬
    </Box>
    <Typography variant="h5" gutterBottom color="text.secondary">
      Belum ada diskusi
    </Typography>
    <Typography variant="body1" color="text.secondary" paragraph>
      Jadilah yang pertama memulai diskusi dan berbagi pengetahuan dengan komunitas.
    </Typography>
    <Button
      variant="contained"
      startIcon={<Add />}
      onClick={onCreateDiscussion}
      sx={{ mt: 2 }}
    >
      Buat Diskusi Pertama
    </Button>
  </Paper>
);

EmptyState.propTypes = {
  onCreateDiscussion: PropTypes.func.isRequired,
};

// Error State Component
const ErrorState = ({ error, onRetry }) => (
  <Paper sx={{ p: 4, textAlign: 'center' }}>
    <Alert
      severity="error"
      action={
        <Button color="inherit" size="small" onClick={onRetry}>
          Coba Lagi
        </Button>
      }
      sx={{ mb: 2 }}
    >
      {error}
    </Alert>
    <Typography variant="body2" color="text.secondary">
      Terjadi kesalahan saat memuat diskusi. Pastikan koneksi internet Anda stabil.
    </Typography>
  </Paper>
);

ErrorState.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <Grid container spacing={3}>
    {[...Array(6)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ width: '100%' }}>
                <LinearProgress sx={{ mb: 1 }} />
                <LinearProgress />
              </Box>
            </Box>
            <LinearProgress />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

// Filter Component
const DiscussionFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    const clearedFilters = { search: '' };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onClearFilters();
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
        {/* Search Input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cari diskusi..."
          value={localFilters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: localFilters.search && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => handleChange('search', '')}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Category Filter */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Kategori</InputLabel>
          <Select
            value={localFilters.category || ''}
            label="Kategori"
            onChange={(e) => handleChange('category', e.target.value)}
          >
            <MenuItem value="">Semua Kategori</MenuItem>
            <MenuItem value="pertanian">Pertanian</MenuItem>
            <MenuItem value="peternakan">Peternakan</MenuItem>
            <MenuItem value="perikanan">Perikanan</MenuItem>
            <MenuItem value="teknologi">Teknologi</MenuItem>
            <MenuItem value="umum">Umum</MenuItem>
          </Select>
        </FormControl>

        {/* Sort Options */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Urutkan</InputLabel>
          <Select
            value={localFilters.sort || 'newest'}
            label="Urutkan"
            onChange={(e) => handleChange('sort', e.target.value)}
          >
            <MenuItem value="newest">Terbaru</MenuItem>
            <MenuItem value="oldest">Terlama</MenuItem>
            <MenuItem value="popular">Populer</MenuItem>
            <MenuItem value="trending">Trending</MenuItem>
          </Select>
        </FormControl>

        {/* Toggle Advanced Filters */}
        <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
          <FilterList />
        </IconButton>

        {/* Clear Filters */}
        <Button
          variant="outlined"
          startIcon={<Clear />}
          onClick={handleClear}
          disabled={!Object.keys(localFilters).some(key => localFilters[key])}
        >
          Hapus Filter
        </Button>
      </Box>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Fade in={showAdvanced}>
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Dari Tanggal"
                    value={localFilters.startDate ? dayjs(localFilters.startDate) : null}
                    onChange={(date) => handleChange('startDate', date?.format('YYYY-MM-DD'))}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Sampai Tanggal"
                    value={localFilters.endDate ? dayjs(localFilters.endDate) : null}
                    onChange={(date) => handleChange('endDate', date?.format('YYYY-MM-DD'))}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ToggleButtonGroup
                  value={localFilters.status || 'all'}
                  exclusive
                  onChange={(_, value) => handleChange('status', value)}
                  aria-label="Status"
                >
                  <ToggleButton value="all" aria-label="Semua">
                    Semua
                  </ToggleButton>
                  <ToggleButton value="open" aria-label="Open">
                    Open
                  </ToggleButton>
                  <ToggleButton value="closed" aria-label="Closed">
                    Closed
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <ToggleButtonGroup
                  value={localFilters.type || 'all'}
                  exclusive
                  onChange={(_, value) => handleChange('type', value)}
                  aria-label="Tipe"
                >
                  <ToggleButton value="all" aria-label="Semua">
                    Semua
                  </ToggleButton>
                  <ToggleButton value="question" aria-label="Pertanyaan">
                    Pertanyaan
                  </ToggleButton>
                  <ToggleButton value="discussion" aria-label="Diskusi">
                    Diskusi
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}
    </Paper>
  );
};

DiscussionFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

// Header Component
const DiscussionsHeader = ({ onCreateDiscussion, userRole }) => {
  const router = useRouter();

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;
  const isPakar = userRole === 'pakar';
  const isRegularUser = userRole === 'user';

  return (
    <Box sx={{ mb: 4 }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <Link color="inherit" href="/" underline="hover">
          Home
        </Link>
        <Typography color="text.primary">Diskusi</Typography>
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
              <Forum color="primary" />
              Forum Diskusi
            </Box>
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Temukan jawaban, bagikan pengetahuan, dan diskusikan dengan komunitas
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          {(isAdmin || isModerator) && (
            <Tooltip title="Moderasi Konten">
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Flag />}
                onClick={() => router.push('/admin/content-moderation')}
              >
                Moderasi
              </Button>
            </Tooltip>
          )}

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreateDiscussion}
            sx={{ minWidth: 180 }}
          >
            Buat Diskusi Baru
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

DiscussionsHeader.propTypes = {
  onCreateDiscussion: PropTypes.func.isRequired,
  userRole: PropTypes.string,
};

/**
 * =====================================================
 * Main DiscussionsPage Component
 * =====================================================
 */

const DiscussionsPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'newest',
    status: 'all',
    type: 'all'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Gunakan custom hook untuk fetching
  const {
    discussions,
    loading,
    error,
    totalPages,
    totalItems,
    fetchDiscussions,
    retry
  } = useDiscussionsHook(filters);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      sort: 'newest',
      status: 'all',
      type: 'all'
    });
  }, []);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    fetchDiscussions(value, filters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle create discussion
  const handleCreateDiscussion = () => {
    router.push('/discussions/create');
  };

  // Handle delete discussion (admin/moderator only)
  const handleDeleteDiscussion = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus diskusi ini?')) {
      return;
    }

    try {
      await api.delete(`/discussions/${id}`);
      setSnackbar({
        open: true,
        message: 'Diskusi berhasil dihapus',
        severity: 'success'
      });
      // Refresh discussions
      fetchDiscussions(page, filters);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Gagal menghapus diskusi',
        severity: 'error'
      });
    }
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Role-based permissions
  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;
  const isPakar = userRole === 'pakar';
  const canDelete = isAdmin || isModerator;
  const canEdit = isAdmin || isModerator;

  // Memoize discussions list untuk performance
  const discussionsList = useMemo(() => {
    if (!discussions.length) return null;

    return (
      <Grid container spacing={3}>
        {discussions.map((discussion) => (
          <Grid item xs={12} sm={6} md={4} key={discussion.id}>
            <Zoom in={true} style={{ transitionDelay: '100ms' }}>
              <div>
                <DiscussionCard
                  discussion={discussion}
                  onDelete={canDelete ? () => handleDeleteDiscussion(discussion.id) : null}
                  onEdit={canEdit ? () => router.push(`/discussions/${discussion.id}/edit`) : null}
                  userRole={userRole}
                />
              </div>
            </Zoom>
          </Grid>
        ))}
      </Grid>
    );
  }, [discussions, userRole, canDelete, canEdit, router]);

  // Stats chips
  const statsChips = [
    { label: 'Total Diskusi', value: totalItems, icon: <Forum />, color: 'primary' },
    { label: 'Terbaru', value: discussions.filter(d => dayjs().diff(dayjs(d.createdAt), 'day') < 1).length, icon: <NewReleases />, color: 'secondary' },
    { label: 'Trending', value: discussions.filter(d => d.upvotes > 10).length, icon: <Whatshot />, color: 'warning' },
  ];

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Forum Diskusi - Platform Diskusi Komunitas</title>
        <meta
          name="description"
          content="Temukan dan ikuti diskusi menarik seputar pertanian, peternakan, perikanan, dan teknologi dari komunitas ahli dan praktisi."
        />
        <meta name="keywords" content="diskusi, forum, komunitas, pertanian, peternakan, perikanan, teknologi" />
        <link rel="canonical" href="https://yourdomain.com/discussions" />
      </Head>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <DiscussionsHeader
          onCreateDiscussion={handleCreateDiscussion}
          userRole={userRole}
        />

        {/* Stats Chips */}
        <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
          {statsChips.map((stat, index) => (
            <Chip
              key={index}
              icon={stat.icon}
              label={`${stat.label}: ${stat.value}`}
              color={stat.color}
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          ))}
          <Chip
            icon={<Refresh />}
            label="Refresh"
            onClick={retry}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Stack>

        {/* Filters */}
        <DiscussionFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Main Content */}
        <Box sx={{ position: 'relative', minHeight: 400 }}>
          {/* Loading State */}
          {loading && (
            <Box sx={{ mb: 4 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Memuat diskusi...
              </Typography>
              <LoadingSkeleton />
            </Box>
          )}

          {/* Error State */}
          {!loading && error && (
            <ErrorState error={error} onRetry={retry} />
          )}

          {/* Empty State */}
          {!loading && !error && discussions.length === 0 && (
            <EmptyState onCreateDiscussion={handleCreateDiscussion} />
          )}

          {/* Discussions List */}
          {!loading && !error && discussions.length > 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Menampilkan {discussions.length} dari {totalItems} diskusi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Halaman {page} dari {totalPages}
                </Typography>
              </Box>

              {discussionsList}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    sx={{ '& .MuiPaginationItem-root': { fontSize: '1rem' } }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Quick Actions Footer */}
        <Paper
          elevation={2}
          sx={{
            mt: 4,
            p: 3,
            borderRadius: 2,
            backgroundColor: 'primary.light',
            color: 'primary.contrastText'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Siap berdiskusi?
              </Typography>
              <Typography variant="body2">
                Bergabunglah dengan komunitas dan bagikan pengetahuan Anda. Diskusi yang baik membantu banyak orang.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<Add />}
                onClick={handleCreateDiscussion}
                sx={{
                  bgcolor: 'background.paper',
                  color: 'text.primary',
                  '&:hover': { bgcolor: 'background.default' }
                }}
              >
                Mulai Diskusi Baru
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Help Section */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            💡 Tips Berdiskusi
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  <Box component="span" sx={{ color: 'success.main' }}>✓</Box> Gunakan Bahasa yang Sopan
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sampaikan pendapat dengan bahasa yang baik dan menghargai pendapat lain.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  <Box component="span" sx={{ color: 'success.main' }}>✓</Box> Berikan Informasi Lengkap
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sertakan detail yang relevan untuk mendapatkan jawaban yang tepat.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  <Box component="span" sx={{ color: 'success.main' }}>✓</Box> Cari Sebelum Bertanya
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Gunakan fitur pencarian untuk memeriksa apakah pertanyaan sudah pernah dibahas.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  <Box component="span" sx={{ color: 'success.main' }}>✓</Box> Tag Pakar yang Relevan
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Untuk pertanyaan spesifik, tag pakar yang ahli di bidang tersebut.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

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
    </>
  );
};

DiscussionsPage.propTypes = {
  // Add prop types if needed
};

// =====================================================
// WRAP WITH PROTECTEDROUTE - PERBAIKAN
// =====================================================
const DiscussionsPageWithProtection = () => {
  return (
    <ProtectedRoute roles={['admin', 'moderator', 'pakar', 'user']}>
      <DiscussionsPage />
    </ProtectedRoute>
  );
};

export default DiscussionsPageWithProtection;

/**
 * =====================================================
 * CATATAN IMPLEMENTASI & DEPENDENCIES
 * =====================================================
 *
 * Dependencies yang perlu diinstall:
 * npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
 * npm install @mui/x-date-pickers dayjs
 * npm install prop-types
 *
 * Untuk useDiscussions custom hook (opsional, bisa pisah ke file terpisah):
 * Buat file: frontend/src/hooks/useDiscussions.js
 *
 * Untuk DiscussionCard component yang diperbarui:
 * DiskusiCard perlu menerima props: discussion, onDelete, onEdit, userRole
 *
 * Fitur yang diimplementasi:
 * 1. ✅ Loading spinner dengan LinearProgress
 * 2. ✅ Error handling dengan Alert dan retry button
 * 3. ✅ Custom hook untuk fetching (useDiscussions)
 * 4. ✅ Responsive grid layout
 * 5. ✅ Pagination
 * 6. ✅ Search & advanced filters
 * 7. ✅ Empty state dengan CTA
 * 8. ✅ Breadcrumb navigation
 * 9. ✅ Role-aware actions (admin/moderator bisa delete/edit)
 * 10. ✅ SEO metadata dengan next/head
 * 11. ✅ Performance: memoization, proper keys
 * 12. ✅ Accessibility: semantic HTML, ARIA labels
 * 13. ✅ Modern UI dengan MUI components
 * 14. ✅ Snackbar notifications
 * 15. ✅ Stats display
 * 16. ✅ Help section dengan tips
 * 17. ✅ Smooth animations (Fade, Zoom)
 * 18. ✅ Date picker untuk filter tanggal
 * 19. ✅ Responsive design untuk semua device
 * 20. ✅ Type checking dengan PropTypes
 * 21. ✅ PROTECTED ROUTE dengan role restriction
 *
 * API Endpoint yang diharapkan:
 * GET /discussions?page=1&limit=12&search=...&category=...&sort=...
 * Response: {
 *   data: Discussion[],
 *   pagination: {
 *     page: number,
 *     totalPages: number,
 *     totalItems: number,
 *     limit: number
 *   }
 * }
 *
 * Untuk infinite scroll (alternatif pagination):
 * Bisa implementasi dengan Intersection Observer
 *
 * Untuk virtualisasi list (jika diskusi sangat banyak):
 * Gunakan react-window atau react-virtualized
 */
