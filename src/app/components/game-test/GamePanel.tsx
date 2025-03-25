import { Box, Button, Card, CardContent, Grid, Paper, TextField, Typography } from '@mui/material';

import socketService from '../../../services/socket.service';
import { Question, Room } from '../../../types/game.types';

interface GamePanelProps {
  currentRoom: Room;
  health: number;
  currentQuestion: Question | null;
  answer: string;
  setAnswer: (answer: string) => void;
  canPerformAction: boolean;
  submitAnswer: () => void;
  performHeal: () => void;
  performAttack: (targetId: string) => void;
}

export const GamePanel = ({
  currentRoom,
  health,
  currentQuestion,
  answer,
  setAnswer,
  canPerformAction,
  submitAnswer,
  performHeal,
  performAttack,
}: GamePanelProps) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Game
      </Typography>
      <Typography variant="h6" color="primary">
        Health: {health}
      </Typography>

      {/* Players health display */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Typography variant="h6">All Players Health:</Typography>
        <Grid container spacing={2}>
          {currentRoom.players.map((player) => (
            <Grid item xs={6} md={3} key={player.id}>
              <Card
                sx={{
                  bgcolor:
                    player.id === socketService.getSocket()?.id
                      ? 'primary.paper'
                      : 'background.paper',
                  p: 1,
                }}
              >
                <Typography variant="body1">
                  {player.username} {player.id === socketService.getSocket()?.id ? '(You)' : ''}
                </Typography>
                <Typography
                  variant="h6"
                  color={
                    player.health > 10
                      ? 'success.main'
                      : player.health > 5
                        ? 'warning.main'
                        : 'error.main'
                  }
                >
                  HP: {player.health}
                </Typography>
                {player.health <= 0 && (
                  <Typography variant="body2" color="error">
                    Eliminated
                  </Typography>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {currentQuestion ? (
        <Box sx={{ mb: 3 }}>
          <Card sx={{ mb: 2, bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Typography variant="h5">Question: {currentQuestion.text}</Typography>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              <TextField
                fullWidth
                label="Your Answer"
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={canPerformAction}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={submitAnswer}
                fullWidth
                disabled={canPerformAction || answer === ''}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : null}

      {canPerformAction && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Choose Action:</Typography>
          <Button variant="contained" color="success" onClick={performHeal} sx={{ mr: 1 }}>
            Heal Yourself (+{currentRoom.config.healAmount})
          </Button>

          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Or Attack:
          </Typography>
          <Grid container spacing={1}>
            {currentRoom.players.map((player) => {
              if (player.id !== socketService.getSocket()?.id && player.health > 0) {
                return (
                  <Grid item key={player.id}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => performAttack(player.id)}
                    >
                      Attack {player.username} (-{currentRoom.config.attackDamage})
                    </Button>
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};
