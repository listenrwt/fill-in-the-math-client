import { randint } from './utils';

export const blank_difficulty_mapping = {
  easy: 1,
  medium: randint(1, 2),
  hard: randint(1, 2),
};

export const operator_difficulty_mapping = {
  easy: ['+', '-'],
  medium: ['+', '-', '*', '/'],
  hard: ['+', '-', '*', '/'],
  // Easy: only addition and subtraction, only single digit numbers, 1 blank
  // Medium: only addition, subtraction, single and double digit numbers, at least one double digit number, 1 - 2 blanks
  //         or multiplication and division, single and double digit numbers, 1 blank
  // Hard: must contain multiplication or division, 1 - 2 blanks
};
