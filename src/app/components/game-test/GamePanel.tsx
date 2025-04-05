import { Box, Button, Card, CardContent, Grid, Paper, TextField, Typography } from '@mui/material';

import socketService from '../../../services/socket.service';
import { Question, Room } from '../../../types/game.types';
import { MathSymbol } from '../../../types/game.types';

interface GamePanelProps {
  currentRoom: Room;
  health: number;
  currentQuestion: Question | null;
  answer: number[];
  setAnswer: (answer: number[]) => void;
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
  const getDisplayedEquation = (text: string) => {
    if (!text) return [];

    let numBlanks = 0;
    for (const char of text) {
      if (char == MathSymbol.Blank) {
        numBlanks += 1;
      }
    }

    let current_player_answer: number[];
    if (answer.length < numBlanks) current_player_answer = Array(numBlanks);
    else current_player_answer = [...answer];

    function handleChange(index: number, answer: string) {
      current_player_answer[index] = Number(answer);
      // TODO: bug here for setting answer, leading to failure in checking correctness
      setAnswer(current_player_answer);
    }

    const parts = [];
    let part_index = 0;
    let blank_index = 0;

    let current_sub_string = '';
    for (const char of text) {
      // aggregate substring
      if (char != MathSymbol.Blank) {
        current_sub_string += char;
        continue;
      }
      // Add text before the blank
      parts.push(
        <Typography
          key={`text-${part_index}`}
          component="span"
          variant="h4"
          sx={{ fontFamily: 'monospace' }}
        >
          {current_sub_string}
        </Typography>
      );

      current_sub_string = ''; // clear current substring

      // Add the blank input field
      parts.push(
        <TextField
          key={`blank-${blank_index}`}
          variant="outlined"
          inputProps={{ maxLength: 1, readOnly: false }}
          type={'number'}
          value={answer[blank_index]}
          onChange={(e) => handleChange(blank_index, e.target.value)}
        />
      );

      part_index++;
      blank_index++;
    }

    // Add any remaining text
    parts.push(
      <Typography
        key={`text-${part_index}`}
        component="span"
        variant="h4"
        sx={{ fontFamily: 'monospace' }}
      >
        {current_sub_string}
      </Typography>
    );

    parts.push(
      <Grid item xs={4}>
        <Button
          key="button2"
          variant="contained"
          color="primary"
          onClick={submitAnswer}
          fullWidth
          disabled={canPerformAction || answer.length == 0}
        >
          Submit
        </Button>
      </Grid>
    );

    return parts;
  };

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
              <Typography variant="h5">
                Question: {getDisplayedEquation(currentQuestion.text)}
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={2}>
            {
              // Original implementation
              /* <Grid item xs={8}>
              <TextField
                fullWidth
                label="Your Answer"
                type="number"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={canPerformAction}
              />
            </Grid> */
            }
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={submitAnswer}
                fullWidth
                disabled={canPerformAction || answer.length == 0}
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
