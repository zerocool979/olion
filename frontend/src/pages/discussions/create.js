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
  Divider
} from '@mui/material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/discussion';

const CreateDiscussionPage = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // 🔽 dropdown category
  const [categoryId, setCategoryId] = useState('');

  // ✍️ manual category
  const [categoryName, setCategoryName] = useState('');

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await api.getCategories();
      const data = res.data?.data || res.data || [];
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }

    if (!categoryId && !categoryName) {
      setError('Please select a category or type a new one.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        title,
        content,
        ...(categoryId
          ? { categoryId }
          : { categoryName }),
      };

      await api.createDiscussion(payload);
      router.push('/discussions/my');
    } catch (err) {
      console.error('Error creating discussion:', err);
      setError('Failed to create discussion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Discussion
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          multiline
          rows={6}
        />

        {/* ================= CATEGORY SELECT ================= */}
        <TextField
          select
          label="Choose Category"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setCategoryName(''); // reset manual input
          }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <Divider>OR</Divider>

        {/* ================= MANUAL CATEGORY ================= */}
        <TextField
          label="Create New Category"
          value={categoryName}
          onChange={(e) => {
            setCategoryName(e.target.value);
            setCategoryId(''); // reset dropdown
          }}
          placeholder="Type new category name"
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.push('/discussions/my')}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Discussion'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default function CreateDiscussionWrapper() {
  return (
    <ProtectedRoute>
      <CreateDiscussionPage />
    </ProtectedRoute>
  );
}
