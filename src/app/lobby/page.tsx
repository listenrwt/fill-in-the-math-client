'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button, Grid2, TextField, Typography } from '@mui/material';

export default function LobbyPage() {
  const [roomCode, setRoomCode] = useState('');
  // later change to next.link instead of router, just testing
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and a maximum of 6 characters
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setRoomCode(value);
    }
  };

  const handleSubmit = () => {
    if (roomCode.length === 6) {
      // When a valid 6-digit code is entered, redirect to the waiting room page.
      router.push('/waiting_room');
    } else {
      alert('Please enter a valid 6-digit room code.');
    }
  };

  return (
    <Grid2
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh', backgroundColor: '#000', p: 2 }}
    >
      <Grid2 xs={12} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: '#ffffff', textAlign: 'center' }}>
          Enter Room Code
        </Typography>
      </Grid2>
      <Grid2 xs={12} sx={{ mb: 3 }}>
        <TextField
          value={roomCode}
          onChange={handleChange}
          variant="outlined"
          placeholder="______"
          inputProps={{
            maxLength: 6,
            style: { textAlign: 'center', color: 'white', fontSize: '1.5rem' },
          }}
          sx={{
            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#ffffff' } },
          }}
        />
      </Grid2>
      <Grid2 xs={12}>
        <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: 'green' }}>
          Join Room
        </Button>
      </Grid2>
    </Grid2>
  );
}
