import { MathSymbol } from './enum';

/**
 * Represents a mathematical question as an array of numbers and mathematical symbols.
 *
 * @example
 * // A question like "2 + 3 = ?"
 * const question: Question = [2, '+', 3, '=', '?'];
 *
 * @typedef {Array<number | MathSymbol>} Question
 */
export type Question = (number | MathSymbol)[];
