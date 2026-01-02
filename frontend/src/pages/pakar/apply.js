// src/pages/pakar/apply.js

'use client';

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  School,
  CheckCircle,
  Description,
  Person,
  ThumbUp,
  EmojiEvents,
  Security,
  Help
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import api from '../../api/base';

const steps = ['Requirements', 'Application', 'Review'];

const PakarApplyPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    field: '',
    yearsOfExperience: '',
    qualifications: '',
    reason: '',
    portfolioUrl: '',
    references: ''
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        userId: user.id,
        status: 'pending'
      };

      // Try multiple endpoint patterns
      let response;
      try {
        response = await api.post('/pakars/apply', payload);
      } catch (err) {
        response = await api.post('/users/apply-pakar', payload);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/user');
      }, 3000);

    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle color="success" sx={{ mr: 1 }} />
              Eligibility Requirements
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <ThumbUp color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Minimum 50 Reputation Points" 
                  secondary={`Your current: ${user?.reputation || 0} points`}
                />
                <Chip 
                  label={user?.reputation >= 50 ? "Met ✓" : "Not met"} 
                  color={user?.reputation >= 50 ? "success" : "default"}
                  size="small"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Description color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="OR Minimum 10 Quality Answers" 
                  secondary="Demonstrated helpfulness to community"
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <Security color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Good Community Standing" 
                  secondary="No recent violations or warnings"
                />
              </ListItem>
            </List>

            <Alert severity="info" sx={{ mt: 3 }}>
              Pakars are trusted community members who provide expert guidance and help maintain quality discussions.
            </Alert>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Description color="primary" sx={{ mr: 1 }} />
              Application Form
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="field"
                  label="Expertise Field *"
                  value={formData.field}
                  onChange={handleInputChange}
                  placeholder="e.g., Agriculture, Technology, Finance"
                  helperText="What specific field are you an expert in?"
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="yearsOfExperience"
                  label="Years of Experience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  type="number"
                  placeholder="e.g., 3"
                  helperText="How many years of professional experience?"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="portfolioUrl"
                  label="Portfolio/LinkedIn URL"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  placeholder="https://"
                  helperText="Optional: Link to your professional profile"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="qualifications"
                  label="Qualifications/Certifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  placeholder="e.g., Degrees, Certifications, Training"
                  helperText="List your relevant qualifications"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="reason"
                  label="Why do you want to become a Pakar? *"
                  value={formData.reason}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  placeholder="Explain your motivation and how you can help the community..."
                  helperText="This is the most important part of your application"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="references"
                  label="References (Optional)"
                  value={formData.references}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  placeholder="Any community members who can vouch for you?"
                  helperText="Mention other Pakars or active community members"
                />
              </Grid>
            </Grid>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <EmojiEvents color="warning" sx={{ mr: 1 }} />
              Review & Submit
            </Typography>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>Application Summary</Typography>
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Field:</Typography>
                    <Typography variant="body2">{formData.field || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary">Experience:</Typography>
                    <Typography variant="body2">{formData.yearsOfExperience || 'Not specified'} years</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Qualifications:</Typography>
                    <Typography variant="body2">{formData.qualifications || 'Not specified'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Motivation:</Typography>
                    <Typography variant="body2">{formData.reason || 'Not specified'}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Alert severity="info" sx={{ mb: 3 }}>
              Your application will be reviewed by our admin team within 3-5 business days. You'll receive a notification once a decision is made.
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Application submitted successfully! Redirecting to dashboard...
              </Alert>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

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
          <School sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Become a Pakar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join our community of experts and help guide discussions
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 4 }}>
          {renderStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || loading}
            onClick={handleBack}
          >
            Back
          </Button>
          
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || success || !formData.field || !formData.reason}
                startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
              >
                {loading ? 'Submitting...' : success ? 'Submitted!' : 'Submit Application'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={(activeStep === 1 && (!formData.field || !formData.reason))}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>

        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>Note:</strong> Pakars are expected to maintain high-quality contributions and adhere to community guidelines. Inactive Pakars may have their status reviewed.
          </Typography>
        </Alert>
      </Paper>
    </Container>
  );
};

export default function PakarApplyPageWrapper() {
  return (
    <ProtectedRoute>
      <PakarApplyPage />
    </ProtectedRoute>
  );
}
