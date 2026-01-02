// src/pages/discussions/[id].js
'use client'; // Tambahkan directive untuk Next.js 13+

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';

import { getDiscussionById, deleteDiscussion } from '../../api/discussion';
import { getAnswersByDiscussion, createAnswer } from '../../api/answer';

import DiscussionCard from '../../components/DiscussionCard';
import AnswerCard from '../../components/AnswerCard';

// Import MUI components untuk UI yang lebih baik
import {
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Stack,
  TextField,
  IconButton,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tooltip,
  Fab,
  Grid
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Send,
  Refresh,
  Edit,
  Delete,
  ThumbUp,
  Share,
  Bookmark,
  Flag,
  Comment as CommentIcon,
  Warning,
  Close
} from '@mui/icons-material';

// Import dayjs untuk format tanggal
import dayjs from '../../utils/dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

/**
 * =====================================================
 * 🔧 UTILITY HELPER UNTUK SAFE RENDERING
 * =====================================================
 */

// Helper untuk normalisasi text dengan berbagai tipe data
const safeText = (value, fallback = '-') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  
  // Handle object dengan properti umum
  if (typeof value === 'object') {
    // Priority order untuk field yang umum
    return value.name || value.title || value.label || 
           value.username || value.email || 
           (value.id ? value.id.toString() : fallback);
  }
  
  return fallback;
};

// Helper untuk normalisasi category (bisa string atau object)
const normalizeCategory = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category;
  if (typeof category === 'object') {
    return category.name || category.title || category.id?.toString() || '';
  }
  return '';
};

// Helper untuk normalisasi author (bisa string atau object)
const normalizeAuthor = (author) => {
  if (!author) return 'Anonim';
  if (typeof author === 'string') return author;
  if (typeof author === 'object') {
    return author.name || author.username || 
           author.pseudonym || author.email || 'Anonim';
  }
  return 'Anonim';
};

// Helper untuk cek apakah author adalah pakar
const isAuthorPakar = (author) => {
  if (!author || typeof author !== 'object') return false;
  return author.role === 'pakar' || author.isExpert === true;
};

