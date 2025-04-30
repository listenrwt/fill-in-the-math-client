import React from 'react';

import { Box, Button, Grid, alpha } from '@mui/material';

interface GameStartControlsProps {
  isHost: boolean;
  onStart: () => void;
  onLeave: () => void;
}

const GameStartControls: React.FC<GameStartControlsProps> = ({ isHost, onStart, onLeave }) => {
  // Define a common sx style for the trapezium shape
  const trapeziumStyle = {
    clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
    position: 'relative',
    height: '60px',
    width: { xs: '90px', sm: '120px', md: '150px' },
    borderRadius: '0',
  };

  return (
    <Box width="100%" sx={{ textAlign: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        <Box sx={{ position: 'absolute', left: 0, bottom: 0 }}>
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
              ...trapeziumStyle,
            }}
          >
            Leave
          </Button>
        </Box>
        <Grid item>
          {isHost ? (
            <Button
              variant="contained"
              onClick={onStart}
              sx={{
                backgroundColor: 'green',
                '&:hover': { backgroundColor: 'darkgreen' },
                ...trapeziumStyle,
              }}
            >
              Start
            </Button>
          ) : (
            <Box sx={{ visibility: 'hidden' }}>&nbsp;</Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GameStartControls;
