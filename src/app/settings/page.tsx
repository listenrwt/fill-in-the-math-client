'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  Snackbar,
  Typography,
} from '@mui/material';

import { UserData } from '../../lib/system.types';
import AccountActions from '../components/settings/accountActions';
import ChangeAvatar from '../components/settings/changeAvatar';
import ChangeUsername from '../components/settings/changeUsername';
import ResetPassword from '../components/settings/resetPassword';
// Import new components
import UserProfile from '../components/settings/userProfile';
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
  const [passwordError, setPasswordError] = useState('');

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
              router.push('/');
              setNotification({
                open: true,
                message: 'Please login to access settings',
                severity: 'error',
              });
            }
          } else {
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
        const retryResult = await getUserData();

        if (!retryResult.success || !retryResult.user) {
          console.error('Session validation failed after retry:', retryResult.message);
          if (userData) {
            console.log('Using existing userData to proceed');
            return true;
          }
          setNotification({
            open: true,
            message: 'Your session has expired. Please log in again.',
            severity: 'error',
          });
          setTimeout(() => {
            router.push('/login');
          }, 1500);
          return false;
        } else {
          setUserData(retryResult.user);
          console.log('Second validation attempt succeeded');
        }
      } else {
        setUserData(userResult.user);
      }

      console.log('Session is valid, proceeding with action');
      return true;
    } catch (error) {
      console.error('Error validating session:', error);
      if (userData) {
        console.log('Using existing userData to proceed despite error');
        return true;
      }
      setNotification({
        open: true,
        message: 'Authentication error. Please log in again.',
        severity: 'error',
      });
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
    setPasswordError('');

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
        try {
          localStorage.removeItem('user');
          localStorage.setItem('isGuest', 'true');

          const randomNumber = Math.floor(100 + Math.random() * 900);
          const guestUsername = `guest_${randomNumber}`;
          const randomAvatarId = Math.floor(Math.random() * 6) + 1;

          setUsername(guestUsername);
          setAvatarId(randomAvatarId);
          setNewUsername(guestUsername);
          setSelectedAvatarId(randomAvatarId);
          setUserData(null);

          console.log('Successfully set up guest mode after account deletion');
        } catch (error) {
          console.error('Error setting up guest mode:', error);
        }

        setNotification({
          open: true,
          message: 'Account deleted successfully',
          severity: 'success',
        });

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
        try {
          localStorage.removeItem('user');
          localStorage.setItem('isGuest', 'true');

          const randomNumber = Math.floor(100 + Math.random() * 900);
          const guestUsername = `guest_${randomNumber}`;
          const randomAvatarId = Math.floor(Math.random() * 6) + 1;

          setUsername(guestUsername);
          setAvatarId(randomAvatarId);
          setNewUsername(guestUsername);
          setSelectedAvatarId(randomAvatarId);
          setUserData(null);

          console.log('Successfully set up guest mode after logout');
        } catch (error) {
          console.error('Error setting up guest mode:', error);
        }

        setNotification({
          open: true,
          message: 'Logged out successfully',
          severity: 'success',
        });

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
      <Box justifyContent={{ xs: 'center', md: 'center', lg: 'left' }} display="flex">
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
      </Box>

      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        Account Settings
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <UserProfile userData={userData} selectedAvatarId={selectedAvatarId} />
        </Grid>

        <Grid item xs={12} md={6}>
          <ChangeUsername
            newUsername={newUsername}
            setNewUsername={setNewUsername}
            handleUsernameChange={handleUsernameChange}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ChangeAvatar
            selectedAvatarId={selectedAvatarId}
            handleAvatarChange={handleAvatarChange}
          />
        </Grid>

        <Grid item xs={12}>
          <ResetPassword
            passwordError={passwordError}
            currentPassword={currentPassword}
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            setCurrentPassword={setCurrentPassword}
            setNewPassword={setNewPassword}
            setConfirmPassword={setConfirmPassword}
            handlePasswordReset={handlePasswordReset}
          />
        </Grid>

        <Grid item xs={12}>
          <AccountActions handleLogout={handleLogout} setDeleteDialogOpen={setDeleteDialogOpen} />
        </Grid>
      </Grid>

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
