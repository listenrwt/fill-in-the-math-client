import { Question } from '@/lib/game/types';

// You can add more props to the component if needed.

// Display the question to the user properly with provided question]
// Example: [1, MathSymbol.Addition , 2, MathSymbol.Multiplication, MathSymbol.Blank, MathSymbol.Equals, 4]
// Result: 1 + 2 * ? = 4
const CalculatorDisplay = (question: Question) => {
  return <>{question}</>;
};

export default CalculatorDisplay;
