import { QuestionDifficulty } from '../types/game.types';

// Default room settings
export const DEFAULT_ROOM_SETTINGS = {
  USERNAME: 'Player',
  ROOM_NAME: 'Fun Math Room',
  TIME_LIMIT: 60,
  DIFFICULTY: QuestionDifficulty.MEDIUM,
  MAX_PLAYERS: 4,
  ATTACK_DAMAGE: 5,
  HEAL_AMOUNT: 3,
  WRONG_ANSWER_PENALTY: 3,
};
