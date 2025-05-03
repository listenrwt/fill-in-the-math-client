import { act, renderHook } from '@testing-library/react';

import { Difficulty, MathSymbol } from '@/lib/question.enum';

import { useConnectionEvents } from '../src/app/hooks/useConnectionEvents';
// Import act
import { useGameEvents } from '../src/app/hooks/useGameEvents';
import { useRoomEvents } from '../src/app/hooks/useRoomEvents';
import { GameEvents } from '../src/events/events';
// Import GameEvents
import { AnswerResultResponse, QuestionResponse } from '../src/events/game.events';
// Import necessary types and enums
import { ActionType, Room, RoomConfig, RoomStatus } from '../src/lib/game.types';
// Import QuestionResponse
import { Question } from '../src/lib/game.types';
import socketService from '../src/services/socket.service';

// Import Question type

// Mock dependencies
jest.mock('../src/services/socket.service', () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  getSocket: jest.fn(() => ({ id: 'test-socket-id' })),
}));
// Mock the utility function as well, if the hook uses it directly
jest.mock('@/lib/utili', () => ({
  generate_text_from_question: jest.fn((eq) => eq?.join(' ') ?? ''),
}));

// Typecast mocks for easier usage
const mockSocketService = socketService as jest.Mocked<typeof socketService>;
const mockUseConnectionEvents = useConnectionEvents as jest.Mock;
const mockUseRoomEvents = useRoomEvents as jest.Mock;

// Default mock return values - Define these outside mocks for reuse
const defaultMockRoomConfig: RoomConfig = {
  timeLimit: 60,
  Difficulty: Difficulty.EASY,
  maxPlayers: 4,
  attackDamage: 10,
  healAmount: 5,
  wrongAnswerPenalty: 5,
  isPublic: true,
};

const defaultConnectionState = {
  isConnected: true, // Assume connected for action tests
  serverUrl: 'ws://localhost:3001',
  setServerUrl: jest.fn(),
  connectToServer: jest.fn(),
  disconnectFromServer: jest.fn(),
};

const defaultRoomState = {
  username: 'testuser',
  setUsername: jest.fn(),
  roomName: 'testroom',
  setRoomName: jest.fn(),
  roomIdToJoin: '',
  setRoomIdToJoin: jest.fn(),
  roomConfig: { ...defaultMockRoomConfig }, // Use a copy
  handleRoomConfigChange: jest.fn(),
  // Start with null room, set it per test if needed
  currentRoom: null as Room | null,
  gameMessage: '',
  setCurrentRoom: jest.fn((update) => {
    // Basic mock implementation for state setter
    if (typeof update === 'function') {
      defaultRoomState.currentRoom = update(defaultRoomState.currentRoom);
    } else {
      defaultRoomState.currentRoom = update;
    }
  }),
  setGameMessage: jest.fn(),
  createRoom: jest.fn(),
  joinRoom: jest.fn(),
  quickJoin: jest.fn(),
  leaveRoom: jest.fn(),
  deleteRoom: jest.fn(),
  continueGame: jest.fn(),
  updateRoomSettings: jest.fn(),
};

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks(); // Clear all mock calls and instances

  // Reset mock implementations to defaults
  mockUseConnectionEvents.mockReturnValue({ ...defaultConnectionState });
  mockUseRoomEvents.mockReturnValue({ ...defaultRoomState, currentRoom: null }); // Reset room specifically
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mockSocketService.getSocket.mockReturnValue({ id: 'test-socket-id' } as any);
});

jest.mock('../src/app/hooks/useConnectionEvents'); // Keep mocks at top level
jest.mock('../src/app/hooks/useRoomEvents');

