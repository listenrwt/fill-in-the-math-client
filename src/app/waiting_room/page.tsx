'use client';

import { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Avatar, Button, Grid2, Switch, TextField, Typography } from '@mui/material';
import { Socket, io } from 'socket.io-client';

// Define the Player type
type Player = {
  id: number;
  username: string;
  avatarUrl: string;
};

export default function WaitingRoomPage() {
  // Game time (in seconds) with a default of 30 seconds.
  const [gameTime, setGameTime] = useState(30);
  const [setting1, setSetting1] = useState(false);
  const [setting2, setSetting2] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  // Countdown state: null means no countdown active
  const [countdown, setCountdown] = useState<number | null>(null);

  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to your SocketIO server (update URL if needed)
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    // Listen for player data from the server
    socket.on('playersData', (data: Player[]) => {
      setPlayers(data);
    });

    // Listen for game start event from the server
    socket.on('gameStart', () => {
      setCountdown(10);
    });

    // Temporary sample players until server integration is complete.
    const enemyPlayers: Player[] = [
      { id: 1, username: 'Player1', avatarUrl: '' },
      { id: 2, username: 'Player2', avatarUrl: '' },
      { id: 3, username: 'Player3', avatarUrl: '' },
    ];
    setPlayers(enemyPlayers);

    return () => {
      socket.disconnect();
    };
  }, []);

  // Countdown effect: when countdown is active, decrease it by 1 every second.
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timerInterval = setInterval(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(timerInterval);
    } else if (countdown === 0) {
      // temp router function
      router.push('/game');
    }
  }, [countdown, router]);

  // Emit start game event to the server. The game settings are sent along.
  const handleStartGame = () => {
    if (socketRef.current) {
      // socketRef.current.emit('startGame', { gameTime, setting1, setting2 });
      // TEMP for testing: simulate server response
      setCountdown(10);
    }
  };

  return (
    <Grid2
      container
      sx={{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#000',
        p: 2,
        gap: 2,
      }}
    >
      {/* Title */}
      <Grid2 sx={{ width: { xs: '90%', md: '70%' } }}>
        <Typography variant="h4" sx={{ color: '#ffffff', textAlign: 'center' }}>
          Waiting Room & Settings
        </Typography>
      </Grid2>

      {/* Responsive container for Player List and Game Time/Settings */}
      <Grid2
        container
        sx={{
          display: 'flex',
          width: { xs: '90%', md: '70%' },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: 2,
          backgroundColor: '#262626',
          borderRadius: 2,
          padding: 2,
        }}
      >
        {/* Game Time and Settings Section */}
        {/* On small screens, this section appears below the player list (order: 2).
        On large screens, it appears in the left column (order: 1). 
        Note that the function to limit max time is not implemented */}
        <Grid2
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            order: { xs: 2, md: 1 },
            gap: 2,
          }}
        >
          <TextField
            label="Game Time (seconds)"
            type="number"
            value={gameTime}
            onChange={(e) => setGameTime(Number(e.target.value))}
            variant="outlined"
            InputLabelProps={{ style: { color: '#ffffff' } }}
            sx={{
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'white' },
              },
              maxWidth: '200px',
              width: '100%',
            }}
          />
          <Grid2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography variant="body1" sx={{ color: 'white' }}>
              Setting 1
            </Typography>
            <Switch checked={setting1} onChange={(e) => setSetting1(e.target.checked)} />
          </Grid2>
          <Grid2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography variant="body1" sx={{ color: 'white' }}>
              Setting 2
            </Typography>
            <Switch checked={setting2} onChange={(e) => setSetting2(e.target.checked)} />
          </Grid2>
        </Grid2>

        {/* Player List Section */}
        <Grid2
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            order: { xs: 1, md: 2 },
            width: { xs: '100%', md: 'auto' },
            gap: 1,
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
            Players
          </Typography>
          <Grid2
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
            }}
          >
            {players.map((player) => (
              <Grid2
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Avatar alt={player.username} src={player.avatarUrl || undefined} />
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {player.username}
                </Typography>
              </Grid2>
            ))}
          </Grid2>
        </Grid2>
      </Grid2>

      {/* Start Game Button / Countdown Timer */}
      <Grid2>
        {countdown !== null ? (
          <Typography variant="h6" sx={{ color: 'white' }}>
            Game starts in {countdown} second{countdown === 1 ? '' : 's'}
          </Typography>
        ) : (
          <Button variant="contained" onClick={handleStartGame} sx={{ bgcolor: 'white' }}>
            Start Game
          </Button>
        )}
      </Grid2>

      {/* Footer */}
      <Grid2>
        <Typography variant="caption" sx={{ color: 'white' }}>
          Brought to you by: Group B8
        </Typography>
      </Grid2>
    </Grid2>
  );
}
