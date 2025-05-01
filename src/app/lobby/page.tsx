'use client';

import React, { useState } from 'react';

import { Box, Typography } from '@mui/material';

import GameJoinCenterBox from '../components/lobby/File: GameJoinCenterBox';
import UserProfile from '../components/lobby/UserProfile';

export default function GameJoinPage() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', minWidth: '100vw' }}>
      {/* Top Right Information Box */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <UserProfile username="Bruh" avatarId={1} experience={14000} />
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
      />
    </Box>
  );
}
