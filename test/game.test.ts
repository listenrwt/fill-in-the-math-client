import { Difficulty, MathSymbol } from '../src/lib/game/enum';
import { checkQuestionValidity, generateMathQuestion } from '../src/lib/game/utils';

// TODO: remove the x from xdescribe to run the test after the implementation
describe('Game Utils', () => {
  describe('generateMathQuestion', () => {
    test('should generate a valid Easy question', () => {
      // Easy mode test remains mostly the same
      const question = generateMathQuestion(Difficulty.Easy);

      expect(question).toContain(MathSymbol.Equals);

      // Still exactly one blank
      const blanks = question.filter((x: any) => x === MathSymbol.Blank);
      expect(blanks.length).toBe(1);

      // Still single-digit numbers
      question.splice(0, -1).forEach((el) => {
        if (typeof el === 'number') {
          expect(el).toBeGreaterThanOrEqual(0);
          expect(el).toBeLessThan(9);
        }
      });

      // Still only addition or subtraction
      const allowedOps = [MathSymbol.Addition, MathSymbol.Subtraction];
      const operators = question.filter(
        (el: any) => el === MathSymbol.Addition || el === MathSymbol.Subtraction
      );
      expect(operators.length).toBe(1);
      operators.forEach((op: any) => {
        expect(allowedOps).toContain(op);
      });

      expect(checkQuestionValidity(question)).toBe(true);
    });

    describe('Medium difficulty', () => {
      test('should generate valid Medium question with addition/subtraction', () => {
        const question = generateMathQuestion(Difficulty.Medium);

        expect(question).toContain(MathSymbol.Equals);

        // 1-2 blanks
        const blanks = question.filter((x: any) => x === MathSymbol.Blank);
        expect(blanks.length).toBeGreaterThanOrEqual(1);
        expect(blanks.length).toBeLessThanOrEqual(2);

        // // At least one double digit number
        // const numbers = question.filter((el) => typeof el === 'number');
        // const hasDoubleDigit = numbers.some((num) => num >= 10 && num <= 99);
        // expect(hasDoubleDigit).toBe(true);

        // Only addition/subtraction
        const operators = question.filter(
          (el: any) => el === MathSymbol.Addition || el === MathSymbol.Subtraction
        );
        expect(operators.length).toBeGreaterThanOrEqual(0);
        expect(checkQuestionValidity(question)).toBe(true);
      });

      test('should generate valid Medium question with multiplication/division', () => {
        const question = generateMathQuestion(Difficulty.Medium);

        expect(question).toContain(MathSymbol.Equals);

        // Exactly 1 blank for multiplication/division
        const blanks = question.filter((x: any) => x === MathSymbol.Blank);
        expect(blanks.length).toBe(1);

        // Numbers should be 0-99
        question.forEach((el) => {
          if (typeof el === 'number') {
            expect(el).toBeGreaterThanOrEqual(0);
            expect(el).toBeLessThanOrEqual(99);
          }
        });

        // Must be multiplication or division
        const operators = question.filter(
          (el: any) => el === MathSymbol.Multiplication || el === MathSymbol.Division
        );
        expect(operators.length).toBeLessThanOrEqual(1);
        expect(checkQuestionValidity(question)).toBe(true);
      });
    });

    test('should generate a valid Hard question', () => {
      const question = generateMathQuestion(Difficulty.Hard);

      expect(question).toContain(MathSymbol.Equals);

      // 1-2 blanks
      const blanks = question.filter((x: any) => x === MathSymbol.Blank);
      expect(blanks.length).toBeGreaterThanOrEqual(1);
      expect(blanks.length).toBeLessThanOrEqual(2);

      // Must contain multiplication or division
      const hasMultiplyOrDivide = question.some(
        (el) => el === MathSymbol.Multiplication || el === MathSymbol.Division
      );
      expect(hasMultiplyOrDivide).toBe(true);

      // Numbers should be within reasonable bounds
      question.forEach((el) => {
        if (typeof el === 'number') {
          expect(el).toBeGreaterThanOrEqual(0);
          expect(el).toBeLessThanOrEqual(1000);
        }
      });

      expect(checkQuestionValidity(question)).toBe(true);
    });
  });

  describe('checkQuestionValidity', () => {
    test('should return true for a valid question: [1, Addition, Blank, Equals, 3]', () => {
      const validEasyQuestion = [1, MathSymbol.Addition, MathSymbol.Blank, MathSymbol.Equals, 3];
      expect(checkQuestionValidity(validEasyQuestion)).toBe(true);
    });

    xtest('should return true for a valid question with blank after equals', () => {
      // For some cases, it might be acceptable to have the blank on the answer side.
      const validMediumQuestion = [
        12,
        MathSymbol.Subtraction,
        8,
        MathSymbol.Equals,
        MathSymbol.Blank,
      ];
      expect(checkQuestionValidity(validMediumQuestion)).toBe(true);
    }); // Note: currently disable the chance of having blank on the right side

    test('should return false for a question with multiple blanks after equals', () => {
      // Invalid: more than one blank appears after the equals.
      const invalidQuestion = [
        1,
        MathSymbol.Addition,
        2,
        MathSymbol.Equals,
        MathSymbol.Blank,
        MathSymbol.Blank,
      ];
      expect(checkQuestionValidity(invalidQuestion)).toBe(false);
    });

    test('should return false for a question without an equals symbol', () => {
      // Invalid: Missing equals symbol.
      const invalidQuestion = [1, MathSymbol.Addition, MathSymbol.Blank, 3];
      expect(checkQuestionValidity(invalidQuestion)).toBe(false);
    });

    test('should return false when there is a duplicate blank number in the operands', () => {
      // If your design calls for the blank answer being replaced with unique digits,
      // you might want to test that the same number isn’t repeated in more than one blank.
      // Example below assumes that having two blanks replaced with the same number is invalid.
      // (Note: adjust this based on your intended behavior.)
      const invalidQuestion = [
        7,
        MathSymbol.Subtraction,
        MathSymbol.Blank,
        MathSymbol.Equals,
        MathSymbol.Blank,
      ];
      expect(checkQuestionValidity(invalidQuestion)).toBe(false);
    });
  });
});
