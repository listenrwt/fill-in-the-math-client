import { Box, Typography } from '@mui/material';

import { Question } from '@/lib/game.types';

import GameAction from './ui/action/game_action';
import CalculatorDisplay from './ui/calculator/calculator_display';
import CalculatorPanel from './ui/calculator/calculator_panel';
import { Stroke } from './ui/stroke';

// Extended interface to include timeLeft for emergency effects and loading state
interface GameContainerProps {
  currentQuestion: Question | null;
  answer: number[];
  setAnswer: (answer: number[]) => void;
  submitAnswer: () => void;
  performHeal: () => void;
  performAttack: (targetId: string) => void;
  canPerformAction: boolean;
  health: number;
  timeLeft?: number; // Global time left for emergency UI effects
  isLoadingQuestion?: boolean; // Whether a new question is being loaded
}

export default function GameContainer({
  currentQuestion,
  answer,
  setAnswer,
  submitAnswer,
  performHeal,
  performAttack,
  canPerformAction,
  timeLeft, // Global time left for emergency effects
  isLoadingQuestion = false, // Whether a new question is being loaded
}: GameContainerProps) {
  // Existing functions
  const handleNumberClick = (num: number) => {
    if (answer.includes(num)) return;
    setAnswer([...answer, num]);
  };

  const handleClear = () => setAnswer([]);
  const handleBackspace = () => {
    if (answer.length === 0) return;
    setAnswer(answer.slice(0, -1));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      {/* Added: Outer wrapper Box for emergency glow.
          - Uses a non-inset boxShadow so the glow appears outside.
          - Adds borderRadius and overflow visible so the glow follows container curves */}
      <Box
        sx={{
          borderRadius: 2, // Added: Ensures the glow follows the rounded corners
          overflow: 'visible', // Added: Prevents clipping of the glow effect
          width: '95%',
          maxWidth: 1000,
          boxShadow:
            timeLeft !== undefined && timeLeft < 20
              ? timeLeft < 10
                ? '0 0 20px red'
                : '0 0 20px yellow'
              : 'none', // Modified: Uses external glow (no inset)
          animation:
            timeLeft !== undefined && timeLeft < 20
              ? timeLeft < 10
                ? 'emergencyGlowRed 1s infinite'
                : 'emergencyGlowYellow 1s infinite'
              : 'none', // Added: Animation for a pulsating glow effect
        }}
      >
        {/* Existing inner container with background */}
        <Box sx={{ borderRadius: 2, bgcolor: '#D9D9D9', width: '100%', maxWidth: 1000 }}>
          {canPerformAction ? (
            <GameAction
              onActionComplete={() => {}}
              performAttack={performAttack}
              performHeal={performHeal}
            />
          ) : isLoadingQuestion ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                p: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  mb: 2,
                  animation: 'pulse 1.5s infinite',
                  '@keyframes pulse': {
                    '0%': {
                      opacity: 0.6,
                    },
                    '50%': {
                      opacity: 1,
                    },
                    '100%': {
                      opacity: 0.6,
                    },
                  },
                }}
              >
                Loading new question...
              </Typography>
              <Typography variant="body1">Get ready for the next challenge!</Typography>
            </Box>
          ) : (
            <>
              {currentQuestion && (
                <CalculatorDisplay equation={currentQuestion.equation_arr} answer={answer} />
              )}
              {/* Pass the timeLeft prop to Stroke for its emergency glow */}
              <Stroke timeLeft={timeLeft} />
              <CalculatorPanel
                onNumberClick={handleNumberClick}
                onClear={handleClear}
                onDeleteLast={handleBackspace}
                onSubmit={submitAnswer}
                usedNumbers={answer}
                equation={currentQuestion?.equation_arr || []}
                disabled={isLoadingQuestion}
              />
            </>
          )}
        </Box>
      </Box>
      <Typography variant="caption" sx={{ mt: 4 }}>
        Brought to you by: Group B8
      </Typography>
      {/* Added: Global keyframes for emergency glow animation in GameContainer */}
      <style jsx global>{`
        @keyframes emergencyGlowYellow {
          0% {
            box-shadow: 0 0 5px yellow;
          }
          50% {
            box-shadow: 0 0 20px yellow;
          }
          100% {
            box-shadow: 0 0 5px yellow;
          }
        }
        @keyframes emergencyGlowRed {
          0% {
            box-shadow: 0 0 5px red;
          }
          50% {
            box-shadow: 0 0 20px red;
          }
          100% {
            box-shadow: 0 0 5px red;
          }
        }
      `}</style>
    </Box>
  );
}
