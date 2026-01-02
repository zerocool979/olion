// src/pages/discussions/create.js

'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  LinearProgress,
  Alert,
  Snackbar,
  FormHelperText,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Add,
  Clear,
  Category,
  Description,
  Title,
  Save,
  Cancel,
  Help
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';
import dayjs from 'dayjs';

// 🔧 UTILITY HELPER UNTUK SAFE RENDERING
const safeText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  
  if (typeof value === 'object') {
    return value.name || value.title || value.label || 
           (value.id ? value.id.toString() : fallback);
  }
  
  return fallback;
};

const CreateDiscussionPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  // State untuk form
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: [],
    isAnonymous: false
  });
  
  // State untuk UI
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // State untuk validasi
  const [errors, setErrors] = useState({
    title: '',
    content: '',
    category: ''
  });

  // Fetch kategori saat komponen mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const res = await api.get('/categories');
        const normalized = (res.data || []).map(cat => ({
          ...cat,
          displayName: safeText(cat.name, cat.title || cat.label || 'Unnamed'),
          id: cat.id || cat._id
        }));
        setCategories(normalized);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please refresh.');
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Validasi form
  const validateForm = () => {
    const newErrors = {
      title: '',
      content: '',
      category: ''
    };
    
    let isValid = true;
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
      isValid = false;
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
      isValid = false;
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
      isValid = false;
    } else if (formData.content.trim().length < 20) {
      newErrors.content = 'Content must be at least 20 characters';
      isValid = false;
    } else if (formData.content.trim().length > 5000) {
      newErrors.content = 'Content must not exceed 5000 characters';
      isValid = false;
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form input changes
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to create a discussion',
        severity: 'error'
      });
      setTimeout(() => {
        router.push(`/login?redirect=/discussions/create`);
      }, 1500);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: formData.category,
        tags: formData.tags,
        isAnonymous: formData.isAnonymous,
        authorId: user.id
      };
      
      const response = await api.post('/discussions', payload);
      
      setSnackbar({
        open: true,
        message: 'Discussion created successfully!',
        severity: 'success'
      });
      
      // Redirect to the new discussion after a short delay
      setTimeout(() => {
        router.push(`/discussions/${response.data.id || response.data._id}`);
      }, 1500);
      
    } catch (err) {
      console.error('Error creating discussion:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to create discussion. Please try again.';
      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (window.confirm('Are you sure you want to cancel? Your changes will be lost.')) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Character counters
  const titleLength = formData.title.trim().length;
  const contentLength = formData.content.trim().length;

  if (categoriesLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          Loading categories...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/discussions')}
          sx={{ mb: 2 }}
        >
          Back to Discussions
        </Button>
        
        <Typography variant="h4" gutterBottom>
          Create New Discussion
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Share your question or idea with the community
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Main Form */}
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discussion Title"
                variant="outlined"
                value={formData.title}
                onChange={handleInputChange('title')}
                error={!!errors.title}
                helperText={errors.title || `${titleLength}/200 characters`}
                disabled={loading}
                required
                InputProps={{
                  startAdornment: (
                    <Title color="action" sx={{ mr: 1 }} />
                  )
                }}
                inputProps={{
                  maxLength: 200
                }}
                placeholder="What's your question or topic?"
              />
            </Grid>

            {/* Category Selection */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.category} disabled={loading}>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={formData.category}
                  onChange={handleInputChange('category')}
                  label="Category *"
                  startAdornment={<Category color="action" sx={{ mr: 1 }} />}
                >
                  <MenuItem value="">
                    <em>Select a category</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id || category._id} value={category.id || category._id}>
                      {category.displayName}
                      {category.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          - {safeText(category.description).substring(0, 30)}...
                        </Typography>
                      )}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                {!errors.category && (
                  <FormHelperText>
                    Choose the most relevant category for your discussion
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Tags Input */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <TextField
                  label="Tags (Optional)"
                  variant="outlined"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  helperText="Press Enter to add tags"
                  InputProps={{
                    endAdornment: tagInput && (
                      <IconButton size="small" onClick={() => setTagInput('')}>
                        <Clear />
                      </IconButton>
                    )
                  }}
                  placeholder="e.g., agriculture, technology"
                />
                {formData.tags.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </FormControl>
            </Grid>

            {/* Content Input */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discussion Content"
                variant="outlined"
                value={formData.content}
                onChange={handleInputChange('content')}
                error={!!errors.content}
                helperText={errors.content || `${contentLength}/5000 characters`}
                disabled={loading}
                required
                multiline
                rows={8}
                InputProps={{
                  startAdornment: (
                    <Description color="action" sx={{ mr: 1 }} />
                  )
                }}
                inputProps={{
                  maxLength: 5000
                }}
                placeholder="Describe your question or topic in detail. Be specific to get better answers."
              />
            </Grid>

            {/* Tips Section */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Help fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                  Tips for a great discussion:
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Be clear and specific in your question</li>
                    <li>Include relevant details and context</li>
                    <li>Use proper formatting (paragraphs, lists)</li>
                    <li>Choose the right category for better visibility</li>
                    <li>Add tags to help others find your discussion</li>
                  </ul>
                </Typography>
              </Paper>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      // Preview functionality
                      setSnackbar({
                        open: true,
                        message: 'Preview feature coming soon!',
                        severity: 'info'
                      });
                    }}
                    disabled={loading}
                  >
                    Preview
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? null : <Save />}
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Creating...
                      </>
                    ) : (
                      'Create Discussion'
                    )}
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Guidelines Sidebar */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Community Guidelines
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2">
            • Be respectful and inclusive in your discussions
          </Typography>
          <Typography variant="body2">
            • Do not share personal or sensitive information
          </Typography>
          <Typography variant="body2">
            • Avoid spam, self-promotion, or off-topic content
          </Typography>
          <Typography variant="body2">
            • Cite sources when sharing information
          </Typography>
          <Typography variant="body2">
            • Follow the community rules and moderator guidance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            By creating a discussion, you agree to our Terms of Service and Community Guidelines.
          </Typography>
        </Stack>
      </Paper>

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
const CreateDiscussionPageWrapper = () => (
  <ProtectedRoute>
    <CreateDiscussionPage />
  </ProtectedRoute>
);

export default CreateDiscussionPageWrapper;

// =====================================================
// CATATAN IMPLEMENTASI:
// =====================================================
// 1. ✅ FORM VALIDATION:
//    - Title: 5-200 karakter, required
//    - Content: 20-5000 karakter, required  
//    - Category: required
//    - Tags: optional
//
// 2. ✅ SAFE RENDERING:
//    - Menggunakan utility helper safeText()
//    - Normalisasi kategori dari API
//    - Error handling untuk semua field
//
// 3. ✅ UX IMPROVEMENTS:
//    - Character counter untuk title dan content
//    - Tags system dengan Enter untuk add
//    - Loading states
//    - Confirmation on cancel jika ada perubahan
//
// 4. ✅ API INTEGRATION:
//    - POST /discussions dengan payload yang sesuai
//    - Fetch categories dari /categories
//    - Redirect ke discussion baru setelah sukses
//
// 5. ✅ COMMUNITY GUIDELINES:
//    - Tips untuk discussion yang baik
//    - Community guidelines sidebar
//    - Terms agreement reminder
// =====================================================
