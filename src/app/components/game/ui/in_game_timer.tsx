// You can add more props to the component if needed.
// TODO: Implement Timer component
// Note: Don't forget the timer bar.
import { useEffect, useState } from 'react';

import { Box, LinearProgress, Typography } from '@mui/material';

interface InGameTimerProps {
  duration?: number; // Total time in seconds (default: 30)
}

const InGameTimer = ({ duration = 30 }: InGameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setProgress((prev) => (prev > 0 ? prev - 100 / duration : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Timer Text */}
      <Typography
        variant="h6"
        sx={{
          color: '#ffffff',
          fontWeight: 'bold',
          textAlign: 'center',
        }}
        mb={1}
      >
        Time Left: {timeLeft} {timeLeft === 1 ? 'second' : 'seconds'}
      </Typography>

      {/* Timer Progress Bar */}
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
