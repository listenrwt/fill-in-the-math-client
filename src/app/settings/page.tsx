'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LogoutIcon from '@mui/icons-material/Logout';
import SaveIcon from '@mui/icons-material/Save';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';

import { UserData } from '../../lib/system.types';
import avatarMap from '../assets/avatarMap';
import UserAvatar from '../components/UserAvatar';
import { useGameEventsContext } from '../contexts/GameEventsContext';
import useSystemEvents from '../hooks/useSystemEvents';

const SettingsPage = () => {
  const router = useRouter();
  const { setUsername, setAvatarId } = useGameEventsContext();
  const { getUserData, changeUsername, changeAvatar, resetPassword, deleteAccount, logout } =
    useSystemEvents();

  // State
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isClientSide, setIsClientSide] = useState(false);

  // Form fields
  const [newUsername, setNewUsername] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(1);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI states
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordError, setPasswordError] = useState(''); // Refresh user data

  // Load user data on component mount
  useEffect(() => {
    setIsClientSide(true);

    const fetchUserData = async () => {
      try {
        console.log('Fetching user data for settings page...');
        const result = await getUserData();
        console.log('User data fetch result:', result.success);

        if (result.success && result.user) {
          setUserData(result.user);
          setNewUsername(result.user.username);
          setSelectedAvatarId(result.user.profile_picture || 1);
        } else {
          // Attempt to get user data from localStorage as fallback
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUserData(userData);
              setNewUsername(userData.username || '');
              setSelectedAvatarId(userData.profile_picture || 1);
            } catch (parseError) {
              console.error('Error parsing user data from localStorage:', parseError);
              // If localStorage data is invalid, redirect to home
              router.push('/');
              setNotification({
                open: true,
                message: 'Please login to access settings',
                severity: 'error',
              });
            }
          } else {
            // If no user data found in API or localStorage, redirect to home
            router.push('/');
            setNotification({
              open: true,
              message: 'Please login to access settings',
              severity: 'error',
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);

        // Attempt to get user data from localStorage as fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUserData(userData);
            setNewUsername(userData.username || '');
            setSelectedAvatarId(userData.profile_picture || 1);
          } catch (parseError) {
            console.error('Error parsing user data from localStorage:', parseError);
            setNotification({
              open: true,
              message: 'Failed to load user data',
              severity: 'error',
            });
          }
        } else {
          setNotification({
            open: true,
            message: 'Failed to load user data',
            severity: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // Add timeout to prevent getting stuck indefinitely
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('Loading timeout reached, forcing state update');
        setLoading(false);
      }
    }, 5000);

    fetchUserData();

    return () => clearTimeout(timeoutId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to validate session before performing actions
  const validateSessionBeforeAction = async () => {
    try {
      // First, try to use stored data if available
      const storedUser = localStorage.getItem('user');
      if (!userData && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
          setNewUsername(parsedUser.username || '');
          setSelectedAvatarId(parsedUser.profile_picture || 1);
          console.log('Using locally stored user data as fallback');
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
        }
      }

      // Attempt to refresh user data to validate session
      console.log('Validating session before action...');
      const userResult = await getUserData();
      console.log('Session validation result:', userResult);

      if (!userResult.success || !userResult.user) {
        console.warn('First validation attempt failed. Trying again...');

        // Try one more time before concluding the session is invalid
        const retryResult = await getUserData();

        if (!retryResult.success || !retryResult.user) {
          console.error('Session validation failed after retry:', retryResult.message);

          // Try to use localStorage data if available before giving up
          if (userData) {
            console.log('Using existing userData to proceed');
            // Continue with existing data rather than immediately failing
            return true;
          }

          setNotification({
            open: true,
            message: 'Your session has expired. Please log in again.',
            severity: 'error',
          });

          // Redirect to login after a short delay
          setTimeout(() => {
            router.push('/login');
          }, 1500);

          return false;
        } else {
          // Second attempt succeeded
          setUserData(retryResult.user);
          console.log('Second validation attempt succeeded');
        }
      } else {
        // Update local userData with fresh data from server
        setUserData(userResult.user);
      }

      console.log('Session is valid, proceeding with action');
      return true;
    } catch (error) {
      console.error('Error validating session:', error);

      // Try to use localStorage data if available before giving up on error
      if (userData) {
        console.log('Using existing userData to proceed despite error');
        return true;
      }

      setNotification({
        open: true,
        message: 'Authentication error. Please log in again.',
        severity: 'error',
      });

      // Last resort - check if we at least have the user data in local component state
      if (userData) {
        console.log('Using component state userData as last resort fallback');
        return true;
      }

      return false;
    }
  };

  // Handle username change
  const handleUsernameChange = async () => {
    if (!newUsername || newUsername === userData?.username) {
      setNotification({
        open: true,
        message: 'Please enter a new username',
        severity: 'error',
      });
      return;
    }

    if (!userData?.email) {
      setNotification({
        open: true,
        message: 'User email not found',
        severity: 'error',
      });
      return;
    }

    // Validate session before proceeding
    const isSessionValid = await validateSessionBeforeAction();
    if (!isSessionValid) return;

    try {
      console.log('Sending username change request...');
      const result = await changeUsername({
        email: userData.email,
        newUsername,
      });
      console.log('Username change response:', result);

      if (result.success) {
        setUsername(newUsername);
        // Update local userData to reflect changes
        if (userData) {
          setUserData({
            ...userData,
            username: newUsername,
          });
        }
        setNotification({
          open: true,
          message: 'Username updated successfully',
          severity: 'success',
        });
      } else {
        setNotification({
          open: true,
          message: result.message || 'Failed to update username',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating username:', error);
      setNotification({
        open: true,
        message: 'An error occurred while updating username',
        severity: 'error',
      });
    }
  };

  // Handle avatar change
  const handleAvatarChange = async (avatarId: number) => {
    setSelectedAvatarId(avatarId);

    if (!userData?.email) {
      setNotification({
        open: true,
        message: 'User email not found',
        severity: 'error',
      });
      return;
    }

    // Validate session before proceeding
    const isSessionValid = await validateSessionBeforeAction();
    if (!isSessionValid) return;

    try {
      console.log('Sending avatar change request...');
      const result = await changeAvatar({
        email: userData.email,
        newAvatarId: avatarId,
      });
      console.log('Avatar change response:', result);

      if (result.success) {
        setAvatarId(avatarId);
        // Update local userData to reflect changes
        if (userData) {
          setUserData({
            ...userData,
            profile_picture: avatarId,
          });
        }
        setNotification({
          open: true,
          message: 'Avatar updated successfully',
          severity: 'success',
        });
      } else {
        setNotification({
          open: true,
          message: result.message || 'Failed to update avatar',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      setNotification({
        open: true,
        message: 'An error occurred while updating avatar',
        severity: 'error',
      });
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    // Reset error state
    setPasswordError('');

    // Validation
    if (!currentPassword) {
      setPasswordError('Current password is required');
      return;
    }

    if (!newPassword) {
      setPasswordError('New password is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (!userData?.email) {
      setPasswordError('User email not found. Please try logging in again.');
      return;
    }

    // Validate session before proceeding
    const isSessionValid = await validateSessionBeforeAction();
    if (!isSessionValid) return;

    try {
      console.log('Sending password reset request...');
      const result = await resetPassword({
        email: userData?.email || '',
        currentPassword,
        newPassword,
      });
      console.log('Password reset response:', result);

      if (result.success) {
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        setNotification({
          open: true,
          message: 'Password updated successfully',
          severity: 'success',
        });
      } else {
        if (result.message && result.message.includes('auth')) {
          setPasswordError('Authentication failed. Please try logging in again.');
        } else {
          setPasswordError(result.message || 'Failed to update password');
        }
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setPasswordError('An error occurred while updating password');
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!userData?.email) {
      setNotification({
        open: true,
        message: 'User email not found. Please try logging in again.',
        severity: 'error',
      });
      setDeleteDialogOpen(false);
      return;
    }

    // Validate session before proceeding
    const isSessionValid = await validateSessionBeforeAction();
    if (!isSessionValid) {
      setDeleteDialogOpen(false);
      return;
    }

    try {
      console.log('Sending account deletion request...');
      const result = await deleteAccount(userData.email);
      console.log('Account deletion response:', result);

      if (result.success) {
        // Clear user data and set up guest mode
        try {
          // Remove user data from localStorage
          localStorage.removeItem('user');

          // Set guest mode flag
          localStorage.setItem('isGuest', 'true');

          // Generate random guest username and avatar
          const randomNumber = Math.floor(100 + Math.random() * 900);
          const guestUsername = `guest_${randomNumber}`;
          const randomAvatarId = Math.floor(Math.random() * 6) + 1;

          // Update both local state and global context
          setUsername(guestUsername); // Updates the username in GameEventsContext
          setAvatarId(randomAvatarId); // Updates the avatar in GameEventsContext

          // Additionally update local UI state
          setNewUsername(guestUsername);
          setSelectedAvatarId(randomAvatarId);
          setUserData(null); // Clear user data in local state

          console.log('Successfully set up guest mode after account deletion');
        } catch (error) {
          console.error('Error setting up guest mode:', error);
        }

        setNotification({
          open: true,
          message: 'Account deleted successfully',
          severity: 'success',
        });

        // Redirect to home after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setNotification({
          open: true,
          message: result.message || 'Failed to delete account',
          severity: 'error',
        });
      }
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting account:', error);
      setNotification({
        open: true,
        message: 'An error occurred while deleting account',
        severity: 'error',
      });
      setDeleteDialogOpen(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        // Clear user data and set up guest mode
        try {
          // Remove user data from localStorage
          localStorage.removeItem('user');

          // Set guest mode flag
          localStorage.setItem('isGuest', 'true');

          // Generate random guest username and avatar
          const randomNumber = Math.floor(100 + Math.random() * 900);
          const guestUsername = `guest_${randomNumber}`;
          const randomAvatarId = Math.floor(Math.random() * 6) + 1;

          // Update both local state and global context
          setUsername(guestUsername); // Updates the username in GameEventsContext
          setAvatarId(randomAvatarId); // Updates the avatar in GameEventsContext

          // Additionally update local UI state
          setNewUsername(guestUsername);
          setSelectedAvatarId(randomAvatarId);
          setUserData(null); // Clear user data in local state

          console.log('Successfully set up guest mode after logout');
        } catch (error) {
          console.error('Error setting up guest mode:', error);
        }

        setNotification({
          open: true,
          message: 'Logged out successfully',
          severity: 'success',
        });

        // Redirect to home after a short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setNotification({
          open: true,
          message: result.message || 'Failed to logout',
          severity: 'error',
        });
      }
    } catch (error) {
      console.error('Error logging out:', error);
      setNotification({
        open: true,
        message: 'An error occurred while logging out',
        severity: 'error',
      });
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false,
    });
  };

  // Show loading spinner while data is being fetched
  if (loading || !isClientSide) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        variant="contained"
        sx={{
          mb: 4,
          backgroundColor: 'rgba(66, 133, 244, 0.8)',
          '&:hover': {
            backgroundColor: 'rgba(66, 133, 244, 1)',
          },
        }}
      >
        Back to Lobby
      </Button>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        Account Settings
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Profile
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <UserAvatar avatarId={selectedAvatarId} size={80} />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6">{userData?.username}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {userData?.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Experience: {userData?.experience || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Username Change Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Change Username
            </Typography>
            <TextField
              fullWidth
              label="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleUsernameChange}
              startIcon={<SaveIcon />}
              sx={{ mt: 2 }}
            >
              Save Username
            </Button>
          </Paper>
        </Grid>

        {/* Avatar Selection Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Change Avatar
            </Typography>
            <Grid container spacing={1}>
              {Object.entries(avatarMap).map(([id]) => (
                <Grid item key={id}>
                  <Box
                    sx={{
                      p: 1,
                      border:
                        selectedAvatarId === Number(id)
                          ? '3px solid #4285F4'
                          : '3px solid transparent',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                    onClick={() => handleAvatarChange(Number(id))}
                  >
                    <UserAvatar avatarId={Number(id)} size={50} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Password Reset Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Reset Password
            </Typography>
            {passwordError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {passwordError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              error={newPassword !== confirmPassword && confirmPassword !== ''}
              helperText={
                newPassword !== confirmPassword && confirmPassword !== ''
                  ? 'Passwords do not match'
                  : ''
              }
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handlePasswordReset}
              startIcon={<SaveIcon />}
              sx={{ mt: 2 }}
            >
              Update Password
            </Button>
          </Paper>
        </Grid>

        {/* Logout and Delete Account Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Account Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: 'rgba(66, 133, 244, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(66, 133, 244, 1)',
                    },
                  }}
                >
                  Logout
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  startIcon={<DeleteForeverIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Account
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be undone and all your
            data will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SettingsPage;
