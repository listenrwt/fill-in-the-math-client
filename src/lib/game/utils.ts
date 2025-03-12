import { Difficulty, MathSymbol } from './enum';

// TODO: Implement the function generateMathQuestion and finish the Docstring (take lib/game/enum.ts as reference).

// Description: Generate a math question based on the difficulty level.
// The equation should not contain any negative numbers (but ok for intermediate results, e.g. ? - 4 + 3 = 1).
// The equation answer should seat between 0 and 1000.
// The blank answer must be a number between 0 - 9 and without replacement each other.
// There should be only 1 blank or 1 number after MathSymbol.Equals.

// Input: Difficulty
// Easy: only addition and subtraction, only single digit numbers, 1 blank
// Medium: only addition, subtraction, single and double digit numbers, at least one double digit number, 1 - 2 blanks
//         or multiplication and division, single and double digit numbers, 1 blank
// Hard: must contain multiplication or division, 1 - 2 blanks
// Output: Array of numbers and math symbols

// Example: generateMathQuestion(Difficulty.Easy) => [1, MathSymbol.Addition, MathSymbol.Blank, MathSymbol.Equals, 3]

// Please remove the following eslint-disable comment after implementing the function.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateMathQuestion(difficulty: Difficulty): (number | MathSymbol)[] {
  return [1, MathSymbol.Addition, MathSymbol.Blank, MathSymbol.Equals, 3];
}

//TODO: Implement the function checkQuestionValidity and finish the Docstring.

// Description: Check if the math question is valid.

// Example: checkQuestionValidity([1, MathSymbol.Addition, MathSymbol.Blank, MathSymbol.Equals, 3] => true
//          checkQuestionValidity([1, MathSymbol.Addition, 2, MathSymbol.Blank, 3, MathSymbol.Blank]) => false

// Please remove the following eslint-disable comment after implementing the function.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function checkQuestionValidity(question: (number | MathSymbol)[]): boolean {
  return true;
}
