// src/pages/reputation/index.js

'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Button,
  Stack,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  TrendingUp,
  ThumbUp,
  History,
  EmojiEvents,
  Timeline,
  Star,
  MilitaryTech,
  LocalFireDepartment
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';
import dayjs from '../../utils/dayjs';

const ReputationPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [reputationData, setReputationData] = useState({
    total: 0,
    history: [],
    breakdown: {},
    rank: null,
    nextLevel: 50
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReputationData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch reputation data
      const res = await api.get('/reputation');
      const data = res.data || {};
      
      setReputationData({
        total: data.total || data.reputation || 0,
        history: data.history || data.transactions || [],
        breakdown: data.breakdown || {
          answers: data.answerPoints || 0,
          discussions: data.discussionPoints || 0,
          upvotes: data.upvotePoints || 0,
          accepted: data.acceptedAnswerPoints || 0
        },
        rank: data.rank || calculateRank(data.total || 0),
        nextLevel: data.nextLevel || 50
      });
      
    } catch (err) {
      console.error('Error fetching reputation data:', err);
      setError('Failed to load reputation data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const calculateRank = (points) => {
    if (points >= 1000) return 'Legend';
    if (points >= 500) return 'Expert';
    if (points >= 250) return 'Master';
    if (points >= 100) return 'Advanced';
    if (points >= 50) return 'Intermediate';
    if (points >= 10) return 'Beginner';
    return 'Newcomer';
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 'Legend': return <MilitaryTech color="warning" />;
      case 'Expert': return <LocalFireDepartment color="error" />;
      case 'Master': return <EmojiEvents color="primary" />;
      case 'Advanced': return <Star color="success" />;
      default: return <TrendingUp color="info" />;
    }
  };

  const getReputationColor = (points) => {
    if (points >= 500) return 'warning.main';
    if (points >= 250) return 'error.main';
    if (points >= 100) return 'primary.main';
    if (points >= 50) return 'success.main';
    return 'info.main';
  };

  useEffect(() => {
    fetchReputationData();
  }, []);

  const progressPercentage = Math.min((reputationData.total / reputationData.nextLevel) * 100, 100);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <TrendingUp sx={{ mr: 1 }} />
                    Reputation Score
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Your contribution level in the community
                  </Typography>
                </Box>
                <Chip
                  icon={getRankIcon(reputationData.rank)}
                  label={`${reputationData.rank} Level`}
                  color="primary"
                  variant="outlined"
                  size="large"
                />
              </Box>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h2" sx={{ color: getReputationColor(reputationData.total) }}>
                    {reputationData.total}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Next level at {reputationData.nextLevel} points
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercentage} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    mb: 1
                  }}
                />
                <Typography variant="caption" color="text.secondary">
                  {reputationData.nextLevel - reputationData.total} more points to reach next level
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Reputation Breakdown */}
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThumbUp sx={{ mr: 1 }} />
                Points Breakdown
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">
                      +{reputationData.breakdown.answers || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From Answers
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="success">
                      +{reputationData.breakdown.discussions || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From Discussions
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="warning">
                      +{reputationData.breakdown.upvotes || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From Upvotes
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                      +{reputationData.breakdown.accepted || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accepted Answers
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* How to Earn Reputation */}
      <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <EmojiEvents sx={{ mr: 1 }} />
          How to Earn Reputation
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>+10 points</strong> - Your answer is accepted as solution
              </Typography>
              <Typography variant="body2">
                <strong>+5 points</strong> - Your answer receives an upvote
              </Typography>
              <Typography variant="body2">
                <strong>+3 points</strong> - Your discussion receives an upvote
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1}>
              <Typography variant="body2">
                <strong>+2 points</strong> - Posting a new discussion
              </Typography>
              <Typography variant="body2">
                <strong>+1 point</strong> - Posting a helpful comment
              </Typography>
              <Typography variant="body2">
                <strong>Bonus</strong> - Daily activity streak bonus
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Reputation History */}
      <Paper sx={{ p: 3 }} elevation={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <History sx={{ mr: 1 }} />
            Reputation History
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Last 30 days
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button onClick={fetchReputationData} sx={{ ml: 2 }} size="small">
              Retry
            </Button>
          </Alert>
        )}

        {reputationData.history.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Timeline sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No reputation history yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start contributing to the community to earn reputation points
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={() => router.push('/discussions/create')}
              >
                Start Discussion
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push('/discussions?filter=unanswered')}
              >
                Answer Questions
              </Button>
            </Stack>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Points</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reputationData.history.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {dayjs(item.date || item.createdAt).format('DD MMM YYYY')}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {item.description || item.activity}
                      </Typography>
                      {item.discussionTitle && (
                        <Typography variant="caption" color="text.secondary">
                          {item.discussionTitle}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={`${item.points > 0 ? '+' : ''}${item.points}`}
                        color={item.points > 0 ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {item.runningTotal || item.total}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default function ReputationPageWrapper() {
  return (
    <ProtectedRoute>
      <ReputationPage />
    </ProtectedRoute>
  );
}
