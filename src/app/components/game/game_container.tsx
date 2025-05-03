import { Box, Typography } from '@mui/material';

import { Question } from '@/lib/game.types';

import GameAction from './ui/action/game_action';
import CalculatorDisplay from './ui/calculator/calculator_display';
import CalculatorPanel from './ui/calculator/calculator_panel';
import { Stroke } from './ui/stroke';

interface GameContainerProps {
  currentQuestion: Question | null;
  answer: number[];
  setAnswer: (answer: number[]) => void;
  submitAnswer: () => void;
  performHeal: () => void;
  performAttack: (targetId: string) => void;
  canPerformAction: boolean;
  health: number;
}

export default function GameContainer({
  currentQuestion,
  answer,
  setAnswer,
  submitAnswer,
  performHeal,
  performAttack,
  canPerformAction,
}: GameContainerProps) {
  // Show game action UI when the user can perform an action (answered correctly)
  // or show the calculator UI when they need to answer a question

  const handleNumberClick = (num: number) => {
    // Check if this number is already used
    if (answer.includes(num)) return;

    // Add the number to the answer array
    setAnswer([...answer, num]);
  };

  const handleClear = () => {
    setAnswer([]);
  };

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
      <Box sx={{ borderRadius: 2, bgcolor: '#D9D9D9', width: '100%', maxWidth: 1000 }}>
        {canPerformAction ? (
          <GameAction
            onActionComplete={() => {}} // This is handled by the context now
            performAttack={performAttack}
            performHeal={performHeal}
          />
        ) : (
          <>
            {currentQuestion && (
              <CalculatorDisplay
                equation={currentQuestion.equation_arr}
                answer={answer} // Pass the answer array to display selected numbers
              />
            )}
            <Stroke />
            <CalculatorPanel
              onNumberClick={handleNumberClick}
              onClear={handleClear}
              onDeleteLast={handleBackspace}
              onSubmit={submitAnswer}
              usedNumbers={answer}
              equation={currentQuestion?.equation_arr || []} // Pass equation to limit inputs based on blanks
            />
          </>
        )}
      </Box>
      <Typography variant="caption" sx={{ mt: 4 }}>
        Brought to you by: Group B8
      </Typography>
    </Box>
  );
}
