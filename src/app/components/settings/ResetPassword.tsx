'use client';

import React from 'react';

import SaveIcon from '@mui/icons-material/Save';
import { Alert, Button, Paper, TextField, Typography } from '@mui/material';

interface ResetPasswordProps {
  passwordError: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  setCurrentPassword: (value: string) => void;
  setNewPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
  handlePasswordReset: () => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  passwordError,
  currentPassword,
  newPassword,
  confirmPassword,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  handlePasswordReset,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Reset Password
      </Typography>
      {passwordError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {passwordError}
        </Alert>
      )}
      <TextField
        fullWidth
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        variant="outlined"
        error={newPassword !== confirmPassword && confirmPassword !== ''}
        helperText={
          newPassword !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''
        }
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handlePasswordReset}
        startIcon={<SaveIcon />}
        sx={{ mt: 2 }}
      >
        Update Password
      </Button>
    </Paper>
  );
};

export default ResetPassword;