describe('useGameEvents Hook', () => {
  it('should initialize with default game state', () => {
    // Arrange: Ensure mocks return default disconnected state for this test
    mockUseConnectionEvents.mockReturnValue({ ...defaultConnectionState, isConnected: false });
    mockUseRoomEvents.mockReturnValue({ ...defaultRoomState, currentRoom: null });

    const { result } = renderHook(() => useGameEvents());

    // Assert initial game-specific state
    expect(result.current.currentQuestion).toBeNull();
    expect(result.current.answer).toEqual([]);
    expect(result.current.health).toBe(0);
    expect(result.current.canPerformAction).toBe(false);
    expect(result.current.leaderboard).toEqual([]);

    // Assert functions are defined
    expect(result.current.startGame).toBeInstanceOf(Function);
    expect(result.current.restartGame).toBeInstanceOf(Function);
    expect(result.current.submitAnswer).toBeInstanceOf(Function);
    expect(result.current.performAttack).toBeInstanceOf(Function);
    expect(result.current.performHeal).toBeInstanceOf(Function);
  });

  it('should emit START_GAME when startGame is called and conditions met', () => {
    // Arrange: Set up connected state and a current room
    const mockRoom: Room = {
      id: 'room1',
      name: 'Test Room',
      players: [],
      status: RoomStatus.WAITING,
      config: defaultMockRoomConfig,
      hostId: 'host1',
    };
    mockUseConnectionEvents.mockReturnValue({ ...defaultConnectionState, isConnected: true });
    mockUseRoomEvents.mockReturnValue({ ...defaultRoomState, currentRoom: mockRoom });

    const { result } = renderHook(() => useGameEvents());

    // Act
    act(() => {
      result.current.startGame();
    });

    // Assert
    expect(mockSocketService.emit).toHaveBeenCalledTimes(1);
    expect(mockSocketService.emit).toHaveBeenCalledWith(GameEvents.START_GAME, { roomId: 'room1' });
  });

  it('should not emit START_GAME if not connected', () => {
    // Arrange: Not connected, but have a room
    const mockRoom: Room = {
      id: 'room1',
      name: 'Test Room',
      players: [],
      status: RoomStatus.WAITING,
      config: defaultMockRoomConfig,
      hostId: 'host1',
    };
    mockUseConnectionEvents.mockReturnValue({ ...defaultConnectionState, isConnected: false }); // Not connected
    mockUseRoomEvents.mockReturnValue({ ...defaultRoomState, currentRoom: mockRoom });

    const { result } = renderHook(() => useGameEvents());

    // Act
    act(() => {
      result.current.startGame();
    });

    // Assert
    expect(mockSocketService.emit).not.toHaveBeenCalled();
  });

  it('should not emit START_GAME if not in a room', () => {
    // Arrange: Connected, but no room
    mockUseConnectionEvents.mockReturnValue({ ...defaultConnectionState, isConnected: true });
    mockUseRoomEvents.mockReturnValue({ ...defaultRoomState, currentRoom: null }); // No room

    const { result } = renderHook(() => useGameEvents());

    // Act
    act(() => {
      result.current.startGame();
    });

    // Assert
    expect(mockSocketService.emit).not.toHaveBeenCalled();
  });

  it('should emit SUBMIT_ANSWER when submitAnswer is called', () => {
    // Arrange: Connected, in a room, assume question and answer are set
    const mockRoom: Room = {
      id: 'room1',
      name: 'Test Room',
      players: [],
      status: RoomStatus.IN_PROGRESS,
      config: defaultMockRoomConfig,
      hostId: 'host1',
    };
    mockUseConnectionEvents.mockReturnValue({ ...defaultConnectionState, isConnected: true });
    mockUseRoomEvents.mockReturnValue({ ...defaultRoomState, currentRoom: mockRoom });

    const { result } = renderHook(() => useGameEvents());

    // Find the handler registered for QUESTION_RECEIVED
    const questionReceivedHandler = mockSocketService.on.mock.calls.find(
      (call) => call[0] === GameEvents.QUESTION_RECEIVED
    )?.[1];

    if (!questionReceivedHandler) {
      throw new Error('QUESTION_RECEIVED handler not found');
    }

    // Act: Simulate receiving a question and setting the answer
    const mockQuestion: Question = {
      id: 'q1',
      equation_arr: [2, MathSymbol.Addition, MathSymbol.Blank, MathSymbol.Equals, 7],
      difficulty: Difficulty.EASY,
    };
    const mockQuestionResponse: QuestionResponse = {
      question: mockQuestion,
      timestamp: 0,
    };

    act(() => {
      // Simulate the event that sets the question internally
      questionReceivedHandler(mockQuestionResponse);
      // Set the answer using the returned setter
      result.current.setAnswer([5]);
    });

    // Act: Call submitAnswer
    act(() => {
      result.current.submitAnswer();
    });

    // Assert
    expect(mockSocketService.emit).toHaveBeenCalledTimes(1); // Only submitAnswer should emit
    expect(mockSocketService.emit).toHaveBeenCalledWith(GameEvents.SUBMIT_ANSWER, {
      roomId: 'room1',
      questionId: 'q1', // Question ID from the simulated event
      answer: [5],
    });
    // Optionally check if the answer was reset after submission (depends on event simulation)
    // expect(result.current.answer).toEqual([]); // This might require simulating ANSWER_RESULT too
  });

  it('should emit PERFORM_ACTION with ATTACK when performAttack is called after correct answer', () => {
    // Arrange: Connected, in a room
    const mockRoom: Room = {
      id: 'room1',
      name: 'Test Room',
      players: [],
      status: RoomStatus.IN_PROGRESS,
      config: defaultMockRoomConfig,
      hostId: 'host1',
    };
    mockUseConnectionEvents.mockReturnValue({ ...defaultConnectionState, isConnected: true });
    mockUseRoomEvents.mockReturnValue({ ...defaultRoomState, currentRoom: mockRoom });

    const { result } = renderHook(() => useGameEvents());

    // Find the handler registered for ANSWER_RESULT
    const answerResultHandler = mockSocketService.on.mock.calls.find(
      (call) => call[0] === GameEvents.ANSWER_RESULT
    )?.[1];

    if (!answerResultHandler) {
      throw new Error('ANSWER_RESULT handler not found');
    }

    // Act: Simulate receiving a CORRECT answer result to enable action
    const mockCorrectAnswerResponse: AnswerResultResponse = {
      correct: true,
      correctAnswer: 5, // Example correct answer
      canPerformAction: true,
      timestamp: 0,
    };
    act(() => {
      answerResultHandler(mockCorrectAnswerResponse);
    });

    // Check if action is now allowed
    expect(result.current.canPerformAction).toBe(true);

    // Act: Call performAttack
    act(() => {
      result.current.performAttack('target-player-id');
    });

    // Assert
    expect(mockSocketService.emit).toHaveBeenCalledTimes(1); // Only performAttack should emit in this phase
    expect(mockSocketService.emit).toHaveBeenCalledWith(GameEvents.PERFORM_ACTION, {
      roomId: 'room1',
      actionType: ActionType.ATTACK,
      targetPlayerId: 'target-player-id',
    });
    // Check if action was disabled again after use
    expect(result.current.canPerformAction).toBe(false);
  });

  it('should emit PERFORM_ACTION with HEAL when performHeal is called after correct answer', () => {
    // Arrange: Connected, in a room
    const mockRoom: Room = {
      id: 'room1',
      name: 'Test Room',
      players: [],
      status: RoomStatus.IN_PROGRESS,
      config: defaultMockRoomConfig,
      hostId: 'host1',
    };
    mockUseConnectionEvents.mockReturnValue({ ...defaultConnectionState, isConnected: true });
    mockUseRoomEvents.mockReturnValue({ ...defaultRoomState, currentRoom: mockRoom });
    mockSocketService.getSocket.mockReturnValue({ id: 'my-socket-id' } as any); // Ensure socket ID is set

    const { result } = renderHook(() => useGameEvents());

    // Find the handler registered for ANSWER_RESULT
    const answerResultHandler = mockSocketService.on.mock.calls.find(
      (call) => call[0] === GameEvents.ANSWER_RESULT
    )?.[1];

    if (!answerResultHandler) {
      throw new Error('ANSWER_RESULT handler not found');
    }

    // Act: Simulate receiving a CORRECT answer result to enable action
    const mockCorrectAnswerPayload: AnswerResultResponse = {
      correct: true,
      correctAnswer: 5,
      canPerformAction: true,
      timestamp: 0, // Assuming timestamp is needed based on BaseSocketMessage
    };
    act(() => {
      answerResultHandler(mockCorrectAnswerPayload);
    });

    // Check if action is now allowed
    expect(result.current.canPerformAction).toBe(true);

    // Act: Call performHeal
    act(() => {
      result.current.performHeal();
    });

    // Assert
    expect(mockSocketService.emit).toHaveBeenCalledTimes(1); // Only performHeal should emit in this phase
    expect(mockSocketService.emit).toHaveBeenCalledWith(GameEvents.PERFORM_ACTION, {
      roomId: 'room1',
      actionType: ActionType.HEAL,
      targetPlayerId: 'my-socket-id', // Should target self
    });
    // Check if action was disabled again after use
    expect(result.current.canPerformAction).toBe(false);
  });
});
