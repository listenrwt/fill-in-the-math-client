'use client';

import { Box, Divider, SxProps } from '@mui/material';

// No changes for the default export below
interface GameContainerProps {
  sx?: SxProps;
}

export default function GameContainer({ sx }: GameContainerProps) {
  return (
    <Divider
      sx={{
        borderBottomWidth: 1.5,
        borderColor: '#000000',
        borderRadius: 1,
        width: '90%',
        alignContent: 'center',
        margin: '0 auto',
        ...sx, // override or add to default styles
      }}
    />
  );
}

// Added: New interface for Stroke props to accept global timeLeft
interface StrokeProps {
  timeLeft?: number; // Added: Global timer state for emergency glow effect in Stroke
}

export function Stroke({ timeLeft }: StrokeProps) {
  // Modified: accept timeLeft prop for emergency glow effect
  return (
    <Box
      sx={{
        height: '1px',
        width: '100%',
        backgroundColor: '#000000',
        opacity: 0.2,
        my: 1,
        // Added: Emergency glow for Stroke (yellow if under 20s, red if under 10s)
        boxShadow:
          timeLeft !== undefined && timeLeft < 20
            ? timeLeft < 10
              ? '0 0 10px red, 0 0 20px red'
              : '0 0 10px yellow, 0 0 20px yellow'
            : 'none',
      }}
    />
  );
}
