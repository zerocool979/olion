'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button
} from '@mui/material';
import { useRouter } from 'next/router';
import api from '../../api/discussion';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import dayjs from '../../utils/dayjs';

const AdminDiscussionsStatsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDiscussionStats();
      const data = res.data || res;
      setStats(data);
    } catch (err) {
      console.error('Error fetching discussion stats:', err);
      setError('Failed to load discussion statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchStats}>Retry</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Discussion Statistics (Admin)
      </Typography>

      {stats.length === 0 ? (
        <Typography>No discussions found.</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Upvotes</TableCell>
                <TableCell>Bookmarks</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Updated At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.map((discussion) => (
                <TableRow key={discussion.id}>
                  <TableCell>{discussion.title}</TableCell>
                  <TableCell>{discussion.author?.email || 'Unknown'}</TableCell>
                  <TableCell>{discussion.category || '-'}</TableCell>
                  <TableCell>{discussion._count?.comments || 0}</TableCell>
                  <TableCell>{discussion.vote?.upvote || 0}</TableCell>
                  <TableCell>{discussion.bookmark?.count || 0}</TableCell>
                  <TableCell>{discussion.views || 0}</TableCell>
                  <TableCell>{dayjs(discussion.createdAt).format('DD MMM YYYY')}</TableCell>
                  <TableCell>{dayjs(discussion.updatedAt).format('DD MMM YYYY')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default function AdminDiscussionsStatsWrapper() {
  return (
    <ProtectedRoute adminOnly>
      <AdminDiscussionsStatsPage />
    </ProtectedRoute>
  );
}
