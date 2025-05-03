'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Button, Grid2, TextField, Typography } from '@mui/material';

import { useGameEventsContext } from '../../contexts/GameEventsContext';

export interface GameJoinCenterBoxProps {
  username: string;
  setUsername: (value: string) => void;
  roomCode: string;
  setRoomCode: (value: string) => void;
  isGuest?: boolean;
}

const GameJoinCenterBox: React.FC<GameJoinCenterBoxProps> = ({
  username,
  setUsername,
  roomCode,
  setRoomCode,
  isGuest = false,
}) => {
  const router = useRouter();
  const {
    setUsername: setContextUsername,
    setRoomIdToJoin,
    createRoom,
    joinRoom,
    quickJoin,
    currentRoom,
  } = useGameEventsContext();

  // When currentRoom changes and is not null, navigate to waiting room
  useEffect(() => {
    if (currentRoom) {
      router.push('/waiting_room');
    }
  }, [currentRoom, router]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow changing username if not in guest mode
    if (!isGuest) {
      const newUsername = e.target.value;
      setUsername(newUsername);
      setContextUsername(newUsername); // Update the context as well
    }
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomCode(e.target.value);
  };

  const handleQuickJoin = () => {
    setContextUsername(username);
    quickJoin();
  };

  const handleHostGame = () => {
    setContextUsername(username);
    createRoom();
  };

  const handleJoinGame = () => {
    if (!roomCode) return;

    setContextUsername(username);
    setRoomIdToJoin(roomCode);
    joinRoom();
  };

  return (
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
        {/* Username Input Box */}
        <Grid2
          container
          height={{ xs: '100px', sm: '120px' }}
          alignContent="center"
          justifyContent="center"
          flexDirection="row"
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
              onChange={handleUsernameChange}
              // Make the field read-only if in guest mode
              inputProps={{
                readOnly: isGuest,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  mt: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#262626',
                  height: { xs: '40px', sm: '48px' },
                  width: { xs: '150px', sm: '180px' },
                  // Show a visual indicator that the field is read-only when in guest mode
                  opacity: isGuest ? 0.8 : 1,
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
          <Button
            variant="contained"
            onClick={handleQuickJoin}
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

          {/* Host Game Button (center) */}
          <Button
            variant="contained"
            onClick={handleHostGame}
            sx={{
              height: { xs: '100px', sm: '120px' },
              width: { xs: '120px', sm: '144px' },
              backgroundColor: '#919191',
              color: '#1E1E1E',
              borderRadius: '0',
              '&:hover': { backgroundColor: '#7a7a7a' },
            }}
          >
            <Typography fontSize={{ xs: '16px', sm: '20px' }} letterSpacing="-1px">
              Host&nbsp;Game
            </Typography>
          </Button>

          {/* Join Existing Game Room (right) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                height: { xs: '100px', sm: '120px' },
                width: { xs: '160px', sm: '312px' },
                backgroundColor: '#919191',
                color: '#1E1E1E',
                borderRadius: '0 0 16px 0',
                '&:hover': { backgroundColor: '#7a7a7a' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={handleJoinGame}
            >
              <Grid2
                container
                alignContent="center"
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
                  onChange={handleRoomCodeChange}
                  onClick={(e) => e.stopPropagation()} // Prevent button click when clicking on the text field
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
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default GameJoinCenterBox;
