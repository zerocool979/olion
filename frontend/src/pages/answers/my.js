// src/pages/answers/my.js

'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack, QuestionAnswer } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

const MyAnswersPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyAnswers = async () => {
      try {
        setLoading(true);
        // Simulasi fetch data - sesuaikan dengan API Anda
        setAnswers([]);
      } catch (err) {
        setError('Failed to load answers');
      } finally {
        setLoading(false);
      }
    };
    fetchMyAnswers();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/dashboard/user')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <QuestionAnswer sx={{ mr: 1 }} />
        My Answers
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {answers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <QuestionAnswer sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No answers yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start helping others by answering their questions
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/discussions?filter=unanswered')}
          >
            Browse Questions
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {/* List answers akan ditampilkan di sini */}
        </Stack>
      )}
    </Container>
  );
};

export default function MyAnswersPageWrapper() {
  return (
    <ProtectedRoute>
      <MyAnswersPage />
    </ProtectedRoute>
  );
}
