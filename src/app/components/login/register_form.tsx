'use client';

import { useState } from 'react';

import Link from 'next/link';

//import { useRouter } from 'next/navigation';

import { Box, Button, TextField, Typography } from '@mui/material';

/**
 * RegisterForm Component
 *
 * A component that provides a registration form for new users.
 * It includes input fields for email, username, and password (with confirmation),
 * as well as submission and navigation functionality.
 *
 * @component
 * @example
 * ```tsx
 * <RegisterForm />
 * ```
 *
 * @returns {TSX.Element} A styled registration form with email, username,
 * password inputs, a register button, and a link to switch to the login page.
 *
 * @remarks
 * The form validates that the password and confirmation password match before submission.
 * After successful registration, the user is redirected to the login page.
 */
export default function RegisterForm() {
  // const router = useRouter(); // Initialize the router
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /* Need to implement later:
  1. Email system
  2. Check Username availability
  3. if failed to register, stop the Link to /login
  */
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Registering with:', { username, password });
    // router.push('/login');
  };

  const switchToLogin = () => {
    console.log('Switching to login...');
    //router.push('/login');
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
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: '#000000' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />
        <TextField
          fullWidth
          label="Username"
          variant="filled"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: '#000000' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: '#000000' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          variant="filled"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ bgcolor: '#D9D9D9', borderRadius: 1, input: { color: '#000000' }, mb: 2 }}
          InputLabelProps={{ style: { color: '#262626' } }}
        />
        <Link href={{ pathname: '/login' }}>
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
        </Link>
      </form>
      <Link href={{ pathname: '/login' }}>
        <Button
          onClick={switchToLogin}
          sx={{ mt: 2, fontSize: '0.875rem', color: 'blue', textTransform: 'none' }}
        >
          Already have an account? Login
        </Button>
      </Link>
    </Box>
  );
}
