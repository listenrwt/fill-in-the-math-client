'use client';

import React from 'react';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LogoutIcon from '@mui/icons-material/Logout';
import { Button, Grid, Paper, Typography } from '@mui/material';

interface AccountActionsProps {
  handleLogout: () => void;
  setDeleteDialogOpen: (open: boolean) => void;
}

const AccountActions: React.FC<AccountActionsProps> = ({ handleLogout, setDeleteDialogOpen }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Account Actions
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              backgroundColor: 'rgba(66, 133, 244, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(66, 133, 244, 1)',
              },
            }}
          >
            Logout
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Account
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountActions;
