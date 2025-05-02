'use client';

import React from 'react';

import { Box, Grid2, Typography } from '@mui/material';

import { useGameEventsContext } from '@/app/contexts/GameEventsContext';
import socketService from '@/services/socket.service';

import { Stroke } from '../stroke';
import GameActionProfile from './game_action_profile';

// Define the props for GameAction, including a callback that signals the end of the action phase.
interface GameActionProps {
  onActionComplete: () => void;
  performHeal: () => void;
  performAttack: (targetId: string) => void;
}

const GameAction: React.FC<GameActionProps> = ({
  onActionComplete,
  performHeal,
  performAttack,
}) => {
  const { currentRoom } = useGameEventsContext();

  // Set default values in case settings haven't been received yet.
  const gameSettings = {
    healAmount: currentRoom?.config?.healAmount ?? 5,
    damage: currentRoom?.config?.attackDamage ?? 3,
  };

  // Get current user's ID
  const currentPlayerId = socketService.getSocket()?.id;

  // Function to heal self and then signal to load the next question.
  const handleHeal = () => {
    performHeal();
    onActionComplete();
  };

  // Function to attack a target, then signal to load the next question.
  const handleAttack = (targetPlayer: string) => {
    performAttack(targetPlayer);
    onActionComplete();
  };

  // Get player data from current room
  const allPlayers = currentRoom?.players;

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
        Heal self for {gameSettings.healAmount} HP or Remove {gameSettings.damage} HP from another
        player
      </Typography>
      <Typography
        sx={{
          marginBottom: 1,
          display: { xs: 'block', sm: 'none' }, // hide on xs, show on sm and up
        }}
      >
        Heal:+{gameSettings.healAmount} HP / Attack:-{gameSettings.damage}HP
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
        {allPlayers?.map((player) => (
          <Box key={player.id}>
            {/* individual player cards */}
            <GameActionProfile
              player={player}
              action={player.id === currentPlayerId ? 'heal' : 'attack'}
              onClick={() => {
                if (player.id === currentPlayerId) {
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
