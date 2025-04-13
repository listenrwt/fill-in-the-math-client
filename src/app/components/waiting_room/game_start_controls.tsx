import React from 'react';

import { Box, Button, Grid, Typography, alpha } from '@mui/material';

interface GameStartControlsProps {
  countdownActive: boolean;
  countdown: number;
  isHost: boolean;
  onStart: () => void;
  onLeave: () => void;
}

const GameStartControls: React.FC<GameStartControlsProps> = ({
  countdownActive,
  countdown,
  isHost,
  onStart,
  onLeave,
}) => {
  return (
    <Box sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
      {!countdownActive ? (
        <Grid container spacing={2} justifyContent="flex-start">
          <Grid item>
            <Button
              variant="contained"
              onClick={onStart}
              disabled={!isHost}
              sx={{
                backgroundColor: 'green',
                '&:hover': { backgroundColor: 'darkgreen' },
              }}
            >
              Start
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              onClick={onLeave}
              sx={{
                borderColor: '#919191',
                bgcolor: '#919191',
                color: '#1E1E1E',
                '&:hover': {
                  backgroundColor: alpha('#919191', 0.8),
                },
              }}
            >
              Leave
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h6">Game starting in {countdown}...</Typography>
      )}
    </Box>
  );
};

export default GameStartControls;
