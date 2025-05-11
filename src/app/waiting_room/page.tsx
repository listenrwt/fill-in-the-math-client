'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Box, Grid, Typography } from '@mui/material';

import { RoomEvents } from '@/events/events';
import { RoomStatus } from '@/lib/game.types';
import socketService from '@/services/socket.service';

import UserProfile from '../components/lobby/UserProfile';
import GameEndResult, { GameResult } from '../components/waiting_room/game_end_result';
import GameStartControls from '../components/waiting_room/game_start_controls';
import PlayerDeadView from '../components/waiting_room/player_dead_view';
import PlayerList from '../components/waiting_room/player_list';
import SettingsPanel from '../components/waiting_room/settings_panel';
import { useGameEventsContext } from '../contexts/GameEventsContext';

export default function WaitingRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use GameEventsContext instead of direct socket communication
  const {
    username,
    avatarId,
    currentRoom,
    roomConfig,
    leaderboard,
    handleRoomConfigChange,
    startGame,
    leaveRoom,
    updateRoomSettings,
    continueGame,
    health,
  } = useGameEventsContext();

  // Set initial game status based on query param or room status
  const initialGameStatus = searchParams.get('gameStatus') || 'Waiting...';
  const [gameStatus, setGameStatus] = useState(initialGameStatus);

  // Computed values from context
  const isHost = currentRoom?.hostId === socketService.getSocket()?.id;
  const roomId = currentRoom?.id || 'Loading...';

  // Check if player is alive (has health > 0) or is dead (health = 0)
  const isPlayerDead = health === 0;

  // Local state for UI control
  const [showGameEndResult, setShowGameEndResult] = useState(false);
  const [showDeadPlayerView, setShowDeadPlayerView] = useState(false);

  // Create a reference for the polling interval
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for room updates when in spectator mode
  const pollRoomUpdates = useCallback(() => {
    if (!currentRoom?.id) return;

    // Request room refresh if the game is still in progress and player is dead
    if (currentRoom.status === RoomStatus.IN_PROGRESS && isPlayerDead) {
      // To get a room update, we can trigger an update settings event with the current settings
      // This is a workaround since there's no explicit GET_ROOM event
      socketService.emit(RoomEvents.UPDATE_SETTINGS, {
        roomId: currentRoom.id,
        config: roomConfig,
      });
    }
  }, [currentRoom?.id, currentRoom?.status, isPlayerDead, roomConfig]);

  // Set up polling when in spectator mode
  useEffect(() => {
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Start polling when in spectator mode
    if (showDeadPlayerView) {
      pollingIntervalRef.current = setInterval(pollRoomUpdates, 2000); // Poll every 2 seconds
    }

    // Cleanup function
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [showDeadPlayerView, pollRoomUpdates]);

  // Update game status when room status changes
  useEffect(() => {
    if (!currentRoom) {
      router.push('/'); // Redirect to lobby if not in a room
      return;
    }

    switch (currentRoom.status) {
      case RoomStatus.WAITING:
        setGameStatus('Waiting...');
        setShowGameEndResult(false);
        setShowDeadPlayerView(false);
        break;
      case RoomStatus.IN_PROGRESS:
        setGameStatus('In Progress');
        setShowGameEndResult(false);

        // Check if the current player is dead
        if (isPlayerDead) {
          // Show dead player view instead of redirecting
          setShowDeadPlayerView(true);
        } else {
          // Redirect alive players to the game page
          router.push('/game');
        }
        break;
      case RoomStatus.FINISHED:
        setGameStatus('Ended');
        setShowGameEndResult(true);
        setShowDeadPlayerView(false);
        break;
      default:
        setGameStatus('Unknown');
    }
  }, [currentRoom, router, isPlayerDead]);

  // Handle start game - updates settings before starting the game
  const handleStart = () => {
    if (!isHost || (currentRoom && currentRoom?.players.length < 2)) return;
    updateRoomSettings();
    startGame();
    // Navigation now happens in the useEffect based on room status change
  };

  // Handle leave room
  const handleLeave = () => {
    leaveRoom();
    router.push('/');
  };

  // Callback for switching back to the waiting room view after game ends
  const handlePlayAgain = () => {
    // First call continueGame to reset the room status in the server
    if (isHost && currentRoom) {
      continueGame();
    }

    // Then update the local UI state
    setShowGameEndResult(false);
    setGameStatus('Waiting...');
  };

  // Convert leaderboard to game results format
  const gameResults: GameResult[] = leaderboard.map((entry) => ({
    rank: entry.rank,
    username: entry.username,
    avatarId: currentRoom?.players.find((p) => p.id === entry.playerId)?.avatarId ?? 1,
    score: entry.score,
  }));

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      minWidth="100vw"
      justifyContent="space-between"
    >
      {/* Top Right Information Box */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <UserProfile username={username || 'Guest'} avatarId={avatarId} experience={0} />
      </Box>
      <Grid></Grid>
      <Grid container justifyContent={'center'} alignContent={'center'}>
        <Grid item width="100%" maxWidth={900}>
          {/* Top Section: Room Name and ID */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">Room Code: {roomId}</Typography>
          </Box>

          {/* Status */}
          <Box width="100%" maxWidth={900} sx={{ p: 2, textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="subtitle1">Status: {gameStatus}</Typography>
          </Box>
        </Grid>

        <Grid container justifyContent={'center'} alignContent={'center'}>
          {/* Conditionally render the game-end result, dead player view, or the waiting room panel */}
          {showGameEndResult ? (
            <GameEndResult results={gameResults} />
          ) : showDeadPlayerView ? (
            <PlayerDeadView
              players={currentRoom?.players || []}
              username={username || 'Guest'}
              avatarId={avatarId}
            />
          ) : (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="flex-start"
              spacing={2}
            >
              {/* Players List */}
              <Grid item>
                <Grid container padding={2} maxWidth={300} borderRadius={2}>
                  <Grid container bgcolor="#D9D9D9" color="#000000" borderRadius={2}>
                    <PlayerList
                      players={
                        currentRoom?.players.map((player) => ({
                          id: Number(player.id),
                          username: player.username,
                          isHost: player.isHost,
                          avatarId: player.avatarId,
                        })) || []
                      }
                      maxPlayers={roomConfig.maxPlayers}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* Settings Panel - Only visible to host */}
              {isHost && (
                <Grid item>
                  <Grid container padding={2} minWidth={300} maxWidth={600} borderRadius={2}>
                    <Grid container bgcolor="#D9D9D9" color="#000000" borderRadius={2}>
                      <SettingsPanel
                        timeLimit={roomConfig.timeLimit}
                        difficulty={roomConfig.Difficulty}
                        maxPlayers={roomConfig.maxPlayers}
                        attackDamage={roomConfig.attackDamage}
                        healAmount={roomConfig.healAmount}
                        wrongAnswerPenalty={roomConfig.wrongAnswerPenalty}
                        disabled={!isHost}
                        onTimeLimitChange={(value) => {
                          handleRoomConfigChange({
                            target: { name: 'timeLimit', value },
                          } as React.ChangeEvent<{ name: string; value: number }>);
                        }}
                        onDifficultyChange={(value) => {
                          handleRoomConfigChange({
                            target: { name: 'Difficulty', value },
                          } as React.ChangeEvent<{ name: string; value: string }>);
                        }}
                        onMaxPlayersChange={(value) => {
                          handleRoomConfigChange({
                            target: { name: 'maxPlayers', value },
                          } as React.ChangeEvent<{ name: string; value: number }>);
                        }}
                        onAttackDamageChange={(value) => {
                          handleRoomConfigChange({
                            target: { name: 'attackDamage', value },
                          } as React.ChangeEvent<{ name: string; value: number }>);
                        }}
                        onHealAmountChange={(value) => {
                          handleRoomConfigChange({
                            target: { name: 'healAmount', value },
                          } as React.ChangeEvent<{ name: string; value: number }>);
                        }}
                        onWrongAnswerPenaltyChange={(value) => {
                          handleRoomConfigChange({
                            target: { name: 'wrongAnswerPenalty', value },
                          } as React.ChangeEvent<{ name: string; value: number }>);
                        }}
                        isRoomPublic={roomConfig.isPublic}
                        onRoomPublicChange={(value) => {
                          handleRoomConfigChange({
                            target: { name: 'isPublic', value },
                          } as React.ChangeEvent<{ name: string; value: boolean }>);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid item>
        {/* Bottom Section with the GameStartControls and grey bar */}
        <Box
          alignItems="flex-end"
          minWidth="100vw"
          justifyContent="center"
          sx={{ alignSelf: 'flex-end' }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              transform: 'translateY(30px)',
              zIndex: 2,
            }}
          >
            {' '}
            <GameStartControls
              isHost={isHost}
              gameStatus={gameStatus} // Passing the game status to the controls
              onStart={handleStart}
              onLeave={handleLeave}
              onPlayAgain={showGameEndResult ? handlePlayAgain : undefined}
              isViewingLiveGame={showDeadPlayerView}
            />
          </Box>

          {/* Grey bar at the bottom */}
          <Box
            sx={{
              width: '100%',
              height: 30,
              bgcolor: '#D9D9D9',
              position: 'relative',
              bottom: 0,
              zIndex: 1,
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
