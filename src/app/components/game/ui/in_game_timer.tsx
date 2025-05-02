'use client';

import React, { useEffect, useState } from 'react';

import { Box, LinearProgress, Typography } from '@mui/material';

interface InGameTimerProps {
  duration?: number; // total time in seconds, default: 30
  onTimerComplete?: () => void; // callback for when the timer expires
}

const InGameTimer = ({ duration = 30, onTimerComplete }: InGameTimerProps) => {
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

  // When timeLeft reaches 0, schedule the parent's callback outside render.
  useEffect(() => {
    if (timeLeft === 0 && onTimerComplete) {
      // Using setTimeout to ensure the callback is executed after the render.
      setTimeout(() => {
        onTimerComplete();
      }, 0);
    }
  }, [timeLeft, onTimerComplete]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h6"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: { xs: '24px', md: '28px' },
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
    </Box>
  );
};

export default InGameTimer;
