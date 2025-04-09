import { MathSymbol } from '@/types/game.types';

export function generate_text_from_question(equation_arr: (number | MathSymbol)[]) {
  let text = '';
  for (const component of equation_arr) {
    text += component.toString();
    // for number, convert to string
    // for mathsymbol -> implicityly a string type
  }
  return text;
}
