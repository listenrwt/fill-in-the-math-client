import { useEffect, useState } from 'react';

import { RoomEvents } from '../../events/events';
import { RoomResponse } from '../../events/room.events';
import { DEFAULT_ROOM_SETTINGS } from '../../lib/const';
import socketService from '../../services/socket.service';
import { Room } from '../../types/game.types';

export const useRoomEvents = (isConnected: boolean) => {
  const [username, setUsername] = useState(DEFAULT_ROOM_SETTINGS.USERNAME);
  const [roomName, setRoomName] = useState(DEFAULT_ROOM_SETTINGS.ROOM_NAME);
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const [timeLimit, setTimeLimit] = useState(DEFAULT_ROOM_SETTINGS.TIME_LIMIT);
  const [difficulty, setDifficulty] = useState(DEFAULT_ROOM_SETTINGS.DIFFICULTY);
  const [maxPlayers, setMaxPlayers] = useState(DEFAULT_ROOM_SETTINGS.MAX_PLAYERS);
  const [attackDamage, setAttackDamage] = useState(DEFAULT_ROOM_SETTINGS.ATTACK_DAMAGE);
  const [healAmount, setHealAmount] = useState(DEFAULT_ROOM_SETTINGS.HEAL_AMOUNT);
  const [wrongAnswerPenalty, setWrongAnswerPenalty] = useState(
    DEFAULT_ROOM_SETTINGS.WRONG_ANSWER_PENALTY
  );
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [gameMessage, setGameMessage] = useState('');

  useEffect(() => {
    if (!isConnected) return;

    // Setup room-related event listeners
    socketService.on<RoomResponse>(RoomEvents.ROOM_CREATED, (data) => {
      setCurrentRoom(data.room);
      setGameMessage(`Room created: ${data.room.id}`);
    });

    socketService.on<RoomResponse>(RoomEvents.ROOM_JOINED, (data) => {
      setCurrentRoom(data.room);
      setGameMessage(`Joined room: ${data.room.id}`);
    });

    socketService.on(RoomEvents.ROOM_LEFT, () => {
      setCurrentRoom(null);
      setGameMessage('Left room');
    });

    socketService.on<RoomResponse>(RoomEvents.ROOM_UPDATED, (data) => {
      setCurrentRoom(data.room);
      setGameMessage('Room settings updated');
    });

    return () => {
      socketService.off(RoomEvents.ROOM_CREATED);
      socketService.off(RoomEvents.ROOM_JOINED);
      socketService.off(RoomEvents.ROOM_LEFT);
      socketService.off(RoomEvents.ROOM_UPDATED);
    };
  }, [isConnected]);

  // Room actions
  const createRoom = () => {
    if (!isConnected) return;

    socketService.emit(RoomEvents.CREATE_ROOM, {
      username,
      roomName,
      config: {
        timeLimit,
        questionDifficulty: difficulty,
        maxPlayers,
        attackDamage,
        healAmount,
        wrongAnswerPenalty,
      },
    });
  };

  const joinRoom = () => {
    if (!isConnected || !roomIdToJoin) return;

    socketService.emit(RoomEvents.JOIN_ROOM, {
      username,
      roomId: roomIdToJoin,
    });
  };

  const leaveRoom = () => {
    if (!isConnected || !currentRoom) return;

    socketService.emit(RoomEvents.LEAVE_ROOM, {
      roomId: currentRoom.id,
    });
  };

  const updateRoomSettings = () => {
    if (!isConnected || !currentRoom) return;

    socketService.emit(RoomEvents.UPDATE_SETTINGS, {
      roomId: currentRoom.id,
      config: {
        timeLimit,
        questionDifficulty: difficulty,
        maxPlayers,
        attackDamage,
        healAmount,
        wrongAnswerPenalty,
      },
    });
  };

  return {
    username,
    setUsername,
    roomName,
    setRoomName,
    roomIdToJoin,
    setRoomIdToJoin,
    timeLimit,
    setTimeLimit,
    difficulty,
    setDifficulty,
    maxPlayers,
    setMaxPlayers,
    attackDamage,
    setAttackDamage,
    healAmount,
    setHealAmount,
    wrongAnswerPenalty,
    setWrongAnswerPenalty,
    currentRoom,
    gameMessage,
    setCurrentRoom,
    setGameMessage,
    createRoom,
    joinRoom,
    leaveRoom,
    updateRoomSettings,
  };
};
