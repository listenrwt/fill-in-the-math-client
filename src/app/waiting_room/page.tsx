'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Grid2, Typography } from '@mui/material';
import { Socket, io } from 'socket.io-client';

import GameStartControls from '../components/waiting_room/game_start_controls';
import PlayerList from '../components/waiting_room/player_list';
import SettingsPanel from '../components/waiting_room/settings_panel';

export default function WaitingRoomPage() {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  interface Player {
    id: number;
    username: string;
    isHost: boolean;
    avatarID?: number;
  }
  const [roomId, setRoomId] = useState('u1g92c2');
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(true);

  // Game room settings.
  const [timeLimit, setTimeLimit] = useState(30);
  const [difficulty, setDifficulty] = useState('medium');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [attackDamage, setAttackDamage] = useState(5);
  const [healAmount, setHealAmount] = useState(3);
  const [wrongAnswerPenalty, setWrongAnswerPenalty] = useState(3);
  const [gameStatus, setGameStatus] = useState('Waiting...');
  const [isRoomPublic, setIsRoomPublic] = useState(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('joinRoom', { roomId });
    socketRef.current.on('roomData', (data) => {
      setRoomId(data.roomId);
      setPlayers(data.players);
      setIsHost(data.currentPlayer?.isHost);
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [roomId]);

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

  return (
    <Grid2
      container
      direction="column"
      minHeight="100vh"
      minWidth="100vw"
      justifyContent="space-between"
    >
      <Grid2></Grid2>
      <Grid2 container direction="column" justifyContent="center" sx={{ alignSelf: 'center' }}>
        {/* Top Section: Room Name and ID */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4">Room Code:&nbsp;{roomId}</Typography>
        </Box>
        {/* Status */}
        <Box width="100%" maxWidth={900} sx={{ p: 2, textAlign: { xs: 'center', md: 'right' } }}>
          <Typography variant="subtitle1">Status: {gameStatus}</Typography>
        </Box>

        {/* Players List & Main Waiting Room Section Side-by-Side */}
        <Grid2
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          spacing={2}
        >
          {/* Players List */}
          <Grid2>
            <Grid2 container padding={2} maxWidth={300} borderRadius={2}>
              <Grid2 container bgcolor="#D9D9D9" color="#000000" borderRadius={2}>
                <PlayerList players={players} maxPlayers={maxPlayers} />
              </Grid2>
            </Grid2>
          </Grid2>

          {/* Main Waiting Room Section */}
          <Grid2>
            <Grid2 container padding={2} minWidth={300} maxWidth={600} borderRadius={2}>
              <Grid2 container bgcolor="#D9D9D9" color="#000000" borderRadius={2}>
                {/* Settings Panel */}
                <Grid2>
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
                      // Optionally emit your socket event to notify your server
                      socketRef.current?.emit('setRoomPublic', { roomId, isPublic: newVal });
                    }}
                  />
                </Grid2>
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>

      <Box
        alignItems="flex-end"
        minWidth="100vw"
        justifyContent="center"
        sx={{ alignSelf: 'flex-end' }}
      >
        {/* GameStartControls floating above grey bar, no margin */}

        {/* Floating buttons above the grey bar */}
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
          <GameStartControls isHost={isHost} onStart={handleStart} onLeave={handleLeave} />
        </Box>
        {/* Grey bar at the bottom */}
        <Box
          sx={{
            width: '100%',
            height: 30, // Grey bar height.
            bgcolor: '#D9D9D9',
            position: 'relative',
            bottom: 0,
            zIndex: 1, // Lower stacking order.
          }}
        />
      </Box>
    </Grid2>
  );
}
