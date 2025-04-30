'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Box, Button, CircularProgress, TextField, Typography } from '@mui/material';

import useSystemEvents from '../../hooks/useSystemEvents';

interface LoginFormProps {
  setNotification: (notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }) => void;
}

/**
 * LoginForm component handles user authentication through a form interface.
 */
export default function LoginForm({ setNotification }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, loading } = useSystemEvents();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setNotification({
        open: true,
        message: 'Email and password are required',
        severity: 'error',
      });
      return;
    }

    // Call login function from PostgreSQL hook
    const result = await login({ email, password });

    if (result.success) {
      setNotification({
        open: true,
        message: 'Login successful! Redirecting to lobby...',
        severity: 'success',
      });

      // Store user info in localStorage or session for auth state
      if (result.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
      }

      // Redirect to lobby after successful login
      setTimeout(() => {
        router.push('/lobby');
      }, 1000);
    } else {
      setNotification({
        open: true,
        message: result.message || 'Login failed',
        severity: 'error',
      });
    }
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
      }}
    >
      <Typography variant="h5" sx={{ color: '#000000', mb: 2 }}>
        Login
      </Typography>

      <form style={{ width: '100%' }} onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="filled"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: '#000000' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
          required
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: '#000000' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
          required
        />

        <Button
          fullWidth
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: '#262626',
            color: '#B3B3B3',
            '&:hover': { bgcolor: '#1E1E1E', color: 'white' },
            py: 1.5,
            fontWeight: 'bold',
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
      </form>
      <Link href={{ pathname: '/register' }}>
        <Button sx={{ mt: 2, fontSize: '0.875rem', color: 'blue', textTransform: 'none' }}>
          Don&#39;t have an account? Register
        </Button>
      </Link>
    </Box>
  );
}
