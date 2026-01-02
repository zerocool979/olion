
// src/pages/pakar/guide.js

'use client';

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  Stack,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ArrowBack,
  School,
  Security,
  EmojiEvents,
  ThumbUp,
  Comment,
  Visibility,
  Timeline,
  Group,
  CheckCircle,
  Help,
  ExpandMore,
  Star,
  TrendingUp,
  Gavel,
  Forum,
  Notifications,
  Rocket,
  Psychology,
  AutoAwesome,
  Description
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import ProtectedRoute from '../../components/ProtectedRoute';

const PakarGuidePage = () => {
  const router = useRouter();

  const benefits = [
    {
      icon: <EmojiEvents />,
      title: 'Verified Badge',
      description: 'Get a special verified badge next to your name',
      color: 'primary.main'
    },
    {
      icon: <Visibility />,
      title: 'Increased Visibility',
      description: 'Your answers appear higher in discussions',
      color: 'info.main'
    },
    {
      icon: <Gavel />,
      title: 'Moderation Tools',
      description: 'Help moderate content in your expertise area',
      color: 'warning.main'
    },
    {
      icon: <Forum />,
      title: 'Private Forum',
      description: 'Access to exclusive Pakar-only discussions',
      color: 'success.main'
    },
    {
      icon: <TrendingUp />,
      title: 'Early Access',
      description: 'Try new features before general release',
      color: 'secondary.main'
    },
    {
      icon: <Psychology />,
      title: 'Thought Leadership',
      description: 'Publish articles and guide community discussions',
      color: 'error.main'
    }
  ];

  const requirements = [
    'Minimum 50 reputation points OR 10+ quality answers',
    'Consistent positive contributions for at least 30 days',
    'No recent community guideline violations',
    'Demonstrated expertise in a specific field',
    'Good communication skills and helpful attitude'
  ];

  const responsibilities = [
    'Provide accurate, helpful answers in your expertise area',
    'Help moderate discussions and flag inappropriate content',
    'Mentor new community members',
    'Participate in Pakar-only discussions and planning',
    'Maintain at least 5 contributions per month',
    'Uphold community guidelines and values'
  ];

  const faqs = [
    {
      question: 'How long does the application process take?',
      answer: 'Applications are typically reviewed within 3-5 business days. You will receive a notification once a decision is made.'
    },
    {
      question: 'Can I apply in multiple expertise areas?',
      answer: 'You can list multiple related fields, but we recommend focusing on your primary area of expertise for your application.'
    },
    {
      question: 'What happens if my application is rejected?',
      answer: 'You can reapply after 30 days. We will provide feedback on areas for improvement.'
    },
    {
      question: 'Is there a review process for existing Pakars?',
      answer: 'Yes, Pakar status is reviewed quarterly based on activity and contribution quality.'
    },
    {
      question: 'Can Pakar status be revoked?',
      answer: 'Yes, for inactivity (less than 2 contributions/month) or violation of community guidelines.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.push('/dashboard/user')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>

      <Paper elevation={2} sx={{ p: { xs: 3, md: 5 }, mb: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <School sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Pakar Program Guide
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            Join Our Community of Experts
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            The Pakar program recognizes trusted community members who consistently provide
            valuable insights and help maintain the quality of discussions.
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<Rocket />}
              onClick={() => router.push('/pakar/apply')}
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #FF5252 30%, #FF7B39 90%)',
                }
              }}
            >
              Apply Now
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Help />}
              onClick={() => router.push('/discussions?filter=unanswered')}
            >
              Browse Questions
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Benefits Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AutoAwesome sx={{ mr: 1, color: 'warning.main' }} />
            Pakar Benefits
          </Typography>
          <Grid container spacing={3}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ fontSize: 40, color: benefit.color, mb: 2 }}>
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Grid container spacing={4}>
          {/* Requirements */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                Eligibility Requirements
              </Typography>
              <List>
                {requirements.map((req, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Star color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={req} />
                  </ListItem>
                ))}
              </List>
              <Alert severity="info" sx={{ mt: 2 }}>
                Meeting these requirements doesn't guarantee acceptance. Applications are reviewed based on overall contribution quality.
              </Alert>
            </Paper>
          </Grid>

          {/* Responsibilities */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Security color="warning" sx={{ mr: 1 }} />
                Pakar Responsibilities
              </Typography>
              <List>
                {responsibilities.map((resp, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <ThumbUp color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={resp} />
                  </ListItem>
                ))}
              </List>
              <Alert severity="warning" sx={{ mt: 2 }}>
                Pakars are expected to maintain regular activity and uphold community standards.
              </Alert>
            </Paper>
          </Grid>
        </Grid>

        {/* Application Process */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Timeline color="primary" sx={{ mr: 1 }} />
            Application Process
          </Typography>
          
          <Grid container spacing={3}>
            {[
              { step: 1, title: 'Check Eligibility', description: 'Ensure you meet the basic requirements', icon: <CheckCircle /> },
              { step: 2, title: 'Submit Application', description: 'Complete the application form with details about your expertise', icon: <Description /> },
              { step: 3, title: 'Admin Review', description: 'Our team reviews your contributions and application', icon: <Group /> },
              { step: 4, title: 'Decision', description: 'You will be notified of the decision within 3-5 days', icon: <Notifications /> },
              { step: 5, title: 'Onboarding', description: 'If approved, complete the Pakar onboarding process', icon: <School /> },
              { step: 6, title: 'Active Participation', description: 'Start contributing as a verified Pakar', icon: <Comment /> }
            ].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.step}>
                <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                  <Chip
                    label={`Step ${item.step}`}
                    color="primary"
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ fontSize: 40, color: 'primary.main', mb: 2 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Help color="info" sx={{ mr: 1 }} />
            Frequently Asked Questions
          </Typography>
          
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Stats/Call to Action */}
        <Paper sx={{ p: 4, mt: 6, textAlign: 'center', bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <Typography variant="h5" gutterBottom>
            Ready to Become a Pakar?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Join over 200 experts helping our community grow and learn.
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<School />}
            onClick={() => router.push('/pakar/apply')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Start Your Application
          </Button>
        </Paper>

        {/* Additional Resources */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Need help? <Button onClick={() => router.push('/discussions/create')} size="small">Ask in Discussions</Button> or <Button onClick={() => router.push('/users')} size="small">Contact an Admin</Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default function PakarGuidePageWrapper() {
  return (
    <ProtectedRoute>
      <PakarGuidePage />
    </ProtectedRoute>
  );
}
