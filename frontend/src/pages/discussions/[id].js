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
  Fab
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

  // Role-based permissions
  const userRole = user?.role || 'user';
  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;
  const isPakar = userRole === 'pakar';
  // PERBAIKAN: Gunakan optional chaining untuk discussion yang belum ada
  const canEditDiscussion = isAdmin || isModerator || user?.id === discussion?.authorId;
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

      setDiscussion(discussionData);
      setAnswers(answersData);
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
    if (!discussion) return;

    try {
      setDeleteLoading(true);
      await deleteDiscussion(discussion.id);

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
    if (discussion && canEditDiscussion) {
      router.push(`/discussions/${id}/edit`);
    }
  };

  /* ======================
     HANDLE SHARE
  ====================== */
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: discussion?.title || 'Discussion',
        text: `Check out this discussion: ${discussion?.title}`,
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
  if (!discussion) {
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
            <Typography variant="h4" component="h1" gutterBottom>
              {discussion.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {discussion.category && (
                <Chip label={discussion.category} size="small" color="primary" variant="outlined" />
              )}
              {discussion.isClosed && (
                <Chip label="Closed" size="small" color="error" />
              )}
              {discussion.hasExpertAnswer && (
                <Chip label="Expert Answered" size="small" color="success" />
              )}
              <Typography variant="caption" color="text.secondary">
                Posted {new Date(discussion.createdAt).toLocaleDateString()}
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
            {/* Discussion Content */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                {discussion.content}
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
                  Posted by: <strong>{discussion.author?.name || 'Anonymous'}</strong>
                  {discussion.author?.role === 'pakar' && (
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
                Helpful ({discussion.upvotes || 0})
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
          <Paper sx={{ p: 3 }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3
            }}>
              <Typography variant="h5">
                <CommentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
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
                  <Box key={answer.id}>
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
                <Typography variant="body1">
                  {discussion.views || 0}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Created
                </Typography>
                <Typography variant="body1">
                  {new Date(discussion.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              {discussion.updatedAt !== discussion.createdAt && (
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(discussion.updatedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Status
                </Typography>
                <Chip
                  label={discussion.isClosed ? 'Closed' : 'Open'}
                  color={discussion.isClosed ? 'error' : 'success'}
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
            <strong>{discussion.title}</strong>
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
// PERBAIKAN: Import Grid yang diperlukan
// =====================================================
import Grid from '@mui/material/Grid';

// =====================================================
// CATATAN:
// 1. Halaman diskusi detail bisa diakses semua user yang login
// 2. ProtectedRoute menangani auth tanpa spesifik role
// 3. Admin/Moderator bisa delete, author bisa edit
// 4. User biasa dan pakar bisa memberikan jawaban
// =====================================================
