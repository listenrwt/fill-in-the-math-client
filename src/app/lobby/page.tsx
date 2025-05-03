'use client';

import React, { useEffect, useState } from 'react';

import { Box, Typography } from '@mui/material';

import GameJoinCenterBox from '../components/lobby/GameJoinCenterBox';
import UserProfile from '../components/lobby/UserProfile';
import { useGameEventsContext } from '../contexts/GameEventsContext';
import useSystemEvents from '../hooks/useSystemEvents';

export default function GameJoinPage() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [avatarId, setAvatarId] = useState(Math.floor(Math.random() * 6) + 1);
  const [experience, setExperience] = useState(0);
  const [isGuest, setIsGuest] = useState(false);
  const { isConnected, connectToServer, setUsername: setContextUsername } = useGameEventsContext();
  const { getUserData } = useSystemEvents();

  // Ensure connection to server when the component mounts
  useEffect(() => {
    if (!isConnected) {
      connectToServer();
    }
  }, [isConnected, connectToServer]);

  // Load user data from the server and update context
  useEffect(() => {
    const fetchUserData = async () => {
      // Check if user is in guest mode
      const guestFlag = localStorage.getItem('isGuest');

      if (guestFlag === 'true') {
        // User is in guest mode
        setIsGuest(true);

        // Get guest username from localStorage
        const guestUsername = localStorage.getItem('guestUsername');

        if (guestUsername) {
          setUsername(guestUsername);
          setContextUsername(guestUsername);
          return;
        }

        // Fallback: generate a new guest username if not found
        const randomNumber = Math.floor(100 + Math.random() * 900);
        const newGuestUsername = `guest_${randomNumber}`;
        setUsername(newGuestUsername);
        setContextUsername(newGuestUsername);
        localStorage.setItem('guestUsername', newGuestUsername);
        return;
      }

      // Not in guest mode, attempt to fetch user data from the server
      const userDataResult = await getUserData();

      if (userDataResult.success && userDataResult.user) {
        // Use the fresh data from the server
        setUsername(userDataResult.user.username);
        setAvatarId(userDataResult.user.profile_picture || 1);
        setExperience(userDataResult.user.experience);

        // Important: Also update the username in the game events context
        setContextUsername(userDataResult.user.username);
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

          // Important: Also update the username in the game events context
          setContextUsername(userData.username || userData.name || '');
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
        }
      }
    };

    fetchUserData();
  }, [getUserData, setContextUsername]);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', minWidth: '100vw' }}>
      {/* Top Right Information Box */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <UserProfile username={username || 'Guest'} avatarId={avatarId} experience={experience} />
      </Box>
      {/* Bottom Left Information Box */}
      <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
        <Typography variant="subtitle1">Created by Group B8</Typography>
      </Box>

      {/* Center Join Box Component */}
      <GameJoinCenterBox
        username={username}
        setUsername={setUsername}
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        isGuest={isGuest}
      />
    </Box>
  );
}
