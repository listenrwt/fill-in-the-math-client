// File: components/waiting_room/game_start_controls.tsx
import React from 'react';

import { Box, Button, Grid } from '@mui/material';

interface GameStartControlsProps {
  isHost: boolean;
  gameStatus?: string; // Current game status
  onStart: () => void;
  onLeave: () => void;
  // Callback to show the waiting room panel (player list and settings)
  onPlayAgain?: () => void;
  // Flag to determine if player is dead but game is still in progress
  isViewingLiveGame?: boolean;
}

const GameStartControls: React.FC<GameStartControlsProps> = ({
  isHost,
  gameStatus,
  onStart,
  onLeave,
  onPlayAgain,
  isViewingLiveGame = false,
}) => {
  // Common trapezium-shaped button style.
  const trapeziumStyle = {
    clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)',
    position: 'relative',
    height: '60px',
    width: { xs: '90px', sm: '120px', md: '150px' },
    borderRadius: '0',
  };

  return (
    <Box width="100%" sx={{ textAlign: 'center', position: 'relative' }}>
      <Grid container spacing={2} justifyContent="center">
        {/* Left: Leave Button */}
        <Box sx={{ position: 'absolute', left: 0, bottom: 0 }}>
          <Button
            variant="outlined"
            onClick={onLeave}
            sx={{
              borderColor: '#919191',
              bgcolor: '#919191',
              color: '#1E1E1E',
              '&:hover': {
                borderColor: '#777777',
                backgroundColor: '#777777',
              },
              ...trapeziumStyle,
            }}
          >
            Leave
          </Button>
        </Box>
        {/* Center: Start Button only shows if host and game status is not "Ended" and not viewing live game */}
        <Grid item>
          {isHost && gameStatus !== 'Ended' && !isViewingLiveGame ? (
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

      {/* Bottom-Right Button: Show Lobby button */}
      {isHost && onPlayAgain && (
        <Box sx={{ position: 'absolute', right: 0, bottom: 0 }}>
          <Button
            variant="outlined"
            onClick={onPlayAgain}
            sx={{
              borderColor: 'green',
              bgcolor: 'green',
              color: 'black',
              '&:hover': {
                borderColor: 'darkgreen',
                backgroundColor: 'darkgreen',
              },
              ...trapeziumStyle,
            }}
          >
            Play Again
          </Button>
        </Box>
      )}

      {/* Bottom-Right Button: Display "Spectating" indicator when viewing live game */}
      {isViewingLiveGame && (
        <Box sx={{ position: 'absolute', right: 0, bottom: 0 }}>
          <Button
            disabled
            variant="outlined"
            sx={{
              borderColor: '#1976d2',
              bgcolor: '#1976d2',
              color: 'white',
              opacity: 0.9,
              '&.Mui-disabled': {
                color: 'white',
              },
              ...trapeziumStyle,
            }}
          >
            Spectating
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default GameStartControls;
