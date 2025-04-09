import { JSX } from 'react';

import { Box, Button, Card, CardContent, Grid, Paper, Typography } from '@mui/material';

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
  // Count the number of blanks in the equation
  const countBlanks = (equation_arr: (number | MathSymbol)[] | undefined): number => {
    if (!equation_arr) return 0;
    return equation_arr.filter((item) => item === MathSymbol.Blank).length;
  };

  // Handle number pad button click
  const handleNumberClick = (num: number) => {
    // Check if this number is already used
    if (answer.includes(num)) return;

    // Add the number to the answer array
    const newAnswer = [...answer, num];
    setAnswer(newAnswer);
  };

  // Handle delete button click
  const handleDelete = () => {
    // Remove the last number
    const newAnswer = [...answer];
    newAnswer.pop();
    setAnswer(newAnswer);
  };

  // Handle clear button click
  const handleClear = () => {
    setAnswer([]);
  };

  // Render the equation with blanks showing current answer
  const renderEquation = () => {
    if (!currentQuestion) return null;

    const parts: JSX.Element[] = [];
    let answerIndex = 0;

    currentQuestion.equation_arr.forEach((item, index) => {
      if (item === MathSymbol.Blank) {
        // Render the blank with the current answer if available
        const answerValue =
          answer[answerIndex] !== undefined ? answer[answerIndex].toString() : '_';
        parts.push(
          <Typography
            key={`blank-${index}`}
            component="span"
            variant="h4"
            sx={{
              fontFamily: 'monospace',
              mx: 1,
              px: 2,
              py: 1,
              bgcolor: 'primary.light',
              borderRadius: 1,
              color: 'primary.contrastText',
            }}
          >
            {answerValue}
          </Typography>
        );
        answerIndex++;
      } else {
        // Render the normal character
        parts.push(
          <Typography
            key={`char-${index}`}
            component="span"
            variant="h4"
            sx={{ fontFamily: 'monospace' }}
          >
            {item}
          </Typography>
        );
      }
    });

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>{parts}</Box>
    );
  };

  // Render the number pad
  const renderNumberPad = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const maxSelections = currentQuestion ? countBlanks(currentQuestion.equation_arr) : 0;

    return (
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={1} sx={{ mb: 2 }}>
          {numbers.map((num) => (
            <Grid item xs={4} key={num}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={
                  answer.includes(num) || answer.length >= maxSelections || canPerformAction
                }
                onClick={() => handleNumberClick(num)}
                sx={{ height: '50px', fontSize: '1.5rem' }}
              >
                {num}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={1}>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleClear}
              disabled={answer.length === 0 || canPerformAction}
              sx={{ height: '50px' }}
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              onClick={handleDelete}
              disabled={answer.length === 0 || canPerformAction}
              sx={{ height: '50px' }}
            >
              Delete
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              onClick={submitAnswer}
              disabled={answer.length < maxSelections || canPerformAction}
              sx={{ height: '50px' }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
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
              <Typography variant="h5" gutterBottom>
                Question:
              </Typography>
              {renderEquation()}
              <Typography variant="body2">
                Fill in the blanks with numbers 1-9. Each number can only be used once.
              </Typography>
            </CardContent>
          </Card>

          {renderNumberPad()}
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
