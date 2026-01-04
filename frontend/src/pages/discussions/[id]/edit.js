'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../../components/ProtectedRoute';

import discussionApi from '../../../api/discussion';
import { getCategories } from '../../../api/category';

const EditDiscussionPage = () => {
  const router = useRouter();
  const { id: discussionId } = router.query;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchDiscussion = async () => {
    if (!discussionId) return;

    try {
      setLoading(true);
      const res = await discussionApi.getDiscussionById(discussionId);
      setTitle(res.title || '');
      setContent(res.content || '');
      setCategoryId(res.category?.id || '');
    } catch (err) {
      console.error('Failed to fetch discussion', err);
      setError('Failed to load discussion.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
      setError('Failed to load categories.');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDiscussion();
  }, [discussionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content || !categoryId) {
      setError('Title, content, and category are required.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await discussionApi.updateDiscussion(discussionId, {
        title,
        content,
        categoryId,
      });
      router.push('/discussions/my');
    } catch (err) {
      console.error('Failed to update discussion', err);
      setError('Failed to update discussion. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        sx={{
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Edit Discussion
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          fullWidth
          multiline
          minRows={4}
        />

        <TextField
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          select
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/discussions/my')}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default function EditDiscussionPageWrapper() {
  return (
    <ProtectedRoute>
      <EditDiscussionPage />
    </ProtectedRoute>
  );
}
