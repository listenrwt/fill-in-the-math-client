import { MathSymbol } from '../src/lib/question.enum';
import { generate_text_from_question } from '../src/lib/utili';

describe('Utili', () => {
  describe('generate_text_from_question', () => {
    it('should generate string from an equation array correctly', () => {
      const equation_arr: (number | MathSymbol)[] = [
        1,
        MathSymbol.Addition,
        MathSymbol.Blank,
        MathSymbol.Equals,
        3,
      ];
      const result = generate_text_from_question(equation_arr);
      const correct_output = '1+?=3';
      expect(result).toBe(correct_output);
    });
    it('should generate empty string given an empty array', () => {
      const equation_arr: (number | MathSymbol)[] = [];
      const result = generate_text_from_question(equation_arr);
      const correct_output = '';
      expect(result).toBe(correct_output);
    });
  });
});