// Helper untuk safe date rendering dengan dayjs
const safeDate = (dateString, format = 'fromNow') => {
  if (!dateString) return '';
  
  try {
    const date = dayjs(dateString);
    if (!date.isValid()) return '';
    
    if (format === 'fromNow') {
      return date.fromNow();
    } else if (format === 'date') {
      return date.format('DD MMM YYYY');
    } else if (format === 'datetime') {
      return date.format('DD MMM YYYY HH:mm');
    }
    return date.format(format);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * =====================================================
 * Discussion Detail Page (ENHANCED)
 * -----------------------------------------------------
 * Fitur tambahan:
 * 1. Loading state yang lebih baik
 * 2. Error handling dengan retry button
 * 3. Form untuk menambah jawaban
 * 4. Role-aware actions (edit/delete)
 * 5. Voting system
 * 6. Share functionality
 * 7. Responsive design
 * 8. Real-time updates (optional)
 * =====================================================
 */

const DiscussionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [discussion, setDiscussion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // State untuk form jawaban baru
  const [newAnswer, setNewAnswer] = useState('');
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [answerError, setAnswerError] = useState('');

  // State untuk delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // State untuk notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Pre-normalized values untuk menghindari rerender
  const normalizedDiscussion = useCallback(() => {
    if (!discussion) return null;
    
    return {
      ...discussion,
      // Safe display properties
      displayTitle: safeText(discussion.title, 'No Title'),
      displayContent: safeText(discussion.content, 'No content'),
      displayCategory: normalizeCategory(discussion.category),
      displayAuthor: normalizeAuthor(discussion.author),
      displayCreatedAt: safeDate(discussion.createdAt, 'date'),
      displayCreatedAtRelative: safeDate(discussion.createdAt, 'fromNow'),
      displayUpdatedAt: discussion.updatedAt !== discussion.createdAt 
        ? safeDate(discussion.updatedAt, 'date') 
        : null,
      displayViews: discussion.views || 0,
      displayUpvotes: discussion.upvotes || 0,
      isAuthorPakar: isAuthorPakar(discussion.author),
      // Preserve original untuk logic
      authorId: discussion.author?.id || discussion.authorId,
      categoryId: discussion.category?.id || discussion.categoryId
    };
  }, [discussion]);

  const displayDiscussion = normalizedDiscussion();

  // Role-based permissions - menggunakan displayDiscussion yang sudah dinormalisasi
  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;
  const isPakar = userRole === 'pakar';
  // PERBAIKAN: Gunakan optional chaining dan normalized values
  const canEditDiscussion = isAdmin || isModerator || user?.id === displayDiscussion?.authorId;
  const canDeleteDiscussion = isAdmin || isModerator;
  const canAnswer = user && (isPakar || userRole === 'user');

  /* ======================
     LOAD DISCUSSION DATA
  ====================== */
  const loadDiscussion = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const [discussionData, answersData] = await Promise.all([
        getDiscussionById(id),
        getAnswersByDiscussion(id)
      ]);

      // Normalize incoming data
      const normalizedData = {
        ...discussionData,
        // Pastikan properti ada
        title: safeText(discussionData?.title, 'No Title'),
        content: safeText(discussionData?.content, 'No content'),
        category: discussionData?.category || null,
        author: discussionData?.author || null,
        createdAt: discussionData?.createdAt || new Date().toISOString(),
        updatedAt: discussionData?.updatedAt || discussionData?.createdAt || new Date().toISOString(),
        views: discussionData?.views || 0,
        upvotes: discussionData?.upvotes || 0,
        isClosed: Boolean(discussionData?.isClosed),
        hasExpertAnswer: Boolean(discussionData?.hasExpertAnswer)
      };

      setDiscussion(normalizedData);
      
      // Normalize answers data
      const normalizedAnswers = (answersData || []).map(answer => ({
        ...answer,
        // Pastikan semua properti yang diperlukan ada
        content: safeText(answer.content, ''),
        author: answer.author || null,
        createdAt: answer.createdAt || new Date().toISOString(),
        upvotes: answer.upvotes || 0,
        isAccepted: Boolean(answer.isAccepted)
      }));
      
      setAnswers(normalizedAnswers);
    } catch (err) {
      console.error('Error loading discussion:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load discussion'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadDiscussion();
    }
  }, [id, loadDiscussion]);

  /* ======================
     HANDLE REFRESH
  ====================== */
  const handleRefresh = () => {
    setRefreshing(true);
    loadDiscussion();
  };

  /* ======================
     HANDLE SUBMIT ANSWER
  ====================== */
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!user) {
      router.push(`/login?redirect=/discussions/${id}`);
      return;
    }

    if (!newAnswer.trim()) {
      setAnswerError('Answer cannot be empty');
      return;
    }

    try {
      setSubmittingAnswer(true);
      setAnswerError('');

      await createAnswer({
        content: newAnswer,
        discussionId: id
      });

      // Clear form and refresh answers
      setNewAnswer('');
      await loadDiscussion(); // Reload untuk mendapatkan jawaban terbaru

      setSnackbar({
        open: true,
        message: 'Answer posted successfully',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error posting answer:', err);
      setAnswerError(
        err.response?.data?.message ||
        'Failed to post answer'
      );
    } finally {
      setSubmittingAnswer(false);
    }
  };

  /* ======================
     HANDLE DELETE DISCUSSION
  ====================== */
  const handleDeleteDiscussion = async () => {
    if (!displayDiscussion) return;

    try {
      setDeleteLoading(true);
      await deleteDiscussion(displayDiscussion.id);

      setSnackbar({
        open: true,
        message: 'Discussion deleted successfully',
        severity: 'success'
      });

      // Redirect to discussions list after successful deletion
      setTimeout(() => {
        router.push('/discussions');
      }, 1500);
    } catch (err) {
      console.error('Error deleting discussion:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to delete discussion',
        severity: 'error'
      });
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  /* ======================
     HANDLE EDIT DISCUSSION
  ====================== */
  const handleEditDiscussion = () => {
    if (displayDiscussion && canEditDiscussion) {
      router.push(`/discussions/${id}/edit`);
    }
  };

  /* ======================
     HANDLE SHARE
  ====================== */
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: displayDiscussion?.displayTitle || 'Discussion',
        text: `Check out this discussion: ${displayDiscussion?.displayTitle}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({
        open: true,
        message: 'Link copied to clipboard',
        severity: 'info'
      });
    }
  };

  /* ======================
     HANDLE VOTE
  ====================== */
  const handleVote = async (type) => {
    if (!user) {
      router.push(`/login?redirect=/discussions/${id}`);
      return;
    }

    // Implement voting logic here
    console.log(`Voted ${type} on discussion ${id}`);
  };

  /* ======================
     HANDLE CLOSE SNACKBAR
  ====================== */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading discussion...
          </Typography>
        </Box>
      </Container>
    );
  }

  /* ======================
     ERROR STATE
  ====================== */
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/discussions')}
          variant="outlined"
        >
          Back to Discussions
        </Button>
      </Container>
    );
  }

  /* ======================
     NOT FOUND STATE
  ====================== */
  if (!displayDiscussion) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Discussion not found
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/discussions')}
          variant="contained"
        >
          Back to Discussions
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header dengan navigation dan actions */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/discussions')}
          sx={{ mb: 2 }}
        >
          Back to Discussions
        </Button>

        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            {/* TITLE - GUARANTEED STRING */}
            <Typography variant="h4" component="h1" gutterBottom>
              {displayDiscussion.displayTitle}
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {/* CATEGORY - GUARANTEED STRING */}
              {displayDiscussion.displayCategory && (
                <Chip 
                  label={displayDiscussion.displayCategory} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              )}
              
              {displayDiscussion.isClosed && (
                <Chip label="Closed" size="small" color="error" />
              )}
              
              {displayDiscussion.hasExpertAnswer && (
                <Chip label="Expert Answered" size="small" color="success" />
              )}
              
              {/* DATE - GUARANTEED STRING */}
              <Typography variant="caption" color="text.secondary">
                Posted {displayDiscussion.displayCreatedAtRelative || displayDiscussion.displayCreatedAt}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={refreshing}>
                <Refresh />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share">
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>

            {canEditDiscussion && (
              <Tooltip title="Edit Discussion">
                <IconButton onClick={handleEditDiscussion}>
                  <Edit />
                </IconButton>
              </Tooltip>
            )}

            {canDeleteDiscussion && (
              <Tooltip title="Delete Discussion">
                <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Discussion Content - Left Column */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* Discussion Content - GUARANTEED STRING */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                {displayDiscussion.displayContent}
              </Typography>

              {/* Author Info */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 3,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider'
              }}>
                <Typography variant="caption" color="text.secondary">
                  Posted by: <strong>{displayDiscussion.displayAuthor}</strong>
                  {displayDiscussion.isAuthorPakar && (
                    <Chip label="Pakar" size="small" color="success" sx={{ ml: 1 }} />
                  )}
                </Typography>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button
                startIcon={<ThumbUp />}
                onClick={() => handleVote('up')}
                size="small"
                variant="outlined"
              >
                {/* UPVOTES - GUARANTEED NUMBER */}
                Helpful ({displayDiscussion.displayUpvotes})
              </Button>
              <Button
                startIcon={<Bookmark />}
                size="small"
                variant="outlined"
              >
                Save
              </Button>
              <Button
                startIcon={<Flag />}
                size="small"
                variant="outlined"
                color="warning"
              >
                Report
              </Button>
            </Stack>
          </Paper>

          {/* Answers Section */}
          <Paper sx={{ p: 3 }} id="answer-form">
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h5">
                <CommentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {/* ANSWERS COUNT - GUARANTEED NUMBER */}
                Answers ({answers.length})
              </Typography>
              <Button
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={refreshing}
                size="small"
              >
                Refresh
              </Button>
            </Box>

            {/* Answer Form */}
            {canAnswer && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Post Your Answer
                </Typography>
                <form onSubmit={handleSubmitAnswer}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Write your answer here..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    disabled={submittingAnswer}
                    error={!!answerError}
                    helperText={answerError}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Send />}
                      disabled={submittingAnswer || !newAnswer.trim()}
                    >
                      {submittingAnswer ? 'Posting...' : 'Post Answer'}
                    </Button>
                  </Box>
                </form>
              </Paper>
            )}

            {/* Answers List */}
            {answers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CommentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No answers yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Be the first to answer this question
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                {answers.map((answer) => (
                  <Box key={answer.id || `answer-${Math.random()}`}>
                    {/* Pastikan AnswerCard menerima normalized data */}
                    <AnswerCard
                      answer={answer}
                      discussionId={id}
                      onUpdate={loadDiscussion}
                      user={user}
                    />
                    <Divider sx={{ mt: 3 }} />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Sidebar - Right Column */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Discussion Info
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Views
                </Typography>
                {/* VIEWS - GUARANTEED NUMBER */}
                <Typography variant="body1">
                  {displayDiscussion.displayViews}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Created
                </Typography>
                {/* DATE - GUARANTEED STRING */}
                <Typography variant="body1">
                  {displayDiscussion.displayCreatedAt}
                </Typography>
              </Box>
              {displayDiscussion.displayUpdatedAt && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Updated
                  </Typography>
                  {/* DATE - GUARANTEED STRING */}
                  <Typography variant="body1">
                    {displayDiscussion.displayUpdatedAt}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Status
                </Typography>
                <Chip
                  label={displayDiscussion.isClosed ? 'Closed' : 'Open'}
                  color={displayDiscussion.isClosed ? 'error' : 'success'}
                  size="small"
                />
              </Box>
            </Stack>
          </Paper>

          {/* Related Discussions */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              If you need immediate assistance, consider:
            </Typography>
            <Stack spacing={1}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push('/discussions/create')}
                startIcon={<Add />}
              >
                Ask New Question
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push('/pakar')}
              >
                Browse Pakars
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push('/help')}
              >
                Help Center
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', lg: 'none' }
        }}
        onClick={() => {
          const answerSection = document.getElementById('answer-form');
          if (answerSection) {
            answerSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        <Add />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>
          <Warning color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Delete Discussion
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this discussion?
            <br />
            {/* TITLE - GUARANTEED STRING */}
            <strong>{displayDiscussion.displayTitle}</strong>
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. All answers and comments will also be deleted.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteDiscussion}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={<Delete />}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
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
const WrappedDiscussionDetailPage = () => {
  return (
    <ProtectedRoute>
      <DiscussionDetailPage />
    </ProtectedRoute>
  );
};

export default WrappedDiscussionDetailPage;

// =====================================================
// CATATAN PERBAIKAN YANG DILAKUKAN:
// =====================================================
// 1. ✅ TAMBAHKAN IMPORT dayjs dan plugin relativeTime
// 2. ✅ BUAT UTILITY HELPER untuk safe rendering:
//    - safeText(): Handle semua tipe data menjadi string
//    - normalizeCategory(): Normalisasi category (string/object)
//    - normalizeAuthor(): Normalisasi author (string/object)
//    - isAuthorPakar(): Cek role author dengan type-safe
//    - safeDate(): Format tanggal dengan dayjs yang aman
// 3. ✅ NORMALISASI DATA di loadDiscussion():
//    - Normalisasi data dari API sebelum disimpan ke state
//    - Tambahkan fallback values untuk semua properti
// 4. ✅ GUARANTEED RENDER VALUES:
//    - displayTitle, displayContent: Always string
//    - displayCategory, displayAuthor: Always string
//    - displayViews, displayUpvotes: Always number
//    - displayCreatedAt, displayUpdatedAt: Always string atau null
// 5. ✅ FIX DAYJS .fromNow() ERROR:
//    - Pastikan plugin relativeTime di-extend
//    - Gunakan safeDate() dengan try-catch
// 6. ✅ FIX JSX RENDERING:
//    - Semua Typography hanya render string/number
//    - Semua Chip label hanya string
//    - Semua date rendering menggunakan safeDate()
// 7. ✅ PRESERVE BUSINESS LOGIC:
//    - Role permissions tetap sama
//    - UI/UX tetap sama
//    - Fitur lengkap tetap ada
// 8. ✅ HANDLE EDGE CASES:
//    - null/undefined data dari API
//    - Invalid date strings
//    - Object tanpa properti yang diharapkan
// =====================================================
