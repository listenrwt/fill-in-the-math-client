import { Difficulty } from './question.enum';

// Default room settings
export const DEFAULT_ROOM_SETTINGS = {
  USERNAME: 'Player',
  ROOM_NAME: 'Fun Math Room',
  TIME_LIMIT: 60,
  DIFFICULTY: Difficulty.MEDIUM,
  MAX_PLAYERS: 5,
  ATTACK_DAMAGE: 5,
  HEAL_AMOUNT: 3,
  WRONG_ANSWER_PENALTY: 3,
  IS_PUBLIC: false,
};
