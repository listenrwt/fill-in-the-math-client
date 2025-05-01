'use client';

import React, { useState } from 'react';

import Link from 'next/link';

import { Box, Button, Grid2, TextField, Typography } from '@mui/material';

import UserProfile from '../components/lobby/UserProfile';

export default function GameJoinPage() {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', minWidth: '100vw' }}>
      {/* Top Right Information Box */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <UserProfile
          username="Bruh"
          avatarId={1}
          experience={10000} // Sample experience value here
        />
      </Box>
      {/* Bottom Left Information Box */}
      <Box sx={{ position: 'absolute', bottom: 16, left: 16 }}>
        <Typography variant="subtitle1">Created by Group B8</Typography>
      </Box>

      {/* Central Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Box
          bgcolor="#ffffff"
          borderRadius={4}
          height={{ xs: '200px', sm: '240px' }}
          width={{ xs: '400px', sm: '600px' }}
        >
          {/* Username Input Box (background white) */}
          <Grid2
            container
            height={{ xs: '100px', sm: '120px' }}
            alignContent={'center'}
            justifyContent="center"
            flexDirection={'row'}
          >
            <Grid2 mt={2.25} mr={0.5}>
              <Typography color="#000000" fontSize={{ xs: '20px', sm: '24px' }} sx={{ mb: 2 }}>
                Username:
              </Typography>
            </Grid2>
            <Grid2>
              <TextField
                variant="outlined"
                placeholder="player 1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    mt: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#262626',
                    height: { xs: '40px', sm: '48px' },
                    width: { xs: '150px', sm: '180px' },
                  },
                }}
              />
            </Grid2>
          </Grid2>

          {/* Bottom Section: 3 Buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Quick Join Button (left) */}
            <Link href="/waiting_room" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  height: { xs: '100px', sm: '120px' },
                  width: { xs: '120px', sm: '144px' },
                  backgroundColor: '#919191',
                  color: '#1E1E1E',
                  borderRadius: '0 0 0 16px',
                  '&:hover': { backgroundColor: '#7a7a7a' },
                }}
              >
                <Typography fontSize={{ xs: '16px', sm: '20px' }} letterSpacing="-1px">
                  Quick&nbsp;Join
                </Typography>
              </Button>
            </Link>

            {/* Host Game Button (center) */}
            <Link href="/waiting_room?host=true" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  height: { xs: '100px', sm: '120px' },
                  width: { xs: '120px', sm: '144px' },
                  backgroundColor: '#919191',
                  color: '#1E1E1E',
                  borderRadius: '0 0 0 0',
                  '&:hover': { backgroundColor: '#7a7a7a' },
                }}
              >
                <Typography fontSize={{ xs: '16px', sm: '20px' }} letterSpacing="-1px">
                  Host&nbsp;Game
                </Typography>
              </Button>
            </Link>

            {/* Join Existing Game Room: Input field above button (right) */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Link href={roomCode ? `/waiting_room?roomId=${roomCode}` : '#'}>
                <Button
                  variant="contained"
                  sx={{
                    height: { xs: '100px', sm: '120px' },
                    width: { xs: '160px', sm: '312px' },
                    backgroundColor: '#919191',
                    color: '#1E1E1E',
                    borderRadius: '0 0 16px 0',
                    '&:hover': { backgroundColor: '#7a7a7a' },
                  }}
                >
                  <Grid2
                    container
                    alignContent={'center'}
                    justifyContent="center"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                  >
                    <Typography
                      fontSize={{ xs: '16px', sm: '20px' }}
                      letterSpacing="-1px"
                      mr={{ xs: '1px', sm: '4px' }}
                      mt={{ sm: '8px' }}
                    >
                      Join&nbsp;Game:
                    </Typography>
                    <TextField
                      variant="outlined"
                      placeholder="Enter code"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#262626',
                          height: { xs: '40px', sm: '48px' },
                          width: { xs: '120px', sm: '155px' },
                        },
                        '& input::placeholder': {
                          letterSpacing: '-1.5px',
                          textAlign: 'center',
                        },
                      }}
                    />
                  </Grid2>
                </Button>
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
