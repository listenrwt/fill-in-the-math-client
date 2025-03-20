import { blank_difficulty_mapping, operator_difficulty_mapping } from './dictionary';
import { Difficulty, MathSymbol } from './enum';
import { Question } from './types';

export function randint(min: number, max: number = NaN): number {
  if (Number.isNaN(max)) {
    // if only one integer as input, set max = input and min = 0
    max = min;
    min = 0;
  }
  // return output in range [min, max] inclusive
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const isNumber = (val: any) => typeof val === 'number' && val === val; // check for type and NaN

/**
 * generate math question randomly given difficulty
 *
 * @param difficulty - string in [easy, medium, hard]
 * @returns {Array}, Array of numbers and math symbols, e.g. [1, MathSymbol.Addition, MathSymbol.Blank, MathSymbol.Equals, 3]
 *
 * Details:
 * Easy: only addition and subtraction, only single digit numbers, 1 blank
 * Medium: only addition, subtraction, single and double digit numbers, at least one double digit number, 1 - 2 blanks
 *          or multiplication and division, single and double digit numbers, 1 blank
 * Hard: must contain multiplication or division, 1 - 2 blanks
 *
 * Example: generateMathQuestion(Difficulty.Easy) => [1, MathSymbol.Addition, MathSymbol.Blank, MathSymbol.Equals, 3]
 * @Remark
 * The equation should not contain any negative numbers (but ok for intermediate results, e.g. ? - 4 + 3 = 1).
 * The equation answer should seat between 0 and 1000.
 * The blank answer must be a number between 0 - 9 and without replacement each other.
 * There should be only 1 blank or 1 number after MathSymbol.Equals
 */
export function generateMathQuestion(difficulty: Difficulty): Question {
  // Generate random operators
  //const operators: Operator[] = ['+', '-', '*', '/'];
  const operators = operator_difficulty_mapping[difficulty];
  const numOperations = randint(2, 3); // 2-3 operations
  const selectedOperators: string[] = []; // storing operator only

  for (let i = 0; i < numOperations; i++) {
    let randomIndex = randint(operators.length - 1);
    if (difficulty == 'hard' && i == 0) {
      // algorithm: for hard, pick from multiplication and division first
      randomIndex = randint(2, 3);
    }
    // Otherwise: pick from all 4 operators
    selectedOperators.push(operators[randomIndex]);
  }

  const include_mul_div: boolean =
    selectedOperators.includes('*') || selectedOperators.includes('/');

  // Generate numbers to use in the equation
  const numbers: number[] = [];

  for (let i = 0; i < numOperations + 1; i++) {
    // Ensure division operations result in whole numbers
    if (i > 0 && selectedOperators[i - 1] === '/') {
      // Find divisors of the previous number
      const divisors = [];
      for (let j = 1; j <= 9; j++) {
        if (numbers[i - 1] % j === 0) {
          divisors.push(j);
        }
      }
      if (divisors.length > 0) {
        const randomDivisor = divisors[Math.floor(Math.random() * divisors.length)];
        numbers.push(randomDivisor);
      } else {
        // If no proper divisors, change the operation
        selectedOperators[i - 1] = '+';
        numbers.push(Math.floor(Math.random() * 9) + 1);
      }
    } else {
      numbers.push(Math.floor(Math.random() * 9) + 1);
    }
  }

  // Calculate the result on right hand side
  let result = numbers[0];
  for (let i = 0; i < selectedOperators.length; i++) {
    const op = selectedOperators[i];
    const num = numbers[i + 1];

    switch (op) {
      case '+':
        result += num;
        break;
      case '-':
        result -= num;
        break;
      case '*':
        result *= num;
        break;
      case '/':
        result /= num;
        break;
    }
  }
  // Create the equation array
  const equation_arr: any[] = [numbers[0]];
  for (let i = 0; i < selectedOperators.length; i++) {
    equation_arr.push(selectedOperators[i]);
    equation_arr.push(numbers[i + 1]);
  } // num, operator, num, operator
  equation_arr.push(MathSymbol.Equals);
  equation_arr.push(result);

  // Decide how many blanks to create
  // Easy: 1 blank
  // Medium: only addition, subtraction, single and double digit numbers, at least one double digit number, 1 - 2 blanks
  //         or multiplication and division, single and double digit numbers, 1 blank
  // Hard: 1 - 2 blanks
  let numBlanks = blank_difficulty_mapping[difficulty];

  if (difficulty == 'medium' && include_mul_div) {
    // override for medium to 1 if multiplication/division case
    numBlanks = 1;
  }

  // Create blanks array with positions and values
  const allPositions = [];

  // Collect all possible positions for blanks (each single digit in the equation)
  let pos = 0;

  for (const char of equation_arr) {
    if (/\d/.test(char)) {
      // if is number: add a valid position
      allPositions.push(pos);
    }
    pos++;
  }

  // Randomly select positions for blanks
  const selectedPositions = [];
  for (let i = 0; i < numBlanks; i++) {
    if (allPositions.length > 0) {
      const randomIndex = Math.floor(Math.random() * allPositions.length);
      const position = allPositions[randomIndex];
      selectedPositions.push(position);
      allPositions.splice(randomIndex, 1);
    }
  }

  // Create blanks with positions and values
  for (const position of selectedPositions) {
    equation_arr[position] = MathSymbol.Blank;
  }

  return equation_arr;
}

/**
 * Check if the math question is valid.
 *
 * @param {Question} question, containing the question equation with blanks
 * @returns {Boolean}, whether the question is valid (see below)
 *
 * Example: checkQuestionValidity([1, MathSymbol.Addition, MathSymbol.Blank, MathSymbol.Equals, 3] => true
 *         checkQuestionValidity([1, MathSymbol.Addition, 2, MathSymbol.Blank, 3, MathSymbol.Blank]) => false
 * Details:
 * For the input question array,
 * 1. length of question >= 3 (sufficient condition for LHS, equals, RHS)
 * 2. RHS must be a number
 * 3. Contain 1 and only 1 equal sign;
 * 4. Contain >= 1 blank;
 * 5. Contain >= 2 number;
 */
export function checkQuestionValidity(question: Question): boolean {
  // case 1: length is smaller than 3 (insufficient for LHS, equals, RHS)
  if (question.length < 3) {
    return false;
  }
  // case 2: check if value of RHS is a number
  if (!isNumber(question[-1])) {
    return false;
  }

  // case 3, 4. 5: equal, blank, number check
  // counting number of equal, blank, and numbers
  let count_equal = 0;
  let count_blank = 0;
  let count_number = 0;
  for (const char of question) {
    if (char == MathSymbol.Equals) count_equal++;
    else if (char == MathSymbol.Blank) count_blank++;
    else if (isNumber(char)) count_number++;
  }

  // equal: only 1 equal;
  // blank: >= 1 blank;
  // number: at least include one number on left and one number on right
  const any_incorrect_count: boolean =
    !(count_equal == 1) || !(count_blank >= 1) || !(count_number >= 2);

  if (any_incorrect_count) {
    return false;
  }

  return true;
}
