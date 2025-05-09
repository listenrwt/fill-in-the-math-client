'use client';

import React, { useEffect } from 'react';

import { Box, LinearProgress, Typography } from '@mui/material';

import { useGameEventsContext } from '@/app/contexts/GameEventsContext';

// Modified: Interface to include onTimeChange callback for global timer updates
interface InGameTimerProps {
  onTimerComplete?: () => void; // callback for when the timer expires
  onTimeChange?: (time: number) => void; // Callback to update parent's time left state for emergency UI effects
}

const InGameTimer = ({ onTimerComplete, onTimeChange }: InGameTimerProps) => {
  // Get health (timeLeft) and currentRoom from context
  const { health, currentRoom } = useGameEventsContext();

  // Get the maximum time from room config if available
  const maxTime = currentRoom?.config.timeLimit ?? 30;

  // Calculate progress as percentage
  const progress = Math.max((health / maxTime) * 100, 0);

  // FIX: Update parent state when health changes
  // This ensures we don't update parent state during render
  useEffect(() => {
    // Update the parent's state after our own state has been updated
    if (onTimeChange) {
      onTimeChange(health);
    }
  }, [health, onTimeChange]);

  // When health reaches 0, schedule the parent's callback outside render.
  useEffect(() => {
    if (health === 0 && onTimerComplete) {
      // Using setTimeout to ensure the callback is executed after the render.
      setTimeout(() => {
        onTimerComplete();
      }, 0);
    }
  }, [health, onTimerComplete]);

  // Define conditional styles for timer text emergency effects based on health
  let scale = 'scale(1)';
  let textShadow = 'none';
  let animation = 'none';
  if (health < 5) {
    // Under 5 seconds: red glow, 1.5x enlargement, shake animation
    scale = 'scale(1.5)';
    textShadow = '0 0 10px red, 0 0 20px red, 0 0 30px red';
    animation = 'shake 0.5s infinite';
  } else if (health < 10) {
    // Under 10 seconds: red glow, 1.3x enlargement
    scale = 'scale(1.3)';
    textShadow = '0 0 10px red, 0 0 20px red';
  } else if (health < 20) {
    // Under 20 seconds: yellow glow, 1.3x enlargement
    scale = 'scale(1.3)';
    textShadow = '0 0 10px yellow, 0 0 20px yellow';
  }
  const timerTextStyles = {
    // Consolidated timer text styles with emergency effects
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: { xs: '24px', md: '28px' },
    transform: scale,
    textShadow: textShadow,
    animation: animation,
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h6"
        sx={{
          // Original styles merged with added emergency effects via timerTextStyles
          ...timerTextStyles,
        }}
        mb={1}
      >
        Health: {health} {health === 1 ? 'point' : 'points'}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          maxWidth: 1000,
          width: '100%',
          margin: '0 auto',
          bgcolor: '#7F7F7F',
          height: 10,
          borderRadius: 0.5,
          '& .MuiLinearProgress-bar': {
            bgcolor: '#ffffff',
          },
          mb: 2,
        }}
      />
      {/* Global keyframes for the shake animation */}
      <style jsx global>{`
        @keyframes shake {
          0% {
            transform: translate(1px, 1px) rotate(0deg) scale(1.8);
          }
          10% {
            transform: translate(-1px, -2px) rotate(-1deg) scale(1.8);
          }
          20% {
            transform: translate(-3px, 0px) rotate(1deg) scale(1.8);
          }
          30% {
            transform: translate(3px, 2px) rotate(0deg) scale(1.8});
          }
          40% {
            transform: translate(1px, -1px) rotate(1deg) scale(1.8);
          }
          50% {
            transform: translate(-1px, 2px) rotate(-1deg) scale(1.8);
          }
          60% {
            transform: translate(-3px, 1px) rotate(0deg) scale(1.8);
          }
          70% {
            transform: translate(3px, 1px) rotate(-1deg) scale(1.8);
          }
          80% {
            transform: translate(-1px, -1px) rotate(1deg) scale(1.8);
          }
          90% {
            transform: translate(1px, 2px) rotate(0deg) scale(1.8);
          }
          100% {
            transform: translate(1px, -2px) rotate(-1deg) scale(1.8);
          }
      `}</style>
    </Box>
  );
};

export default InGameTimer;
