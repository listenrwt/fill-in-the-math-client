'use client';

import { Grid2 } from '@mui/material';

import RegisterForm from '../components/login/register_form';

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
      <RegisterForm />
    </Grid2>
  );
}
