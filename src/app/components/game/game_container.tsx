import { useState } from 'react';

import { Box, Typography } from '@mui/material';

import { MathSymbol } from '@/lib/question.enum';
import { Question } from '@/lib/question.types';

import GameAction from './ui/action/game_action';
import CalculatorDisplay from './ui/calculator/calculator_display';
import CalculatorPanel from './ui/calculator/calculator_panel';
import Stroke from './ui/stroke';

export default function GameContainer() {
  const initialQuestion: Question = [
    MathSymbol.Blank,
    MathSymbol.Subtraction,
    6,
    MathSymbol.Addition,
    MathSymbol.Blank,
    MathSymbol.Equals,
    2,
  ];

  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [filledIndexes, setFilledIndexes] = useState<number[]>([]);
  const [usedNumbers, setUsedNumbers] = useState<number[]>([]);
  const [showGameAction, setShowGameAction] = useState(false);

  const handleNumberClick = (num: number) => {
    setQuestion((prevQuestion) => {
      const firstBlankIndex = prevQuestion.indexOf(MathSymbol.Blank);
      if (firstBlankIndex === -1) return prevQuestion;

      const newQuestion = prevQuestion.map((item, index) =>
        index === firstBlankIndex ? num : item
      );

      setFilledIndexes((prevIndexes) => [...prevIndexes, firstBlankIndex]);
      // Add the number to usedNumbers list
      setUsedNumbers((prev) => [...prev, num]);

      return newQuestion;
    });
  };

  const handleClear = () => {
    setQuestion(initialQuestion);
    setFilledIndexes([]);
    setUsedNumbers([]);
  };

  const handleBackspace = () => {
    if (filledIndexes.length === 0) return;

    setQuestion((prevQuestion) => {
      const lastFilledIndex = filledIndexes[filledIndexes.length - 1];
      // Get the number being removed to also remove it from usedNumbers
      const numberBeingRemoved = prevQuestion[lastFilledIndex];

      const newQuestion = [...prevQuestion];
      newQuestion[lastFilledIndex] = MathSymbol.Blank;

      setFilledIndexes((prevIndexes) => prevIndexes.slice(0, -1));
      // Remove the number from usedNumbers list
      setUsedNumbers((prev) =>
        prev.filter((_, i) => i !== prev.indexOf(numberBeingRemoved as number))
      );

      return newQuestion;
    });
  };

  const handleSubmit = () => {
    if (!question.includes(MathSymbol.Blank)) {
      setShowGameAction(true);
    }
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
        {showGameAction ? (
          <GameAction
            onActionComplete={() => {
              setQuestion(initialQuestion);
              setFilledIndexes([]);
              setUsedNumbers([]);
              setShowGameAction(false);
            }}
          />
        ) : (
          <>
            <CalculatorDisplay question={question} />
            <Stroke />
            <CalculatorPanel
              onNumberClick={handleNumberClick}
              onClear={handleClear}
              onDeleteLast={handleBackspace}
              onSubmit={handleSubmit}
              usedNumbers={usedNumbers}
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
