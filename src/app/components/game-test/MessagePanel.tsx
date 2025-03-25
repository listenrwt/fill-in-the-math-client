import { Box, Paper, Typography } from '@mui/material';

interface MessagePanelProps {
  gameMessage: string;
}

export const MessagePanel = ({ gameMessage }: MessagePanelProps) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Game Messages
      </Typography>
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.default',
          borderRadius: 1,
          minHeight: 100,
          mb: 2,
        }}
      >
        {gameMessage}
      </Box>
    </Paper>
  );
};
