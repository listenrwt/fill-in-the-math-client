'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Box, Grid, Grid2, Typography } from '@mui/material';
import { Socket, io } from 'socket.io-client';

import GameStartControls from '../components/waiting_room/game_start_controls';
import PlayerList from '../components/waiting_room/player_list';
import SettingsPanel from '../components/waiting_room/settings_panel';

export default function WaitingRoomPage() {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  interface Player {
    id?: string;
    name: string;
    isHost: boolean;
  }

  const [roomName, setRoomName] = useState('Fun math room');
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
  const [countdown, setCountdown] = useState(10);
  const [countdownActive, setCountdownActive] = useState(false);
  const [gameStatus, setGameStatus] = useState('Waiting...');

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('joinRoom', { roomId });
    socketRef.current.on('roomData', (data) => {
      setRoomName(data.roomName);
      setRoomId(data.roomId);
      setPlayers(data.players);
      setIsHost(data.currentPlayer?.isHost);
    });
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdownActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/game');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdownActive, countdown, router]);

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
    setCountdown(10);
    setCountdownActive(true);
    setGameStatus('starting');
  };

  const handleLeave = () => {
    socketRef.current?.emit('leaveRoom', { roomId });
    router.push('/lobby');
  };

  return (
    <Grid2 container padding={2} maxWidth={900} margin="auto" borderRadius={2}>
      <Grid2 container bgcolor="#D9D9D9" color="#000000" borderRadius={2}>
        <Grid container>
          {/* Top Section: Room Name and ID */}
          <Grid item xs={12}>
            <Box
              sx={{
                backgroundColor: '#fff',
                p: 2,
                borderRadius: '8px 8px 0 0',
                textAlign: 'center',
              }}
            >
              <Typography variant="h5">Room: {roomName}</Typography>
              <Typography variant="subtitle1">(ID: {roomId})</Typography>
            </Box>
          </Grid>
          {/* Status */}
          <Grid item xs={12}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Status: {gameStatus}</Typography>
            </Box>
          </Grid>
          {/* Players List */}
          <Grid item xs={12}>
            <PlayerList players={players} />
          </Grid>
          {/* Settings Panel */}
          <Grid item xs={12}>
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
            />
          </Grid>
          {/* Game Start Controls */}
          <Grid item xs={12}>
            <GameStartControls
              countdownActive={countdownActive}
              countdown={countdown}
              isHost={isHost}
              onStart={handleStart}
              onLeave={handleLeave}
            />
          </Grid>
        </Grid>
      </Grid2>
    </Grid2>
  );
}
