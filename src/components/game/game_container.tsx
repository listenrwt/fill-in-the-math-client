import { useState } from 'react';

import { Grid2 } from '@mui/material';

import { MathSymbol } from '@/lib/game/enum';
import { Question } from '@/lib/game/types';

import CalculatorDisplay from './ui/calculator_display';
import CalculatorPanel from './ui/calculator_panel';
import InGameTimer from './ui/in_game_timer';

// TODO: Implement the GameContainer component, create more components if needed
export default function GameContainer() {
  // Initial question with multiple blanks
  const initialQuestion: Question = [
    MathSymbol.Blank, // First blank
    MathSymbol.Addition,
    2,
    MathSymbol.Multiplication,
    MathSymbol.Blank, // Second blank
    MathSymbol.Equals,
    MathSymbol.Blank, // Third blank
  ];

  // State to store the question
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [filledIndexes, setFilledIndexes] = useState<number[]>([]);

  // Function to replace only the first available blank
  const handleNumberClick = (num: number) => {
    setQuestion((prevQuestion) => {
      const firstBlankIndex = prevQuestion.indexOf(MathSymbol.Blank);
      if (firstBlankIndex === -1) return prevQuestion; // No blanks left

      // Replace only the first blank
      const newQuestion = prevQuestion.map((item, index) =>
        index === firstBlankIndex ? num : item
      );

      // Track the filled blank position
      setFilledIndexes((prevIndexes) => [...prevIndexes, firstBlankIndex]);

      return newQuestion;
    });
  };

  // Function to clear all blank inputs and reset them to "?"
  const handleDelete = () => {
    setQuestion(initialQuestion);
    setFilledIndexes([]); // Reset tracked indexes
  };

  // Function to remove only the last entered number
  const handleBackspace = () => {
    if (filledIndexes.length === 0) return; // No numbers entered

    setQuestion((prevQuestion) => {
      // Get the last filled blank position
      const lastFilledIndex = filledIndexes[filledIndexes.length - 1];

      // Reset only the last filled blank to "?"
      const newQuestion = [...prevQuestion];
      newQuestion[lastFilledIndex] = MathSymbol.Blank;

      // Remove last filled index from tracking
      setFilledIndexes((prevIndexes) => prevIndexes.slice(0, -1));

      return newQuestion;
    });
  };

  const handleSubmit = () => {
    console.log('Answer submitted');
  };

  return (
    <Grid2 container direction="column" justifyContent="center" alignItems="center" spacing={2}>
      <Grid2>
        <InGameTimer />
      </Grid2>
      <Grid2>
        <CalculatorDisplay question={question} />
      </Grid2>
      <Grid2>
        <CalculatorPanel
          onNumberClick={handleNumberClick}
          onDelete={handleDelete}
          onDeleteLast={handleBackspace}
          onSubmit={handleSubmit}
        />
      </Grid2>
    </Grid2>
  );
}
