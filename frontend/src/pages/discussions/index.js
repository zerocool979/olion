// src/pages/discussions/index.js

'use client'; // Directive untuk Next.js 13+

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/base';
import ProtectedRoute from '../../components/ProtectedRoute';

// Import MUI components untuk UI yang lebih baik
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
  Pagination,
  Stack,
  Breadcrumbs,
  Link as MuiLink,
  Divider,
  Fade,
  Zoom,
  Badge,
  Avatar
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  Sort,
  Refresh,
  TrendingUp,
  Comment,
  ThumbUp,
  Visibility,
  AccessTime,
  Person,
  Category,
  ArrowForward,
  Clear,
  Whatshot,
  NewReleases,
  Forum
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

export default function DiscussionsPage() {
  return (
    <ProtectedRoute>
      <DiscussionsContent />
    </ProtectedRoute>
  );
}

function DiscussionsContent() {
  const { user } = useAuth();
  const router = useRouter();

  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // State untuk pagination
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // State untuk filter dan search
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'newest',
    status: 'all',
    author: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch discussions dengan filter
  const fetchDiscussions = useCallback(async (page = 1, filterParams = {}) => {
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

      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === 'all') {
          delete queryParams[key];
        }
      });

      const response = await api.get('/discussions', {
        params: queryParams,
        signal: controller.signal
      });

      // Handle response
      if (response.data) {
        // Jika API mengembalikan pagination
        if (response.data.pagination) {
          setDiscussions(response.data.data || []);
          setPagination(prev => ({
            ...prev,
            page: response.data.pagination.page || page,
            totalPages: response.data.pagination.totalPages || 1,
            totalItems: response.data.pagination.totalItems || 0
          }));
        } else {
          // Jika hanya array biasa
          setDiscussions(response.data || []);
          setPagination(prev => ({
            ...prev,
            page,
            totalItems: response.data?.length || 0
          }));
        }
      }

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
      setLoading(false);
      setRefreshing(false);
    }

    return () => controller.abort();
  }, [pagination.itemsPerPage]);

  // Initial load
  useEffect(() => {
    fetchDiscussions(pagination.page, filters);
  }, [fetchDiscussions, pagination.page]);

  // Handlers
  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      sort: 'newest',
      status: 'all',
      author: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDiscussions(pagination.page, filters);
  };

  const handleCreateDiscussion = () => {
    router.push('/discussions/create');
  };

  // Role-based permissions
  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;
  const isPakar = userRole === 'pakar';
  const canCreateDiscussion = true; // Semua user bisa buat diskusi

  // Stats
  const stats = useMemo(() => {
    const total = discussions.length;
    const trending = discussions.filter(d => d.upvotes > 10).length;
    const newToday = discussions.filter(d =>
      dayjs(d.createdAt).isSame(dayjs(), 'day')
    ).length;
    const withExpertAnswer = discussions.filter(d => d.hasExpertAnswer).length;

    return { total, trending, newToday, withExpertAnswer };
  }, [discussions]);

  // Loading State
  if (loading && !refreshing) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Memuat diskusi...
        </Typography>
      </Container>
    );
  }

  // Error State
  if (error && !discussions.length) {
    return (
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
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink component={Link} href="/" color="inherit" underline="hover">
            Home
          </MuiLink>
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
            {canCreateDiscussion && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateDiscussion}
                sx={{ minWidth: 180 }}
              >
                Buat Diskusi Baru
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Stats Chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <Chip
          icon={<Forum />}
          label={`Total: ${stats.total}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<NewReleases />}
          label={`Baru Hari Ini: ${stats.newToday}`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          icon={<Whatshot />}
          label={`Trending: ${stats.trending}`}
          color="warning"
          variant="outlined"
        />
        <Chip
          icon={<TrendingUp />}
          label={`Jawaban Pakar: ${stats.withExpertAnswer}`}
          color="success"
          variant="outlined"
        />
        <Tooltip title="Refresh">
          <Chip
            icon={<Refresh />}
            label="Refresh"
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outlined"
          />
        </Tooltip>
      </Stack>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          {/* Search */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Cari diskusi..."
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

          {/* Category Filter */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={filters.category}
              label="Kategori"
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="">Semua Kategori</MenuItem>
              <MenuItem value="pertanian">Pertanian</MenuItem>
              <MenuItem value="peternakan">Peternakan</MenuItem>
              <MenuItem value="perikanan">Perikanan</MenuItem>
              <MenuItem value="teknologi">Teknologi</MenuItem>
              <MenuItem value="umum">Umum</MenuItem>
            </Select>
          </FormControl>

          {/* Sort */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Urutkan</InputLabel>
            <Select
              value={filters.sort}
              label="Urutkan"
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <MenuItem value="newest">Terbaru</MenuItem>
              <MenuItem value="oldest">Terlama</MenuItem>
              <MenuItem value="popular">Populer</MenuItem>
              <MenuItem value="trending">Trending</MenuItem>
            </Select>
          </FormControl>

          {/* Advanced Filters Toggle */}
          <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
            <FilterList />
          </IconButton>

          {/* Clear Filters */}
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            disabled={!Object.values(filters).some(val => val && val !== 'newest' && val !== 'all')}
          >
            Hapus Filter
          </Button>
        </Box>

        {/* Advanced Filters */}
        {showAdvanced && (
          <Fade in={showAdvanced}>
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Dari Tanggal"
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="all">Semua Status</MenuItem>
                      <MenuItem value="open">Open</MenuItem>
                      <MenuItem value="closed">Closed</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}
      </Paper>

      {/* Error Alert */}
      {error && discussions.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && discussions.length === 0 && (
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
            {filters.search || filters.category
              ? 'Tidak ada diskusi yang cocok dengan filter Anda'
              : 'Jadilah yang pertama memulai diskusi dan berbagi pengetahuan'}
          </Typography>
          {canCreateDiscussion && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateDiscussion}
              sx={{ mt: 2 }}
            >
              Buat Diskusi Pertama
            </Button>
          )}
        </Paper>
      )}

      {/* Discussions List */}
      {discussions.length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Menampilkan {discussions.length} dari {pagination.totalItems} diskusi
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Halaman {pagination.page} dari {pagination.totalPages}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {discussions.map((discussion) => (
              <Grid item xs={12} sm={6} md={4} key={discussion.id}>
                <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                  <Card
                    sx={{
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
                    onClick={() => router.push(`/discussions/${discussion.id}`)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Status Badges */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          {discussion.isClosed && (
                            <Chip label="Tertutup" size="small" color="error" variant="outlined" sx={{ mr: 1 }} />
                          )}
                          {discussion.hasExpertAnswer && (
                            <Chip label="Jawaban Pakar" size="small" color="success" variant="outlined" />
                          )}
                        </Box>
                        {discussion.isTrending && (
                          <Whatshot color="warning" />
                        )}
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {discussion.title}
                      </Typography>

                      {/* Content Preview */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {discussion.content}
                      </Typography>

                      {/* Metadata */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        {/* Category */}
                        {discussion.category && (
                          <Chip
                            icon={<Category />}
                            label={discussion.category}
                            size="small"
                            variant="outlined"
                          />
                        )}

                        {/* Author */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Person fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {discussion.author?.name || discussion.author?.pseudonym || 'Anonim'}
                          </Typography>
                        </Box>

                        {/* Time */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {dayjs(discussion.createdAt).fromNow()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>

                    {/* Stats Footer */}
                    <CardActions sx={{
                      justifyContent: 'space-between',
                      borderTop: 1,
                      borderColor: 'divider',
                      pt: 1
                    }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* Comments */}
                        <Tooltip title="Jumlah Komentar">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Comment fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {discussion.commentCount || 0}
                            </Typography>
                          </Box>
                        </Tooltip>

                        {/* Upvotes */}
                        <Tooltip title="Upvotes">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <ThumbUp fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {discussion.upvotes || 0}
                            </Typography>
                          </Box>
                        </Tooltip>

                        {/* Views */}
                        <Tooltip title="Dilihat">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Visibility fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {discussion.views || 0}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Box>

                      {/* Expert Badge */}
                      {discussion.author?.role === 'pakar' && (
                        <Chip
                          label="Pakar"
                          size="small"
                          color="success"
                          variant="filled"
                          sx={{ height: 24 }}
                        />
                      )}
                    </CardActions>
                  </Card>
                </Zoom>
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

      {/* Quick Actions Footer */}
      {canCreateDiscussion && (
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
                Punya pertanyaan atau ide?
              </Typography>
              <Typography variant="body2">
                Mulai diskusi baru dan dapatkan jawaban dari komunitas dan pakar kami.
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
      )}
    </Container>
  );
}

// =====================================================
// CATATAN:
// 1. Halaman diskusi bisa diakses semua user yang login
// 2. ProtectedRoute menangani auth tanpa spesifik role
// 3. Fitur search, filter, dan pagination sudah lengkap
// 4. Semua user bisa membuat diskusi baru
// =====================================================
