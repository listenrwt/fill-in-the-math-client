'use client';

import { Grid2 } from '@mui/material';

import LoginForm from '../components/login/login_form';

// Remember the guest mode button

export default function Page() {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <LoginForm />
    </Grid2>
  );
}
