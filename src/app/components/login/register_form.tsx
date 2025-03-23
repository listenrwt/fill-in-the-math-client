'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Button, TextField, Typography } from '@mui/material';

export default function RegisterForm() {
  const router = useRouter(); // Initialize the router
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Registering with:', { username, password });
    router.push('/login');
  };

  const switchToLogin = () => {
    console.log('Switching to login...');
    router.push('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#FFFFFF',
        p: 3,
        borderRadius: 6,
        boxShadow: 6,
        width: 400,
        fontSize: '1.25rem',
      }}
    >
      <Typography variant="h5" sx={{ color: '#000000', fontWeight: 'bold', mb: 2 }}>
        Register
      </Typography>
      <form style={{ width: '100%' }} onSubmit={handleRegister}>
        <TextField
          fullWidth
          type="email"
          label="Email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: 'white' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />
        <TextField
          fullWidth
          label="Username"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: 'white' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: 'white' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          variant="filled"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: 'white' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          sx={{
            bgcolor: '#262626',
            color: '#B3B3B3',
            '&:hover': { bgcolor: '#1E1E1E', color: 'white' },
            py: 1.5,
            fontWeight: 'bold',
          }}
        >
          Register
        </Button>
      </form>
      <Button
        onClick={switchToLogin}
        sx={{ mt: 2, fontSize: '0.875rem', color: 'blue', textTransform: 'none' }}
      >
        Already have an account? Login
      </Button>
    </Box>
  );
}
