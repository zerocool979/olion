// src/pages/discussions/index.js

'use client'; // Directive untuk Next.js 13+

import { useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/base';
import ProtectedRoute from '../../components/ProtectedRoute';

import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from '../../utils/dayjs';
dayjs.extend(relativeTime);

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
  Zoom
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

// 🔧 UTILITY FUNCTIONS untuk safety
const normalizeValue = (value) => {
  // Handle semua kemungkinan type
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') {
    // Priority: name > title > label > id > first string property
    if (value.name && typeof value.name === 'string') return value.name;
    if (value.title && typeof value.title === 'string') return value.title;
    if (value.label && typeof value.label === 'string') return value.label;
    if (value.id) return value.id.toString();
    // Try to find any string property
    const stringValues = Object.values(value).filter(v => typeof v === 'string');
    if (stringValues.length > 0) return stringValues[0];
    // Fallback ke string kosong
    return '';
  }
  return String(value);
};

const normalizeCategory = (category) => {
  return normalizeValue(category);
};

const normalizeAuthor = (author) => {
  const normalized = normalizeValue(author);
  return normalized || 'Anonim';
};

// 🔧 HOOK untuk safe state management
const useSafeFilters = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);
  
  const safeSetFilters = useCallback((updater) => {
    setFilters(prev => {
      const newFilters = typeof updater === 'function' 
        ? updater(prev) 
        : updater;
      
      // Normalize semua values
      return Object.keys(newFilters).reduce((acc, key) => {
        acc[key] = normalizeValue(newFilters[key]);
        return acc;
      }, {});
    });
  }, []);
  
  return [filters, safeSetFilters];
};

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

  // State untuk filter dan search dengan safe filters
  const [filters, setFilters] = useSafeFilters({
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

      // Prepare query parameters - normalize semua values
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

      // Handle response dengan normalisasi data
      if (response.data) {
        let data = [];
        let paginationInfo = {};
        
        // Jika API mengembalikan pagination
        if (response.data.pagination) {
          data = response.data.data || [];
          paginationInfo = response.data.pagination || {};
        } else {
          // Jika hanya array biasa
          data = response.data || [];
        }

        // Normalize semua data untuk UI
        const normalizedData = data.map(item => {
          // Extract data dengan default values
          const {
            id = '',
            title = '',
            content = '',
            category = null,
            author = null,
            createdAt = new Date().toISOString(),
            commentCount = 0,
            upvotes = 0,
            views = 0,
            isClosed = false,
            hasExpertAnswer = false,
            isTrending = false
          } = item || {};

          // Pre-normalize untuk performa
          return {
            ...item,
            // Original data
            id,
            title,
            content,
            category,
            author,
            createdAt,
            commentCount: Number(commentCount) || 0,
            upvotes: Number(upvotes) || 0,
            views: Number(views) || 0,
            isClosed: Boolean(isClosed),
            hasExpertAnswer: Boolean(hasExpertAnswer),
            isTrending: Boolean(isTrending),
            // Safe display properties
            displayCategory: normalizeCategory(category),
            displayAuthor: normalizeAuthor(author),
            displayTitle: normalizeValue(title),
            displayContent: normalizeValue(content)
          };
        });

        setDiscussions(normalizedData);
        
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            page: paginationInfo.page || page,
            totalPages: paginationInfo.totalPages || 1,
            totalItems: paginationInfo.totalItems || 0
          }));
        } else {
          setPagination(prev => ({
            ...prev,
            page,
            totalItems: normalizedData.length || 0
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

  // Handlers dengan type safety
  const handleSearch = useCallback((value) => {
    const safeValue = normalizeValue(value);
    setFilters(prev => ({ ...prev, search: safeValue }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [setFilters]);

  const handleFilterChange = useCallback((key, value) => {
    const safeValue = normalizeValue(value);
    setFilters(prev => ({ ...prev, [key]: safeValue }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      sort: 'newest',
      status: 'all',
      author: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [setFilters]);

  const handlePageChange = useCallback((event, page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDiscussions(pagination.page, filters);
  }, [fetchDiscussions, pagination.page, filters]);

  const handleCreateDiscussion = useCallback(() => {
    router.push('/discussions/create');
  }, [router]);

  // Safe select handler untuk MUI Select
  const handleSelectChange = useCallback((key) => (event) => {
    const value = event.target.value;
    const safeValue = normalizeValue(value);
    handleFilterChange(key, safeValue);
  }, [handleFilterChange]);

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

  // Safe value getter untuk MUI Select
  const getSafeSelectValue = useCallback((value) => {
    const normalized = normalizeValue(value);
    // Pastikan value sesuai dengan MenuItem values
    if (normalized === '' || ['newest', 'oldest', 'popular', 'trending', 'all', 'open', 'closed', 'resolved'].includes(normalized)) {
      return normalized;
    }
    // Jika value adalah object yang sudah dinormalisasi, kembalikan string kosong
    return '';
  }, []);

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

          {/* Category Filter - SAFE VERSION */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={getSafeSelectValue(filters.category)}
              label="Kategori"
              onChange={handleSelectChange('category')}
            >
              <MenuItem value="">Semua Kategori</MenuItem>
              <MenuItem value="pertanian">Pertanian</MenuItem>
              <MenuItem value="peternakan">Peternakan</MenuItem>
              <MenuItem value="perikanan">Perikanan</MenuItem>
              <MenuItem value="teknologi">Teknologi</MenuItem>
              <MenuItem value="umum">Umum</MenuItem>
            </Select>
          </FormControl>

          {/* Sort - SAFE VERSION */}
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Urutkan</InputLabel>
            <Select
              value={getSafeSelectValue(filters.sort)}
              label="Urutkan"
              onChange={handleSelectChange('sort')}
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
                      value={getSafeSelectValue(filters.status)}
                      label="Status"
                      onChange={handleSelectChange('status')}
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
            {discussions.map((discussion) => {
              // Gunakan pre-normalized values dari state
              const {
                id,
                displayTitle,
                displayContent,
                displayCategory,
                displayAuthor,
                createdAt,
                commentCount,
                upvotes,
                views,
                isClosed,
                hasExpertAnswer,
                isTrending,
                author
              } = discussion;
              
              const isAuthorPakar = author?.role === 'pakar';
              
              return (
                <Grid item xs={12} sm={6} md={4} key={id}>
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
                      onClick={() => router.push(`/discussions/${id}`)}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        {/* Status Badges */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            {isClosed && (
                              <Chip 
                                label="Tertutup" 
                                size="small" 
                                color="error" 
                                variant="outlined" 
                                sx={{ mr: 1 }} 
                              />
                            )}
                            {hasExpertAnswer && (
                              <Chip 
                                label="Jawaban Pakar" 
                                size="small" 
                                color="success" 
                                variant="outlined" 
                              />
                            )}
                          </Box>
                          {isTrending && (
                            <Whatshot color="warning" />
                          )}
                        </Box>

                        {/* Title - GUARANTEED STRING */}
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
                          {displayTitle}
                        </Typography>

                        {/* Content Preview - GUARANTEED STRING */}
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
                          {displayContent}
                        </Typography>

                        {/* Metadata */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                          {/* Category - GUARANTEED STRING */}
                          {displayCategory && (
                            <Chip
                              icon={<Category />}
                              label={displayCategory}
                              size="small"
                              variant="outlined"
                            />
                          )}

                          {/* Author - GUARANTEED STRING */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {displayAuthor}
                            </Typography>
                          </Box>

                          {/* Time */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {dayjs(createdAt).fromNow()}
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
                                {commentCount}
                              </Typography>
                            </Box>
                          </Tooltip>

                          {/* Upvotes */}
                          <Tooltip title="Upvotes">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <ThumbUp fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {upvotes}
                              </Typography>
                            </Box>
                          </Tooltip>

                          {/* Views */}
                          <Tooltip title="Dilihat">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Visibility fontSize="small" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                {views}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </Box>

                        {/* Expert Badge */}
                        {isAuthorPakar && (
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
              );
            })}
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
// CATATAN PERBAIKAN:
// 1. Semua object telah dinormalisasi menjadi string sebelum render
// 2. MUI Select hanya menerima string/number yang valid
// 3. State filters hanya menyimpan primitive values
// 4. Type guards untuk semua data dari API
// 5. Fallback values untuk null/undefined
// 6. Pre-normalized display properties untuk performa
// 7. Custom hook untuk safe state management
// =====================================================
