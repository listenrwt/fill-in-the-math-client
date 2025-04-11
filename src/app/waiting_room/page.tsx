'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Box,
  Button,
  FormControl,
  Grid,
  Grid2,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { Socket, io } from 'socket.io-client';

export default function WaitingRoomPage() {
  const router = useRouter();

  // Define the socket reference with an explicit type allowing null.
  const socketRef = useRef<Socket | null>(null);

  interface Player {
    id?: string;
    name: string;
    isHost: boolean;
  }

  // Room states and settings...
  const [roomName, setRoomName] = useState('Fun math room');
  const [roomId, setRoomId] = useState('u1g92c2');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(true);
  // For testing, set to true
  // In a real application, this would be determined by the server.
  const [timeLimit, setTimeLimit] = useState(30);
  const [difficulty, setDifficulty] = useState('medium');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [attackDamage, setAttackDamage] = useState(5);
  const [healAmount, setHealAmount] = useState(3);
  const [wrongAnswerPenalty, setWrongAnswerPenalty] = useState(3);
  const [countdown, setCountdown] = useState(10);
  const [countdownActive, setCountdownActive] = useState(false);
  const [gameStatus, setGameStatus] = useState('Waiting...'); // 'waiting' or 'starting'

  useEffect(() => {
    // Initialize socket connection with correct port and backend (Node.js)
    socketRef.current = io('http://localhost:3001');
    // Join the room
    socketRef.current.emit('joinRoom', { roomId });

    // Listen for room data updates from the server
    socketRef.current.on('roomData', (data) => {
      setRoomName(data.roomName);
      setRoomId(data.roomId);
      setPlayers(data.players);
      // Assume the server sends currentPlayer data with an isHost flag
      setIsHost(data.currentPlayer?.isHost);
    });

    return () => {
      // Clean up the socket connection on component unmount
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [roomId]);

  // Countdown effect: when active, update the timer every second and navigate to the game page when finished.
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/game');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdownActive, countdown, router]);

  const handleStart = () => {
    if (!isHost) return;
    // Emit the settings to the server to start the game
    socketRef.current?.emit('startGame', {
      timeLimit,
      difficulty,
      maxPlayers,
      attackDamage,
      healAmount,
      wrongAnswerPenalty,
    });
    // Start the 10-second countdown
    setCountdown(10);
    setCountdownActive(true);
    setGameStatus('starting');
  };

  const handleLeave = () => {
    socketRef.current?.emit('leaveRoom', { roomId });
    router.push('/lobby');
  };

  // A helper style for TextFields and FormControl (for number / select settings)
  // to enforce black borders and black input color.
  const textFieldSX = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'black' },
      '&:hover fieldset': { borderColor: 'black' },
      '&.Mui-focused fieldset': { borderColor: 'black' },
    },
    '& input': { color: 'black' },
    '& label': { color: 'black' },
  };
  const FormControlSX = {
    '& .MuiSelect-icon': { color: 'black' },
    '& .MuiSelect-select': { color: 'black' },
    '& .MuiFormLabel-root': { color: 'black' },
    '& .MuiOutlinedInput-root': {
      '& fieldset': { borderColor: 'black' },
      '&:hover fieldset': { borderColor: 'black' },
      '&.Mui-focused fieldset': { borderColor: 'black' },
    },
  };

  return (
    <Grid2 container padding={2} maxWidth={900} margin="auto" borderRadius={2}>
      <Grid2 container bgcolor="#D9D9D9" color="#000000" borderRadius={2}>
        <Grid container>
          {/* Top Section: Room Name and ID */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: '#fff',
                p: 2,
                borderRadius: '8px 8px 0 0',
                textAlign: 'center',
              }}
            >
              <Typography variant="h5">Room: {roomName}</Typography>
              <Typography variant="subtitle1">(ID: {roomId})</Typography>
            </Box>
          </Grid>
          {/* Status Bar */}
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
              }}
            >
              <Typography variant="h6">Status: {gameStatus}</Typography>
            </Box>
          </Grid>
          {/* Players List */}
          <Grid item xs={12}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Players</Typography>
              <List>
                {players.map((player, index) => (
                  <ListItem key={player.id || index}>
                    {player.name} {player.isHost ? '(Host)' : ''}
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* Settings Area */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6">Settings</Typography>
              <Grid container mt={2} spacing={2}>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="Time Limit"
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                    disabled={!isHost}
                    fullWidth
                    sx={textFieldSX}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <FormControl fullWidth disabled={!isHost} sx={FormControlSX}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                      value={difficulty}
                      label="Difficulty"
                      onChange={(e) => setDifficulty(e.target.value)}
                    >
                      <MenuItem value="easy">Easy</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="hard">Hard</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="Max Players"
                    type="number"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                    disabled={!isHost}
                    fullWidth
                    sx={textFieldSX}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="Attack Damage"
                    type="number"
                    value={attackDamage}
                    onChange={(e) => setAttackDamage(parseInt(e.target.value))}
                    disabled={!isHost}
                    fullWidth
                    sx={textFieldSX}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="Heal Amount"
                    type="number"
                    value={healAmount}
                    onChange={(e) => setHealAmount(parseInt(e.target.value))}
                    disabled={!isHost}
                    fullWidth
                    sx={textFieldSX}
                  />
                </Grid>
                <Grid item xs={6} sm={4}>
                  <TextField
                    label="Wrong Answer Penalty"
                    type="number"
                    value={wrongAnswerPenalty}
                    onChange={(e) => setWrongAnswerPenalty(parseInt(e.target.value))}
                    disabled={!isHost}
                    fullWidth
                    sx={textFieldSX}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Game Start Area */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
              {!countdownActive ? (
                <Grid container spacing={2} justifyContent="flex-start">
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={handleStart}
                      disabled={!isHost}
                      sx={{
                        backgroundColor: 'green',
                        '&:hover': { backgroundColor: 'darkgreen' },
                      }}
                    >
                      Start
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleLeave}
                      sx={{
                        borderColor: '#919191',
                        bgcolor: '#919191',
                        color: '#1E1E1E',
                        '&:hover': {
                          backgroundColor: alpha('#919191', 0.8),
                        },
                      }}
                    >
                      Leave
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="h6">Game starting in {countdown}...</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid2>
    </Grid2>
  );
}
