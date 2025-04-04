import { useState } from 'react';

import { Grid2 } from '@mui/material';

import { MathSymbol } from '@/lib/game/enum';
import { Question } from '@/lib/game/types';

import CalculatorDisplay from './ui/calculator_display';
import CalculatorPanel from './ui/calculator_panel';
import GameAction from './ui/game_action';
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
  const [showGameAction, setShowGameAction] = useState(false);

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

  // Example function to check if the answer is correct
  // For this temporary function, we assume that if there are
  // no blank symbols left in the question, the answer is correct.
  const handleSubmit = () => {
    console.log('Answer submitted');
    if (!question.includes(MathSymbol.Blank)) {
      console.log('Answer is correct. Switching to game actions...');
      setShowGameAction(true);
    } else {
      console.log('Answer is incorrect. Please complete your answer.');
    }
  };

  return (
    <Grid2 container direction="column" justifyContent="center" spacing={2}>
      <Grid2 container direction="row" justifyContent="center" alignItems="center">
        <InGameTimer />
      </Grid2>
      <Grid2 container direction="column" justifyContent="center" alignItems="center" spacing={2}>
        <Grid2>
          {/* Conditionally render: before answer is correct, show the calculator panel.
Once correct, replace it with the game action window. */}
          {showGameAction ? (
            <GameAction
              onActionComplete={() => {
                // Optionally prepare and load the next question.
                setQuestion(initialQuestion); // Or load your actual next question.
                setFilledIndexes([]);
                setShowGameAction(false);
              }}
            />
          ) : (
            <Grid2
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <CalculatorDisplay question={question} />
              <CalculatorPanel
                onNumberClick={handleNumberClick}
                onDelete={handleDelete}
                onDeleteLast={handleBackspace}
                onSubmit={handleSubmit} // Here the confirm button will trigger handleSubmit
              />
            </Grid2>
          )}
        </Grid2>
      </Grid2>
    </Grid2>
  );
}
