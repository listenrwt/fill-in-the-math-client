import { ChangeEvent, useEffect, useState } from 'react';

import { RoomEvents } from '../../events/events';
import { RoomResponse } from '../../events/room.events';
import { DEFAULT_ROOM_SETTINGS } from '../../lib/const';
import { Room, RoomConfig } from '../../lib/game.types';
import socketService from '../../services/socket.service';

// Create a default config to avoid undefined issues
const DEFAULT_CONFIG: RoomConfig = {
  timeLimit: DEFAULT_ROOM_SETTINGS.TIME_LIMIT,
  Difficulty: DEFAULT_ROOM_SETTINGS.DIFFICULTY,
  maxPlayers: DEFAULT_ROOM_SETTINGS.MAX_PLAYERS,
  attackDamage: DEFAULT_ROOM_SETTINGS.ATTACK_DAMAGE,
  healAmount: DEFAULT_ROOM_SETTINGS.HEAL_AMOUNT,
  wrongAnswerPenalty: DEFAULT_ROOM_SETTINGS.WRONG_ANSWER_PENALTY,
  isPublic: DEFAULT_ROOM_SETTINGS.IS_PUBLIC,
};

export const useRoomEvents = (isConnected: boolean) => {
  const [username, setUsername] = useState(DEFAULT_ROOM_SETTINGS.USERNAME);
  const [roomName, setRoomName] = useState(DEFAULT_ROOM_SETTINGS.ROOM_NAME);
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const [roomConfig, setRoomConfig] = useState<RoomConfig>(DEFAULT_CONFIG);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [gameMessage, setGameMessage] = useState('');

  const handleRoomConfigChange = (
    e: ChangeEvent<HTMLInputElement | { name: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    const newValue =
      name === 'Difficulty' ? value : name === 'isPublic' ? Boolean(value) : Number(value);

    setRoomConfig((prevConfig) => ({
      ...prevConfig,
      [name]: newValue,
    }));

    // If we're in a room and the isPublic toggle changes, update room settings immediately
    if (name === 'isPublic' && currentRoom) {
      socketService.emit(RoomEvents.UPDATE_SETTINGS, {
        roomId: currentRoom.id,
        config: {
          ...roomConfig,
          [name]: newValue,
        },
      });
    }
  };

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

    socketService.on(RoomEvents.NO_ROOMS_AVAILABLE, () => {
      setGameMessage('No public rooms available. Try creating a room instead!');
    });

    return () => {
      socketService.off(RoomEvents.ROOM_CREATED);
      socketService.off(RoomEvents.ROOM_JOINED);
      socketService.off(RoomEvents.ROOM_LEFT);
      socketService.off(RoomEvents.ROOM_UPDATED);
      socketService.off(RoomEvents.NO_ROOMS_AVAILABLE);
    };
  }, [isConnected]);

  // Room actions
  const createRoom = () => {
    if (!isConnected) return;

    socketService.emit(RoomEvents.CREATE_ROOM, {
      username,
      roomName,
      config: roomConfig,
    });
  };

  const joinRoom = () => {
    if (!isConnected || !roomIdToJoin) return;

    socketService.emit(RoomEvents.JOIN_ROOM, {
      username,
      roomId: roomIdToJoin,
    });
  };

  const quickJoin = () => {
    if (!isConnected) return;

    socketService.emit(RoomEvents.QUICK_JOIN, {
      username,
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
      config: roomConfig,
    });
  };

  return {
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
    createRoom,
    joinRoom,
    quickJoin,
    leaveRoom,
    updateRoomSettings,
  };
};
