// File: game_action.tsx
import React, { useEffect } from 'react';

import { Avatar, Box, Button, Card, CardContent, Grid2, Typography } from '@mui/material';
import io, { Socket } from 'socket.io-client';

import Stroke from './stroke';

// Define a simple Player interface
interface Player {
  id: number;
  username: string;
  avatarUrl?: string;
}

// Define the props for GameAction, including a callback that signals the end of the action phase.
interface GameActionProps {
  onActionComplete: () => void;
}

// Connect to the backend server via Socket.IO
const socket: Socket = io('http://localhost:3001');

const GameAction: React.FC<GameActionProps> = ({ onActionComplete }) => {
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
    };
  }, []);

  // Sample data for players. In a real application, you may load these details from the server.
  const selfPlayer: Player = {
    id: 0,
    username: 'You',
    avatarUrl: '', // Optionally, add a URL or leave it empty to use initials.
  };

  // sample players
  const enemyPlayers: Player[] = [
    { id: 1, username: 'Player1', avatarUrl: '' },
    { id: 2, username: 'Player2', avatarUrl: '' },
    { id: 3, username: 'Player3', avatarUrl: '' },
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
      sx={{
        borderRadius: 2,
        padding: 2,
        minHeight: '50vh', // Takes half screen height
        display: 'flex', // Enables flexbox centering
        flexDirection: 'column', // Ensures everything stacks properly
        width: '100%', // Full width to center properly
        margin: '0 auto', // Centers the container horizontally
      }}
    >
      <Typography variant="h5" align="center" sx={{ marginBottom: 2, color: '#000000' }}>
        Correct! Select Action
      </Typography>
      <Typography align="center" sx={{ marginBottom: 1, color: '#000000' }}>
        Heal self for 5 seconds or Remove 5 seconds from another player
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
          height: { md: '300px' },
        }}
      >
        {allPlayers.map((player) => (
          <Box
            key={player.id}
            sx={{
              width: { xs: '100%', sm: '50%', md: '22%' },
              minWidth: { xs: '100px', sm: '140px', md: '200px' },
              maxWidth: '250px',
              mb: 2,
            }}
          >
            {/* individual player cards */}
            <Card raised sx={{ height: '100%' }}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  height: '100%',
                }}
              >
                <Avatar alt={player.username} sx={{ width: 50, height: 50 }}>
                  {player.username.charAt(0)}
                </Avatar>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    width: '100%',
                    minWidth: '160px',
                  }}
                >
                  <Typography variant="subtitle1">{player.username}</Typography>
                  {player.isHealer ? (
                    <Button
                      variant="contained"
                      sx={{
                        mt: 1,
                        backgroundColor: 'green',
                        color: 'white',
                        width: '100%',
                      }}
                      onClick={handleHeal}
                    >
                      Heal (+5 HP)
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{
                        mt: 1,
                        width: '100%',
                      }}
                      onClick={() => handleAttack(player.id)}
                    >
                      Attack (-3 HP)
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Grid2>
  );
};

export default GameAction;
