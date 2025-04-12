import { Box, Button, Grid, Paper, Typography } from '@mui/material';

import { LeaderboardEntry, Room } from '@/lib/game.types';

import socketService from '../../../services/socket.service';

interface LeaderboardPanelProps {
  leaderboard: LeaderboardEntry[];
  currentRoom: Room | null;
  leaveRoom: () => void;
  deleteRoom?: () => void;
  continueGame?: () => void;
}

export const LeaderboardPanel = ({
  leaderboard,
  currentRoom,
  leaveRoom,
  deleteRoom,
  continueGame,
}: LeaderboardPanelProps) => {
  // Check if there's a tie (multiple players with rank 1)
  const hasTie = leaderboard.filter((entry) => entry.rank === 1).length > 1;

  // Check if the current user is the host of the room
  const isHost = currentRoom?.hostId === socketService.getSocket()?.id;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Leaderboard
      </Typography>

      {hasTie && (
        <Typography variant="subtitle1" sx={{ color: 'secondary.main', mb: 2 }}>
          Game ended in a tie!
        </Typography>
      )}

      <Box component="table" sx={{ width: '100%', mb: 2 }}>
        <Box component="thead">
          <Box component="tr" sx={{ '& th': { p: 1, textAlign: 'left' } }}>
            <Box component="th">Rank</Box>
            <Box component="th">Player</Box>
            <Box component="th">Score</Box>
          </Box>
        </Box>
        <Box component="tbody">
          {leaderboard.map((entry) => (
            <Box
              component="tr"
              key={entry.playerId}
              sx={{
                '& td': { p: 1 },
                bgcolor:
                  entry.playerId === socketService.getSocket()?.id ? 'action.selected' : 'inherit',
              }}
            >
              <Box component="td">{entry.rank}</Box>
              <Box component="td">
                {entry.username}
                {entry.playerId === socketService.getSocket()?.id ? ' (You)' : ''}
              </Box>
              <Box component="td">{entry.score}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Action buttons based on user role */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {isHost ? (
          <>
            <Grid item>
              <Button variant="contained" color="primary" onClick={continueGame}>
                Continue
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="error" onClick={leaveRoom}>
                Leave Room
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="warning" onClick={deleteRoom}>
                Delete Room
              </Button>
            </Grid>
          </>
        ) : (
          <Grid item>
            <Button variant="contained" color="error" onClick={leaveRoom}>
              Leave Room
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
