'use client';

import React, { ReactNode, createContext, useContext } from 'react';

import { LeaderboardEntry, Question, Room, RoomConfig } from '../../lib/game.types';
import { useGameEvents } from '../hooks/useGameEvents';

// Define the type for the context value
interface GameEventsContextValue {
  // State
  isConnected: boolean;
  serverUrl: string;
  username: string;
  roomName: string;
  roomIdToJoin: string;
  roomConfig: RoomConfig;
  currentRoom: Room | null;
  currentQuestion: Question | null;
  answer: number[];
  gameMessage: string;
  health: number;
  canPerformAction: boolean;
  leaderboard: LeaderboardEntry[];

  // State setters
  setServerUrl: (url: string) => void;
  setUsername: (username: string) => void;
  setRoomName: (roomName: string) => void;
  setRoomIdToJoin: (roomId: string) => void;
  handleRoomConfigChange: (
    e: React.ChangeEvent<HTMLInputElement | { name: string; value: unknown }>
  ) => void;
  setAnswer: (answer: number[]) => void;

  // Actions
  createRoom: () => void;
  joinRoom: () => void;
  quickJoin: () => void;
  leaveRoom: () => void;
  deleteRoom: () => void;
  continueGame: () => void;
  updateRoomSettings: () => void;
  connectToServer: () => Promise<void>;
  disconnectFromServer: () => void;
  startGame: () => void;
  restartGame: () => void;
  submitAnswer: () => void;
  performAttack: (targetId: string) => void;
  performHeal: () => void;
}

// Create the context with a default undefined value
const GameEventsContext = createContext<GameEventsContextValue | undefined>(undefined);

// Provider component
export const GameEventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the hook to get all the state and functions
  const gameEvents = useGameEvents();

  return <GameEventsContext.Provider value={gameEvents}>{children}</GameEventsContext.Provider>;
};

// Custom hook for using the context
export const useGameEventsContext = (): GameEventsContextValue => {
  const context = useContext(GameEventsContext);
  if (context === undefined) {
    throw new Error('useGameEventsContext must be used within a GameEventsProvider');
  }
  return context;
};

export default GameEventsContext;
