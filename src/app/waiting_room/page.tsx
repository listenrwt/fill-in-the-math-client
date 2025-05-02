'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Box, Grid, Typography } from '@mui/material';
import { Socket, io } from 'socket.io-client';

import GameEndResult, { GameResult } from '../components/waiting_room/game_end_result';
import GameStartControls from '../components/waiting_room/game_start_controls';
import PlayerList from '../components/waiting_room/player_list';
import SettingsPanel from '../components/waiting_room/settings_panel';

export default function WaitingRoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const socketRef = useRef<Socket | null>(null);

  interface Player {
    id: number;
    username: string;
    isHost: boolean;
    avatarID?: number;
  }

  const [roomId, setRoomId] = useState('123456');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(true);

  // Game room settings.
  const [timeLimit, setTimeLimit] = useState(30);
  const [difficulty, setDifficulty] = useState('medium');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [attackDamage, setAttackDamage] = useState(5);
  const [healAmount, setHealAmount] = useState(3);
  const [wrongAnswerPenalty, setWrongAnswerPenalty] = useState(3);

  // New input parameter: gameStatus.
  // If a gameStatus query parameter is provided, we use that; else default to 'Waiting...'
  const initialGameStatus = searchParams.get('gameStatus') || 'Waiting...';

  const [gameStatus, setGameStatus] = useState(initialGameStatus);
  const [isRoomPublic, setIsRoomPublic] = useState(false);
  const [showGameEndResult, setShowGameEndResult] = useState(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('joinRoom', { roomId });

    socketRef.current.on('roomData', (data) => {
      setRoomId(data.roomId);
      setPlayers(data.players);
      setIsHost(data.currentPlayer?.isHost);
    });

    // Listen for the gameEnded event. When received, update the status and redirect.
    socketRef.current.on('gameEnded', () => {
      setGameStatus('Ended');
      router.push('/waiting_room');
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [roomId, router]);

  useEffect(() => {
    if (players.length === 0) {
      const samplePlayers: Player[] = [
        { id: 0, username: 'You', isHost: true, avatarID: 0 },
        { id: 1, username: 'Player1', isHost: false, avatarID: 2 },
        { id: 2, username: 'Player2', isHost: false, avatarID: 3 },
        { id: 3, username: 'Player3', isHost: false, avatarID: 7 },
      ];
      setPlayers(samplePlayers);
    }
  }, [players]);

  useEffect(() => {
    setShowGameEndResult(gameStatus === 'Ended');
  }, [gameStatus]);

  const gameResults: GameResult[] = [
    { rank: 1, username: 'Bruh (You)', avatarId: 0, score: 112 },
    { rank: 2, username: 'Player1', avatarId: 2, score: 88 },
    { rank: 3, username: 'Player2', avatarId: 3, score: 90 },
    { rank: 4, username: 'Player3', avatarId: 7, score: 69 },
  ];

  const handleStart = () => {
    if (!isHost) return;
    socketRef.current?.emit('startGame', {
      timeLimit,
      difficulty,
      maxPlayers,
      attackDamage,
      healAmount,
      wrongAnswerPenalty,
    });
    setGameStatus('starting');
    router.push('/game');
  };

  const handleLeave = () => {
    socketRef.current?.emit('leaveRoom', { roomId });
    router.push('/lobby');
  };

  // Callback for switching back to the waiting room view.
  const handlePlayAgain = () => {
    setShowGameEndResult(false);
    setGameStatus('Waiting...');
    setShowGameEndResult(false);
  };

  return (
    <Grid
      container
      direction="column"
      minHeight="100vh"
      minWidth="100vw"
      justifyContent="space-between"
    >
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
          {/* Conditionally render the game-end result or the waiting room panel */}
          {showGameEndResult ? (
            <GameEndResult results={gameResults} />
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
                    <PlayerList players={players} maxPlayers={maxPlayers} />
                  </Grid>
                </Grid>
              </Grid>
              {/* Settings Panel */}
              <Grid item>
                <Grid container padding={2} minWidth={300} maxWidth={600} borderRadius={2}>
                  <Grid container bgcolor="#D9D9D9" color="#000000" borderRadius={2}>
                    <SettingsPanel
                      timeLimit={timeLimit}
                      difficulty={difficulty}
                      maxPlayers={maxPlayers}
                      attackDamage={attackDamage}
                      healAmount={healAmount}
                      wrongAnswerPenalty={wrongAnswerPenalty}
                      disabled={!isHost}
                      onTimeLimitChange={setTimeLimit}
                      onDifficultyChange={setDifficulty}
                      onMaxPlayersChange={setMaxPlayers}
                      onAttackDamageChange={setAttackDamage}
                      onHealAmountChange={setHealAmount}
                      onWrongAnswerPenaltyChange={setWrongAnswerPenalty}
                      isRoomPublic={isRoomPublic}
                      onRoomPublicChange={(newVal) => {
                        setIsRoomPublic(newVal);
                        socketRef.current?.emit('setRoomPublic', { roomId, isPublic: newVal });
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
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
            <GameStartControls
              isHost={isHost}
              gameStatus={gameStatus} // Passing the game status to the controls
              onStart={handleStart}
              onLeave={handleLeave}
              onPlayAgain={showGameEndResult ? handlePlayAgain : undefined}
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
