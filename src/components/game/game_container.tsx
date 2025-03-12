import { MathSymbol } from '@/lib/game/enum';
import { Question } from '@/lib/game/types';

import CalculatorButton from './ui/calculator_button';
import CalculatorDisplay from './ui/calculator_display';
import InGameTimer from './ui/in_game_timer';

// TODO: Implement the GameContainer component, create more components if needed
export default function GameContainer() {
  const question: Question = [
    1,
    MathSymbol.Addition,
    2,
    MathSymbol.Multiplication,
    MathSymbol.Blank,
    MathSymbol.Equals,
    4,
  ];
  return (
    <div>
      <InGameTimer />
      <CalculatorDisplay {...question} />
      <CalculatorButton value={1} text="1" />
    </div>
  );
}
