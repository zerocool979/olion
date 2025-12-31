// src/pages/pakar/index.js
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { getPakars } from '../../api/pakar';
import PakarCard from '../../components/PakarCard';
import { useAuth } from '../../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  LinearProgress,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Pagination,
  Breadcrumbs,
  Link,
  Divider,
  Avatar,
  Rating
} from '@mui/material';
import {
  Search,
  FilterList,
  VerifiedUser,
  Person,
  Category,
  TrendingUp,
  Clear,
  Refresh,
  Sort,
  ArrowForward,
  School,
  Work,
  LocationOn,
  Email,
  Phone
} from '@mui/icons-material';

/**
 * =====================================================
 * Pakar Page - Enhanced Version
 * -----------------------------------------------------
 * Menampilkan daftar pakar dengan fitur lengkap:
 * - Search & Filter
 * - Pagination
 * - Role-aware actions
 * - Modern UI dengan Material-UI
 * - Loading & Error handling yang baik
 * =====================================================
 */

const PakarPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [pakars, setPakars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    specialization: 'all',
    sortBy: 'rating',
    sortOrder: 'desc',
    status: 'all'
  });

  // UI state
  const [showFilters, setShowFilters] = useState(false);

  // Role-based permissions
  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;
  const canManagePakars = isAdmin || isModerator;

  /**
   * Fetch pakar data dengan filters
   */
  const fetchPakars = useCallback(async (page = 1, filterParams = {}) => {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const params = {
        page: page.toString(),
        limit: pagination.itemsPerPage.toString(),
        ...filterParams
      };

      // Remove 'all' filters
      Object.keys(params).forEach(key => {
        if (params[key] === 'all') {
          delete params[key];
        }
      });

      const res = await getPakars(params, controller.signal);

      // Handle response based on your API structure
      if (res.data && Array.isArray(res.data)) {
        setPakars(res.data);
        if (res.pagination) {
          setPagination({
            page: res.pagination.page || page,
            totalPages: res.pagination.totalPages || 1,
            totalItems: res.pagination.totalItems || res.data.length,
            itemsPerPage: pagination.itemsPerPage
          });
        }
      } else {
        // Fallback for direct array response
        setPakars(res || []);
      }

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }

      console.error('Error fetching pakars:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Gagal memuat data pakar'
      );
      setPakars([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }

    return () => controller.abort();
  }, [pagination.itemsPerPage]);

  useEffect(() => {
    fetchPakars(pagination.page, filters);
  }, [fetchPakars, pagination.page, filters]);

  /**
   * Event Handlers
   */
  const handleSearch = useCallback((value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      specialization: 'all',
      sortBy: 'rating',
      sortOrder: 'desc',
      status: 'all'
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handlePageChange = useCallback((event, page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPakars(pagination.page, filters);
  }, [fetchPakars, pagination.page, filters]);

  const handleViewProfile = useCallback((pakarId) => {
    router.push(`/pakars/${pakarId}`);
  }, [router]);

  const handleApprovePakar = useCallback((pakarId) => {
    if (canManagePakars) {
      router.push(`/admin/expert-approval?userId=${pakarId}`);
    }
  }, [canManagePakars, router]);

  /**
   * Loading State
   */
  const renderLoading = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <LinearProgress />
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        Memuat data pakar...
      </Typography>
    </Container>
  );

  /**
   * Error State
   */
  const renderError = () => (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={handleRefresh}>
            Coba Lagi
          </Button>
        }
      >
        {error}
      </Alert>
    </Container>
  );

  /**
   * Empty State
   */
  const renderEmptyState = () => (
    <Paper sx={{ p: 6, textAlign: 'center' }}>
      <Box sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}>
        👨‍🔬
      </Box>
      <Typography variant="h5" gutterBottom color="text.secondary">
        Tidak ada pakar ditemukan
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {filters.search || filters.specialization !== 'all'
          ? 'Coba sesuaikan pencarian atau filter Anda'
          : 'Belum ada pakar yang terdaftar di sistem'}
      </Typography>
      {canManagePakars && (
        <Button
          variant="outlined"
          startIcon={<VerifiedUser />}
          onClick={() => router.push('/admin/expert-approval')}
          sx={{ mt: 2 }}
        >
          Lihat Permintaan Pakar
        </Button>
      )}
    </Paper>
  );

  /**
   * Stats Cards
   */
  const renderStats = () => {
    const total = pakars.length;
    const verified = pakars.filter(p => p.isVerified).length;
    const active = pakars.filter(p => p.status === 'active').length;
    const averageRating = pakars.length > 0
      ? (pakars.reduce((sum, p) => sum + (p.rating || 0), 0) / pakars.length).toFixed(1)
      : '0.0';

    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Pakar
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success">
                {verified}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Terverifikasi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info">
                {active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aktif
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning">
                {averageRating}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rating Rata-rata
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  /**
   * Filters Component
   */
  const renderFilters = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
        {/* Search Input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Cari pakar berdasarkan nama atau spesialisasi..."
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
                <IconButton size="small" onClick={() => handleSearch('')}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Specialization Filter */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Spesialisasi</InputLabel>
          <Select
            value={filters.specialization}
            label="Spesialisasi"
            onChange={(e) => handleFilterChange('specialization', e.target.value)}
          >
            <MenuItem value="all">Semua Spesialisasi</MenuItem>
            <MenuItem value="pertanian">Pertanian</MenuItem>
            <MenuItem value="peternakan">Peternakan</MenuItem>
            <MenuItem value="perikanan">Perikanan</MenuItem>
            <MenuItem value="hortikultura">Hortikultura</MenuItem>
            <MenuItem value="teknologi">Teknologi Pertanian</MenuItem>
          </Select>
        </FormControl>

        {/* Sort Options */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Urutkan</InputLabel>
          <Select
            value={filters.sortBy}
            label="Urutkan"
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <MenuItem value="rating">Rating Tertinggi</MenuItem>
            <MenuItem value="name">Nama A-Z</MenuItem>
            <MenuItem value="experience">Pengalaman</MenuItem>
            <MenuItem value="createdAt">Terbaru</MenuItem>
          </Select>
        </FormControl>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <Refresh />
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Sembunyikan' : 'Filter'}
          </Button>

          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            disabled={!Object.values(filters).some(val => val !== 'all' && val !== '' && val !== 'rating' && val !== 'desc')}
          >
            Hapus Filter
          </Button>
        </Stack>
      </Box>

      {/* Advanced Filters */}
      {showFilters && (
        <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="all">Semua Status</MenuItem>
                  <MenuItem value="active">Aktif</MenuItem>
                  <MenuItem value="inactive">Tidak Aktif</MenuItem>
                  <MenuItem value="verified">Terverifikasi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
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
          </Grid>
        </Box>
      )}
    </Paper>
  );

  /**
   * Main Content
   */
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="inherit" href="/" underline="hover">
            Home
          </Link>
          <Typography color="text.primary">Pakar</Typography>
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
                <VerifiedUser color="primary" />
                Daftar Pakar
              </Box>
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Temukan ahli dan konsultan untuk menjawab pertanyaan Anda
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>
            {canManagePakars && (
              <Button
                variant="outlined"
                startIcon={<VerifiedUser />}
                onClick={() => router.push('/admin/expert-approval')}
              >
                Kelola Pakar
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Stats */}
      {!loading && !error && pakars.length > 0 && renderStats()}

      {/* Filters */}
      {renderFilters()}

      {/* Loading State */}
      {loading && renderLoading()}

      {/* Error State */}
      {error && renderError()}

      {/* Empty State */}
      {!loading && !error && pakars.length === 0 && renderEmptyState()}

      {/* Pakar List */}
      {!loading && !error && pakars.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Menampilkan {pakars.length} dari {pagination.totalItems} pakar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Halaman {pagination.page} dari {pagination.totalPages}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {pakars.map((pakar) => (
              <Grid item xs={12} sm={6} md={4} key={pakar.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => handleViewProfile(pakar.id)}
                >
                  {/* Header with Avatar and Name */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      src={pakar.avatar}
                      sx={{ width: 60, height: 60 }}
                    >
                      {pakar.name?.charAt(0) || 'P'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="medium">
                        {pakar.name || 'Nama tidak tersedia'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        {pakar.isVerified && (
                          <Chip
                            icon={<VerifiedUser />}
                            label="Terverifikasi"
                            color="success"
                            size="small"
                          />
                        )}
                        <Chip
                          label={pakar.specialization || 'Umum'}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>

                  {/* Rating and Experience */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={pakar.rating || 0} precision={0.5} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        ({pakar.reviewCount || 0})
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      <Work fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      {pakar.experience || 0} tahun
                    </Typography>
                  </Box>

                  {/* Bio/Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      flexGrow: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {pakar.bio || 'Tidak ada deskripsi tersedia'}
                  </Typography>

                  {/* Stats */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: 1,
                    borderColor: 'divider',
                    pt: 2,
                    mb: 2
                  }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="primary">
                        {pakar.answerCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Jawaban
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="success">
                        {pakar.solvedCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Terpecahkan
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" color="warning">
                        {pakar.successRate || 0}%
                      </Typography>
                      <Typography variant="caption" color="text-secondary">
                        Success Rate
                      </Typography>
                    </Box>
                  </Box>

                  {/* Action Button */}
                  <Button
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowForward />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProfile(pakar.id);
                    }}
                  >
                    Lihat Profil
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
        </>
      )}

      {/* Call to Action */}
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
              Ingin menjadi pakar?
            </Typography>
            <Typography variant="body2">
              Bergabunglah sebagai pakar dan bagikan pengetahuan Anda. Bantu komunitas dengan menjawab pertanyaan mereka.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<VerifiedUser />}
              onClick={() => router.push('/become-expert')}
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                '&:hover': { bgcolor: 'background.default' }
              }}
            >
              Ajukan Sebagai Pakar
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

// =====================================================
// FINAL IMPLEMENTATION - WRAP WITH PROTECTEDROUTE
// =====================================================
// NOTE: Halaman pakar bisa diakses oleh semua role yang sudah login
// Perubahan: Semua role (admin, moderator, pakar, user) bisa akses
const PakarPageWithProtection = () => {
  return (
    <ProtectedRoute>
      <PakarPage />
    </ProtectedRoute>
  );
};

export default PakarPageWithProtection;

// =====================================================
// CATATAN:
// 1. Semua user yang sudah login bisa akses halaman pakar
// 2. Admin dan Moderator bisa melihat button "Kelola Pakar"
// 3. Fitur search, filter, dan pagination sudah lengkap
// 4. ProtectedRoute menangani auth tanpa spesifik role
// =====================================================
