'use client';

import { useState } from 'react';

import { Grid2 } from '@mui/material';
import { Alert, Snackbar } from '@mui/material';

import LoginForm from '../components/login/login_form';

export default function Page() {
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleClose = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh' }}
    >
      <LoginForm setNotification={setNotification} />
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Grid2>
  );
}
