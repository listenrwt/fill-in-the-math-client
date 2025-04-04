'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Grid2, Switch, TextField, Typography } from '@mui/material';

{
  /*This is just a temporary page, style and UI format & router-dom to be changed*/
}

export default function WaitingRoomPage() {
  const [timer, setTimer] = useState(0); // timer function to be implemented
  const [setting1, setSetting1] = useState(false);
  const [setting2, setSetting2] = useState(false);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const router = useRouter(); // temporary router function
  const handleStartGame = () => {
    router.push('/game'); // replace with your game route
  };

  return (
    <Grid2
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh', backgroundColor: '#000', p: 2 }}
      spacing={2}
    >
      <Grid2>
        <Typography variant="h4" sx={{ color: '#ffffff', textAlign: 'center' }}>
          Waiting Room & Settings
        </Typography>
      </Grid2>
      <Grid2 container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Grid2>
          <TextField
            label="Player 1"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: '#ffffff' } }}
            sx={{
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
            }}
          />
        </Grid2>
        <Grid2>
          <TextField
            label="Player 2"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            sx={{
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'white' } },
            }}
          />
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Grid2>
          <Typography variant="body1" sx={{ color: 'white' }}>
            Timer: {timer} minute(s)
          </Typography>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={4} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
        <Grid2>
          <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
            Setting 1
          </Typography>
          <Switch
            checked={setting1}
            onChange={(e) => setSetting1(e.target.checked)}
            sx={{ color: 'white' }}
          />
        </Grid2>
        <Grid2 item>
          <Typography variant="body1" sx={{ color: 'white', textAlign: 'center' }}>
            Setting 2
          </Typography>
          <Switch
            checked={setting2}
            onChange={(e) => setSetting2(e.target.checked)}
            sx={{ color: 'white' }}
          />
        </Grid2>
      </Grid2>

      <Grid2>
        <Button variant="contained" onClick={handleStartGame} sx={{ bgcolor: 'white' }}>
          Start Game
        </Button>
      </Grid2>

      <Grid2>
        <Typography variant="caption" sx={{ color: 'white' }}>
          Brought to you by: Group B8
        </Typography>
      </Grid2>
    </Grid2>
  );
}
