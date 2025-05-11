'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { Alert, Box, Button, CircularProgress, Snackbar, Typography } from '@mui/material';

import GameJoinCenterBox from './components/lobby/GameJoinCenterBox';
import UserProfile from './components/lobby/UserProfile';
import { useGameEventsContext } from './contexts/GameEventsContext';
import useSystemEvents from './hooks/useSystemEvents';

const HomePage = () => {
  const router = useRouter();
  const {
    username,
    avatarId,
    isConnected,
    connectToServer,
    setUsername,
    currentRoom,
    setAvatarId,
  } = useGameEventsContext();
  const { getUserData, logout } = useSystemEvents();
  // Use stable initial values for server-side rendering
  const [isClientSide, setIsClientSide] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [experience, setExperience] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Mark when client-side code is running and handle initialization
  useEffect(() => {
    setIsClientSide(true);

    const fetchUserData = async () => {
      try {
        // First, attempt to fetch user data from the server
        const userDataResult = await getUserData();

        if (userDataResult.success && userDataResult.user) {
          // User is logged in - use the fresh data from the server
          setUsername(userDataResult.user.username);
          setAvatarId(userDataResult.user.profile_picture || 1);
          setExperience(userDataResult.user.experience);
          setIsLoggedIn(true);
          setIsGuest(false);

          // Make sure to remove any guest flag since user is authenticated
          localStorage.removeItem('isGuest');
          return;
        }

        // If server data fetch failed, check if user is in guest mode
        const guestFlag = localStorage.getItem('isGuest');

        if (guestFlag === 'true') {
          // User is in guest mode - always generate a new random guest username and avatar
          setIsGuest(true);
          setIsLoggedIn(false);

          // Generate random avatar ID only on client side
          const randomAvatarId = Math.floor(Math.random() * 6) + 1;
          setAvatarId(randomAvatarId);

          // Always generate a new random guest username
          const randomNumber = Math.floor(100 + Math.random() * 900);
          const newGuestUsername = `guest_${randomNumber}`;
          setUsername(newGuestUsername);
          return;
        }

        // Fallback to localStorage if server request fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUsername(userData.username || userData.name || '');
            setAvatarId(userData.profile_picture || 1);
            setExperience(userData.experience || 0);
            setIsLoggedIn(true);
            setIsGuest(false);
          } catch (error) {
            console.error('Error parsing user data from localStorage:', error);
            // Set as guest since we couldn't get user data
            handlePlayAsGuest();
          }
        } else {
          // No user data found, set as guest
          handlePlayAsGuest();
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Set default guest if anything fails
        handlePlayAsGuest();
      }
    };

    // Ensure connection to server when on client-side
    if (!isConnected) {
      connectToServer();
    }

    fetchUserData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect to waiting room if we're already in a room
  useEffect(() => {
    if (isClientSide && currentRoom) {
      router.push('/waiting_room');
    }
  }, [currentRoom, router, isClientSide]);

  const handlePlayAsGuest = async () => {
    // Only run this if we're on client side
    if (!isClientSide) return;

    // Generate a random 3-digit number for the guest username
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const guestUsername = `guest_${randomNumber}`;

    // Generate a random avatar ID for guest
    const randomAvatarId = Math.floor(Math.random() * 6) + 1;
    setAvatarId(randomAvatarId);

    // Set the guest username in context
    setUsername(guestUsername);
    setIsGuest(true);
    setIsLoggedIn(false);

    // Store only the guest flag in localStorage (not the username)
    try {
      localStorage.setItem('isGuest', 'true');
      // We no longer store guestUsername in localStorage
    } catch (error) {
      console.error('Error storing guest data:', error);
    }

    // Make sure we're connected to the server
    await connectToServer();
  };

  const handleLogout = async () => {
    // Call logout function from useSystemEvents
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

        // Update the context directly
        setUsername(guestUsername);
        setAvatarId(randomAvatarId);
        setExperience(0);

        // Update local state for UI
        setIsGuest(true);
        setIsLoggedIn(false);

        console.log('Successfully set up guest mode after logout');
      } catch (error) {
        console.error('Error setting up guest mode:', error);
      }
    }

    // Display notification based on result
    setNotification({
      open: true,
      message: result.success ? 'Logged out successfully' : result.message,
      severity: result.success ? 'success' : 'error',
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  // Show a loading spinner while client-side code is initializing
  if (!isClientSide) {
    return (
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          minWidth: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', minWidth: '100vw' }}>
      {/* Top Right Information Box */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <UserProfile username={username || 'Guest'} avatarId={avatarId} experience={experience} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
          {isLoggedIn ? (
            <>
              <Button
                variant="contained"
                onClick={handleSettings}
                startIcon={<SettingsIcon />}
                sx={{
                  backgroundColor: 'rgba(76, 175, 80, 0.8)',
                  color: '#ffffff',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                Settings
              </Button>
              <Button
                variant="contained"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleLogin}
              startIcon={<LoginIcon />}
              sx={{
                backgroundColor: 'rgba(66, 133, 244, 0.8)',
                color: '#ffffff',
                borderRadius: '20px',
                padding: '8px 16px',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(66, 133, 244, 1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Box>
      {/* Login/Logout Controls */}
      <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}></Box>
      {/* Center Join Box Component */}
      <GameJoinCenterBox
        username={username}
        setUsername={setUsername}
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        isGuest={isGuest}
        avatarId={avatarId}
      />

      {/* Bottom Left Information Box */}
      <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
        <Typography variant="body1" sx={{ color: '#ffffff' }}>
          Created by Group B8 <br></br> 1155194693&nbsp;Kwok&nbsp;Ka&nbsp;Ming&nbsp;|
          1155194687&nbsp;Lau&nbsp;Tsun&nbsp;Shing&nbsp;|
          1155190674&nbsp;Nagi&nbsp;Ka&nbsp;Shing&nbsp;|
          <br></br>1155189319&nbsp;Cheng&nbsp;Jonathan&nbsp;Yue&nbsp;Ming |
          1155192782&nbsp;Chan&nbsp;Jackson&nbsp;|
        </Typography>
      </Box>

      {/* Notification for logout results */}
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
    </Box>
  );
};

export default HomePage;
