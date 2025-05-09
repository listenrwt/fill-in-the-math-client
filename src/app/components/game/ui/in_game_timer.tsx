'use client';

import React, { useEffect, useState } from 'react';

import { Box, LinearProgress, Typography } from '@mui/material';

// Modified: Extended interface to include onTimeChange callback for global timer updates
interface InGameTimerProps {
  duration?: number; // total time in seconds, default: 30
  onTimerComplete?: () => void; // callback for when the timer expires
  onTimeChange?: (time: number) => void; // Added: Callback to update parent's time left state for emergency UI effects
}

const InGameTimer = ({ duration = 30, onTimerComplete, onTimeChange }: InGameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  // Start the timer once on mount.
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
      setProgress((prev) => Math.max(prev - 100 / duration, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  // FIX: Separate useEffect to handle parent state updates
  // This ensures we don't update parent state during render
  useEffect(() => {
    // Now we update the parent's state after our own state has been updated
    if (onTimeChange) {
      onTimeChange(timeLeft);
    }
  }, [timeLeft, onTimeChange]);

  // When timeLeft reaches 0, schedule the parent's callback outside render.
  useEffect(() => {
    if (timeLeft === 0 && onTimerComplete) {
      // Using setTimeout to ensure the callback is executed after the render.
      setTimeout(() => {
        onTimerComplete();
      }, 0);
    }
  }, [timeLeft, onTimerComplete]);

  // Added: Define conditional styles for timer text emergency effects
  let scale = 'scale(1)';
  let textShadow = 'none';
  let animation = 'none';
  if (timeLeft < 5) {
    // Added: under 5 seconds: red glow, 1.5x enlargement, shake animation
    scale = 'scale(1.5)'; // Added: enlarge by 1.5x
    textShadow = '0 0 10px red, 0 0 20px red, 0 0 30px red'; // Added: red emergency glow
    animation = 'shake 0.5s infinite'; // Added: shake animation
  } else if (timeLeft < 10) {
    // Added: under 10 seconds: red glow, 1.3x enlargement
    scale = 'scale(1.3)'; // Added: enlarge by 1.3x
    textShadow = '0 0 10px red, 0 0 20px red'; // Added: red emergency glow
  } else if (timeLeft < 20) {
    // Added: under 20 seconds: yellow glow, 1.3x enlargement
    scale = 'scale(1.3)';
    textShadow = '0 0 10px yellow, 0 0 20px yellow'; // Added: yellow emergency glow
  }
  const timerTextStyles = {
    // Added: Consolidated timer text styles with emergency effects
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: { xs: '24px', md: '28px' },
    transform: scale, // Added: emergency scale effect
    textShadow: textShadow, // Added: emergency glow effect
    animation: animation, // Added: emergency shake effect if applicable
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
        Time Left: {timeLeft} {timeLeft === 1 ? 'second' : 'seconds'}
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
      {/* Added: Global keyframes for the shake animation */}
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
