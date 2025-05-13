'use client';

import React from 'react';

import SaveIcon from '@mui/icons-material/Save';
import { Button, Paper, TextField, Typography } from '@mui/material';

interface ChangeUsernameProps {
  newUsername: string;
  setNewUsername: (value: string) => void;
  handleUsernameChange: () => void;
}

const ChangeUsername: React.FC<ChangeUsernameProps> = ({
  newUsername,
  setNewUsername,
  handleUsernameChange,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Change Username
      </Typography>
      <TextField
        fullWidth
        label="New Username"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        margin="normal"
        variant="outlined"
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleUsernameChange}
        startIcon={<SaveIcon />}
        sx={{ mt: 2 }}
      >
        Save Username
      </Button>
    </Paper>
  );
};

export default ChangeUsername;
