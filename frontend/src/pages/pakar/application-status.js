// src/pages/pakar/application-status.js

'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Divider,
  Stack,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  School,
  Pending,
  CheckCircle,
  Cancel,
  AccessTime,
  History,
  Help,
  Refresh
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';

const PakarApplicationStatusPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplicationStatus = async () => {
    try {
      setLoading(true);
      // Try to fetch application status
      const res = await api.get('/pakars/my-application');
      setApplication(res.data);
    } catch (err) {
      console.error('Error fetching application:', err);
      setError('Unable to load application status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const getStatusInfo = (status) => {
    switch(status) {
      case 'pending':
        return { 
          color: 'warning', 
          icon: <Pending />, 
          text: 'Under Review',
          description: 'Your application is being reviewed by our admin team'
        };
      case 'approved':
        return { 
          color: 'success', 
          icon: <CheckCircle />, 
          text: 'Approved',
          description: 'Congratulations! You are now a Pakar'
        };
      case 'rejected':
        return { 
          color: 'error', 
          icon: <Cancel />, 
          text: 'Not Approved',
          description: 'Your application was not approved at this time'
        };
      default:
        return { 
          color: 'info', 
          icon: <Help />, 
          text: 'No Application',
          description: 'You have not submitted an application yet'
        };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  const statusInfo = getStatusInfo(application?.status);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/dashboard/user')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <School sx={{ fontSize: 60, color: `${statusInfo.color}.main`, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Pakar Application Status
          </Typography>
          <Chip
            icon={statusInfo.icon}
            label={statusInfo.text}
            color={statusInfo.color}
            variant="filled"
            size="large"
            sx={{ mb: 2 }}
          />
          <Typography variant="body1" color="text.secondary">
            {statusInfo.description}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
            <Button onClick={fetchApplicationStatus} sx={{ ml: 2 }} size="small">
              Retry
            </Button>
          </Alert>
        )}

        {/* Application Details */}
        {application && (
          <>
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <History sx={{ mr: 1 }} />
              Application Details
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Expertise Field
                    </Typography>
                    <Typography variant="body1">
                      {application.field || 'Not specified'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Applied Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {application.yearsOfExperience && (
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        Years of Experience
                      </Typography>
                      <Typography variant="body1">
                        {application.yearsOfExperience} years
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {application.reviewedAt && (
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        Last Reviewed
                      </Typography>
                      <Typography variant="body1">
                        {new Date(application.reviewedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>

            {application.reason && (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Your Application Statement
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {application.reason}
                  </Typography>
                </CardContent>
              </Card>
            )}

            {application.adminNotes && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Admin Notes:
                </Typography>
                <Typography variant="body2">
                  {application.adminNotes}
                </Typography>
              </Alert>
            )}
          </>
        )}

        {/* Next Steps */}
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom>
          Next Steps
        </Typography>

        {!application ? (
          <Stack spacing={2}>
            <Alert severity="info">
              You haven't applied to become a Pakar yet.
            </Alert>
            <Button
              variant="contained"
              startIcon={<School />}
              onClick={() => router.push('/pakar/apply')}
              fullWidth
            >
              Apply to Become a Pakar
            </Button>
            <Button
              variant="outlined"
              startIcon={<Help />}
              onClick={() => router.push('/pakar/guide')}
              fullWidth
            >
              Learn About the Pakar Program
            </Button>
          </Stack>
        ) : application.status === 'pending' ? (
          <Stack spacing={2}>
            <Alert severity="info">
              Your application is currently under review. You will receive a notification once a decision is made.
            </Alert>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccessTime />
              <Typography variant="body2" color="text.secondary">
                Typical review time: 3-5 business days
              </Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={fetchApplicationStatus}
              startIcon={<Refresh />}
            >
              Refresh Status
            </Button>
          </Stack>
        ) : application.status === 'approved' ? (
          <Stack spacing={2}>
            <Alert severity="success">
              Congratulations! You can now access Pakar features.
            </Alert>
            <Button
              variant="contained"
              onClick={() => router.push('/pakar/dashboard')}
              startIcon={<School />}
            >
              Go to Pakar Dashboard
            </Button>
          </Stack>
        ) : application.status === 'rejected' ? (
          <Stack spacing={2}>
            <Alert severity="warning">
              Your application was not approved. You can reapply after 30 days.
            </Alert>
            {application.rejectionReason && (
              <Alert severity="info">
                <strong>Feedback:</strong> {application.rejectionReason}
              </Alert>
            )}
            <Button
              variant="outlined"
              onClick={() => router.push('/pakar/apply')}
              disabled={application.canReapplyAfter && new Date(application.canReapplyAfter) > new Date()}
              startIcon={<School />}
            >
              {application.canReapplyAfter && new Date(application.canReapplyAfter) > new Date() 
                ? `Reapply available on ${new Date(application.canReapplyAfter).toLocaleDateString()}`
                : 'Reapply Now'
              }
            </Button>
          </Stack>
        ) : null}

        {/* Timeline */}
        {application && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Application Timeline
            </Typography>
            <Box sx={{ position: 'relative', mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={
                  application.status === 'pending' ? 50 :
                  application.status === 'approved' ? 100 :
                  application.status === 'rejected' ? 100 : 0
                } 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption">Applied</Typography>
                <Typography variant="caption">Under Review</Typography>
                <Typography variant="caption">
                  {application.status === 'approved' ? 'Approved' : 'Decision'}
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default function PakarApplicationStatusPageWrapper() {
  return (
    <ProtectedRoute>
      <PakarApplicationStatusPage />
    </ProtectedRoute>
  );
}
