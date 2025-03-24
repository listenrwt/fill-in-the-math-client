'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Button, TextField, Typography } from '@mui/material';

/**
 * LoginForm component handles user authentication through a form interface.
 *
 * @component
 * @returns {TSX.Element} A material-ui styled login form with username and password fields
 *
 * Features:
 * - Username and password input fields
 * - Login button that currently logs credentials to console
 * - Registration redirect button
 * - Styled using Material-UI components
 *
 * @example
 * ```tsx
 * <LoginForm />
 * ```
 *
 * Dependencies:
 * - Material-UI components (Box, Typography, TextField, Button)
 * - React useState hook
 * - Next.js useRouter hook
 */
export default function LoginForm() {
  const router = useRouter(); // Initialize the router
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Logging in with:', { username, password });

    // to be implemented later, to main page
    router.push('/login');
  };

  const switchToRegister = () => {
    console.log('switching from login page to register page...');
    router.push('/register');
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
          label="Username"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: 'white' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />

        <TextField
          fullWidth
          label="Password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          Login
        </Button>
      </form>
      <Button
        onClick={switchToRegister}
        sx={{ mt: 2, fontSize: '0.875rem', color: 'blue', textTransform: 'none' }}
      >
        Don&#39;t have an account? Register
      </Button>
    </Box>
  );
}
