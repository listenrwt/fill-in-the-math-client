import { useCallback, useEffect, useState } from 'react';

import { generate_text_from_question } from '@/lib/utili';

import { ConnectionEvents, GameEvents } from '../../events/events';
import {
  AnswerResultResponse,
  HealthUpdateResponse,
  LeaderboardResponse,
  PlayerEliminatedResponse,
  QuestionResponse,
} from '../../events/game.events';
import { ErrorResponse, RoomResponse } from '../../events/room.events';
import { ActionType, LeaderboardEntry, Question, RoomStatus } from '../../lib/game.types';
import socketService from '../../services/socket.service';
import { useConnectionEvents } from './useConnectionEvents';
import { useRoomEvents } from './useRoomEvents';

export const useGameEvents = () => {
  // Connection state from useConnectionEvents
  const { isConnected, serverUrl, setServerUrl, connectToServer, disconnectFromServer } =
    useConnectionEvents();

  // Room state from useRoomEvents
  const {
    username,
    setUsername,
    roomName,
    setRoomName,
    roomIdToJoin,
    setRoomIdToJoin,
    roomConfig,
    handleRoomConfigChange,
    currentRoom,
    gameMessage,
    setCurrentRoom,
    setGameMessage,
    avatarId,
    setAvatarId,
    createRoom,
    joinRoom,
    quickJoin,
    leaveRoom,
    deleteRoom,
    continueGame,
    updateRoomSettings,
  } = useRoomEvents(isConnected);

  // Game state
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<number[]>([]);
  const [health, setHealth] = useState<number>(0);
  const [canPerformAction, setCanPerformAction] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Game actions
  const startGame = () => {
    if (!isConnected || !currentRoom) return;

    socketService.emit(GameEvents.START_GAME, {
      roomId: currentRoom.id,
    });
  };

  const restartGame = () => {
    if (!isConnected || !currentRoom) return;

    // Use the existing START_GAME event to restart the game
    socketService.emit(GameEvents.START_GAME, {
      roomId: currentRoom.id,
    });
  };

  const getQuestion = useCallback(() => {
    if (!isConnected || !currentRoom) return;

    socketService.emit(GameEvents.GET_QUESTION, {
      roomId: currentRoom.id,
    });
  }, [isConnected, currentRoom]);

  const submitAnswer = () => {
    if (!isConnected || !currentRoom || !currentQuestion) return;

    socketService.emit(GameEvents.SUBMIT_ANSWER, {
      roomId: currentRoom.id,
      questionId: currentQuestion.id,
      answer: answer,
    });
  };

  const performAttack = (targetId: string) => {
    if (!isConnected || !currentRoom || !canPerformAction) return;

    socketService.emit(GameEvents.PERFORM_ACTION, {
      roomId: currentRoom.id,
      actionType: ActionType.ATTACK,
      targetPlayerId: targetId,
    });

    setCanPerformAction(false);
  };

  const performHeal = () => {
    if (!isConnected || !currentRoom || !canPerformAction) return;

    socketService.emit(GameEvents.PERFORM_ACTION, {
      roomId: currentRoom.id,
      actionType: ActionType.HEAL,
      targetPlayerId: socketService.getSocket()?.id || '',
    });

    setCanPerformAction(false);
  };

  // Setup event listeners when connected
  useEffect(() => {
    if (!isConnected) return;

    // Setup socket event listeners
    socketService.on<ErrorResponse>(ConnectionEvents.ERROR, (data) => {
      setGameMessage(`Error: ${data.error}`);
    });

    socketService.on<RoomResponse>(GameEvents.GAME_STARTED, (data) => {
      setCurrentRoom(data.room);
      setHealth(data.room.config.timeLimit);
      setGameMessage('Game started!');
      getQuestion();
    });

    socketService.on<QuestionResponse>(GameEvents.QUESTION_RECEIVED, (data) => {
      setCurrentQuestion(data.question);
      // Reset answer array when receiving a new question
      setAnswer([]);
      setGameMessage(`New question: ${generate_text_from_question(data.question.equation_arr)}`);
    });

    socketService.on<AnswerResultResponse>(GameEvents.ANSWER_RESULT, (data) => {
      if (data.correct) {
        setGameMessage('Correct! Choose an action.');
        setCanPerformAction(true);
      } else {
        setGameMessage(`Wrong!`);
        getQuestion();
      }
      setAnswer([]);
    });

    socketService.on<HealthUpdateResponse>(GameEvents.HEALTH_UPDATED, (data) => {
      // Process all health updates
      data.updates.forEach((update) => {
        // Update player's own health state variable if it's their health
        if (socketService.getSocket()?.id === update.playerId) {
          setHealth(update.newHealth);
        }
      });

      // Always update all players' health in the current room state
      setCurrentRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;

        // Create a new room object with updated players array
        const updatedRoom = {
          ...prevRoom,
          players: prevRoom.players.map((player) => {
            // Find if there's an update for this player
            const playerUpdate = data.updates.find((update) => update.playerId === player.id);
            return playerUpdate ? { ...player, health: playerUpdate.newHealth } : player;
          }),
        };

        return updatedRoom;
      });
    });

    socketService.on<PlayerEliminatedResponse>(GameEvents.PLAYER_ELIMINATED, (data) => {
      if (socketService.getSocket()?.id === data.playerId) {
        setGameMessage('You have been eliminated!');
        // Set health to exactly 0 when eliminated
        setHealth(0);

        // Make sure the player stays in the current room with proper status
        setCurrentRoom((prevRoom) => {
          if (!prevRoom) return prevRoom;

          // Update the current player's health to 0 in the room
          return {
            ...prevRoom,
            players: prevRoom.players.map((player) => {
              if (player.id === data.playerId) {
                return { ...player, health: 0 };
              }
              return player;
            }),
            // Keep the status as IN_PROGRESS since the game is still ongoing
            status: RoomStatus.IN_PROGRESS,
          };
        });
      } else {
        setGameMessage(`Player ${data.playerId} has been eliminated!`);
      }
    });

    socketService.on<LeaderboardResponse>(GameEvents.LEADERBOARD_UPDATED, (data) => {
      setLeaderboard(data.leaderboard);
      if (data.gameWinner) {
        setGameMessage(`Game over! Winner: ${data.gameWinner}`);
      } else {
        setGameMessage("Game over! It's a tie!");
      }
    });

    socketService.on(GameEvents.GAME_ENDED, () => {
      setCurrentQuestion(null);
      setCanPerformAction(false);
      setAnswer([]); // Reset answer array when game ends

      // Update the currentRoom state to reflect that the game has ended
      setCurrentRoom((prevRoom) => {
        if (!prevRoom) return prevRoom;
        return {
          ...prevRoom,
          status: RoomStatus.FINISHED,
        };
      });
    });

    // Add cleanup function to remove all listeners when component unmounts
    return () => {
      socketService.off(ConnectionEvents.ERROR);
      socketService.off(GameEvents.GAME_STARTED);
      socketService.off(GameEvents.QUESTION_RECEIVED);
      socketService.off(GameEvents.ANSWER_RESULT);
      socketService.off(GameEvents.HEALTH_UPDATED);
      socketService.off(GameEvents.PLAYER_ELIMINATED);
      socketService.off(GameEvents.LEADERBOARD_UPDATED);
      socketService.off(GameEvents.GAME_ENDED);
    };
  }, [isConnected, setGameMessage, setCurrentRoom, getQuestion]);

  // Reset game state when disconnecting
  useEffect(() => {
    if (!isConnected) {
      setCurrentQuestion(null);
      setCanPerformAction(false);
      setLeaderboard([]);
      setAnswer([]); // Reset answer array when disconnecting
    }
  }, [isConnected]);

  // Combine all hooks' return values
  return {
    // State
    isConnected,
    serverUrl,
    username,
    roomName,
    roomIdToJoin,
    roomConfig,
    currentRoom,
    currentQuestion,
    answer,
    gameMessage,
    health,
    canPerformAction,
    leaderboard,
    avatarId,

    // State setters
    setServerUrl,
    setUsername,
    setRoomName,
    setRoomIdToJoin,
    handleRoomConfigChange,
    setAnswer,
    setAvatarId,

    // Actions
    createRoom,
    joinRoom,
    quickJoin,
    leaveRoom,
    deleteRoom,
    continueGame,
    updateRoomSettings,
    connectToServer,
    disconnectFromServer,
    startGame,
    restartGame,
    submitAnswer,
    performAttack,
    performHeal,
  };
};
