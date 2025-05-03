'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Alert, Box, Button, Grid, Snackbar, Typography } from '@mui/material';

import { useGameEventsContext } from './contexts/GameEventsContext';
import useSystemEvents from './hooks/useSystemEvents';

const HomePage = () => {
  const router = useRouter();
  const { connectToServer, setUsername } = useGameEventsContext();
  const { logout } = useSystemEvents();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    // Check if user is logged in on page load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        // Set username in context if user is logged in
        if (userData.username || userData.name) {
          setUsername(userData.username || userData.name);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [setUsername]);

  const handlePlayAsGuest = async () => {
    // Generate a random 5-digit number for the guest username
    const randomNumber = Math.floor(100 + Math.random() * 900);
    const guestUsername = `guest_${randomNumber}`;

    // Set the guest username in context
    setUsername(guestUsername);

    // Store guest flag and username in localStorage
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('guestUsername', guestUsername);

    // Connect to the server before redirecting to lobby
    await connectToServer();
    router.push('/lobby');
  };

  const handleContinueToLobby = async () => {
    // Connect to the server before redirecting to lobby
    await connectToServer();
    router.push('/lobby');
  };

  const handleLogout = async () => {
    // Call logout function from useSystemEvents
    const result = await logout();

    // Clear guest flags if they exist
    localStorage.removeItem('isGuest');
    localStorage.removeItem('guestUsername');

    // Display notification based on result
    setNotification({
      open: true,
      message: result.success ? 'Logged out successfully' : result.message,
      severity: result.success ? 'success' : 'error',
    });

    // Update login state
    if (result.success) {
      setIsLoggedIn(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        minWidth: '100vw',
        padding: 2,
      }}
    >
      {/* Top bar with course title (right) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          mt: 0.5,
        }}
      >
        <Box>
          <Typography sx={{ color: '#ffffff' }}>CSCI3100 Software&nbsp;Engineering</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        {/* Title */}
        <Typography variant="h4" sx={{ color: '#ffffff', mb: 2 }}>
          Fill in the Math
        </Typography>

        {/* Center box with prompt and buttons */}
        <Box
          bgcolor={'#ffffff'}
          width={{ xs: '400px', md: '600px' }}
          height={{ xs: '120px', md: '144px' }}
          borderRadius={2}
        >
          <Typography
            sx={{
              fontSize: { xs: '20px', md: '24px' },
              m: { xs: 1.875, md: 2.25 },
              color: '#000000',
            }}
          >
            {isLoggedIn ? 'welcome back' : 'please select'}
          </Typography>
          <Grid container justifyContent="center">
            {isLoggedIn ? (
              <>
                <Box>
                  <Button
                    onClick={handleContinueToLobby}
                    variant="contained"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      borderRadius: '0 0 0 8px',
                      backgroundColor: '#919191',
                      '&:hover': { backgroundColor: '#7a7a7a' },
                      width: { xs: '200px', md: '300px' },
                      height: { xs: '60px', md: '72px' },
                    }}
                  >
                    Lobby
                  </Button>
                </Box>
                <Box>
                  <Button
                    onClick={handleLogout}
                    variant="contained"
                    fullWidth
                    sx={{
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      borderRadius: '0 0 8px 0',
                      backgroundColor: '#919191',
                      '&:hover': { backgroundColor: '#7a7a7a' },
                      width: { xs: '200px', md: '300px' },
                      height: { xs: '60px', md: '72px' },
                    }}
                  >
                    Logout
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <Button
                    onClick={handlePlayAsGuest}
                    variant="contained"
                    sx={{
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      borderRadius: '0 0 0 8px',
                      backgroundColor: '#919191',
                      '&:hover': { backgroundColor: '#7a7a7a' },
                      width: { xs: '200px', md: '300px' },
                      height: { xs: '60px', md: '72px' },
                    }}
                  >
                    Play&nbsp;as&nbsp;Guest
                  </Button>
                </Box>
                <Box>
                  <Button
                    onClick={() => router.push('/login')}
                    variant="contained"
                    fullWidth
                    sx={{
                      fontSize: { xs: '1rem', md: '1.2rem' },
                      borderRadius: '0 0 8px 0',
                      backgroundColor: '#919191',
                      '&:hover': { backgroundColor: '#7a7a7a' },
                      width: { xs: '200px', md: '300px' },
                      height: { xs: '60px', md: '72px' },
                    }}
                  >
                    Login/Register
                  </Button>
                </Box>
              </>
            )}
          </Grid>
        </Box>
        {/* Title */}
        <Typography variant="h4" sx={{ color: 'transparent', mb: 2 }}>
          .
        </Typography>
      </Box>

      {/* Bottom left information */}
      <Box sx={{ position: 'fixed', bottom: 16, left: 16 }}>
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
