import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import {
  Forum,
  Notifications,
  School,
  TrendingUp,
  AccountCircle,
  Logout,
  Dashboard
} from '@mui/icons-material';
import { useState } from 'react';

/**
 * =====================================================
 * Navbar Component (Material UI version)
 * -----------------------------------------------------
 * Navigasi utama aplikasi dengan styling yang lebih baik
 * =====================================================
 */

const Navbar = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  const handleDashboardClick = () => {
    if (user?.role === 'admin') {
      router.push('/admin');
    } else if (user?.role === 'moderator') {
      router.push('/dashboard/moderator');
    } else if (user?.role === 'pakar') {
      router.push('/dashboard/pakar');
    } else {
      router.push('/dashboard/user');
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold'
          }}
        >
          Olion
        </Typography>

        {/* Navigation Links */}
        {isAuthenticated ? (
          <>
            <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
              <Button
                color="inherit"
                startIcon={<Forum />}
                component={Link}
                href="/discussions"
              >
                Discussions
              </Button>
              
              <Button
                color="inherit"
                startIcon={<Notifications />}
                component={Link}
                href="/notifications"
              >
                Notifications
              </Button>
              
              <Button
                color="inherit"
                startIcon={<School />}
                component={Link}
                href="/pakar"
              >
                Pakar
              </Button>
              
              <Button
                color="inherit"
                startIcon={<TrendingUp />}
                component={Link}
                href="/reputation"
              >
                Reputation
              </Button>
            </Box>

            {/* User Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
                Hello, {user?.name || user?.username || user?.email}
              </Typography>
              
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  alt={user?.name}
                  src={user?.avatar}
                >
                  {(user?.name?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleMenuClose(); handleDashboardClick(); }}>
                  <Dashboard sx={{ mr: 1 }} />
                  Dashboard
                </MenuItem>
                
                <MenuItem onClick={() => { handleMenuClose(); router.push('/users'); }}>
                  <AccountCircle sx={{ mr: 1 }} />
                  My Profile
                </MenuItem>
                
                <Divider />
                
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              component={Link}
              href="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              href="/register"
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
