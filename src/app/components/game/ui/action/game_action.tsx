'use client';

import React, { useEffect, useState } from 'react';

import { Box, Grid2, Typography } from '@mui/material';
import io, { Socket } from 'socket.io-client';

import Stroke from '../stroke';
import GameActionProfile from './game_action_profile';

// Define a simple Player interface
interface Player {
  id: number;
  username: string;
  avatarId?: number;
}

// Define the props for GameAction, including a callback that signals the end of the action phase.
interface GameActionProps {
  onActionComplete: () => void;
}

// Define a GameSettings interface that will be received via socket
interface GameSettings {
  healAmount: number;
  damage: number;
}

// Connect to the backend server via Socket.IO
const socket: Socket = io('http://localhost:3001');

const GameAction: React.FC<GameActionProps> = ({ onActionComplete }) => {
  // Set default values in case settings haven't been received yet.
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    healAmount: 5,
    damage: 3,
  });

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to game server');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from game server');
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('gameSettings');
    };
  }, []);

  // Sample data for players. In a real application, you may load these details from the server.
  const selfPlayer: Player = {
    id: 0,
    username: 'You',
    avatarId: 2, // Optionally, add a URL or leave it empty to use initials.
  };

  // sample players
  const enemyPlayers: Player[] = [
    { id: 1, username: 'Player1', avatarId: 3 },
    { id: 2, username: 'Player2', avatarId: 5 },
    { id: 3, username: 'Player3', avatarId: 0 },
  ];

  // Function to heal self by 5 HP and then signal to load the next question.
  const handleHeal = () => {
    socket.emit('playerAction', { type: 'heal', healAmount: 5 });
    console.log('Heal action sent for self (+5 HP)');
    onActionComplete();
  };

  // Function to attack a target, reducing their HP by 3, then signal to load the next question.
  const handleAttack = (targetPlayer: number) => {
    socket.emit('playerAction', { type: 'attack', targetPlayer, damage: 3 });
    console.log(`Attack action sent for player ${targetPlayer} (-3 HP)`);
    onActionComplete();
  };

  // Combine all players into a single array for rendering
  const allPlayers = [
    { ...selfPlayer, isHealer: true },
    ...enemyPlayers.map((player) => ({ ...player, isHealer: false })),
  ];

  return (
    <Grid2
      container
      alignItems="center"
      justifyContent="center"
      textAlign={'center'}
      sx={{
        borderRadius: 2,
        padding: 2,
        minHeight: '50vh', // Takes half screen height
        display: 'flex', // Enables flexbox centering
        flexDirection: 'column', // Ensures everything stacks properly
        width: '100%', // Full width to center properly
        margin: '0 auto', // Centers the container horizontally
        color: '#000000',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 1, color: '#000000' }}>
        Correct! Select Action
      </Typography>
      <Typography
        sx={{
          marginBottom: 1,
          display: { xs: 'none', sm: 'block' }, // hide on xs, show on sm and up
        }}
      >
        Heal self for {gameSettings.healAmount} HP or Remove {gameSettings.healAmount} HP from
        another player
      </Typography>
      <Typography
        sx={{
          marginBottom: 1,
          display: { xs: 'block', sm: 'none' }, // hide on xs, show on sm and up
        }}
      >
        Heal:+{gameSettings.healAmount} HP / Attack:-{gameSettings.healAmount}HP
      </Typography>

      <Stroke />

      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          width: '100%',
        }}
      >
        {allPlayers.map((player) => (
          <Box key={player.id}>
            {/* individual player cards */}
            <GameActionProfile
              player={player}
              action={player.isHealer ? 'heal' : 'attack'}
              onClick={() => {
                if (player.isHealer) {
                  handleHeal();
                } else {
                  handleAttack(player.id);
                }
              }}
            />
          </Box>
        ))}
      </Box>
    </Grid2>
  );
};

export default GameAction;
