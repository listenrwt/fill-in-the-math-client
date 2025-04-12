'use client';

import { Container, Grid, Typography } from '@mui/material';

import { useGameEvents } from '../../app/hooks/useGameEvents';
import { RoomStatus } from '../../lib/game.types';
import { ConnectionPanel } from '../components/game-test/ConnectionPanel';
import { GamePanel } from '../components/game-test/GamePanel';
import { LeaderboardPanel } from '../components/game-test/LeaderboardPanel';
import { MessagePanel } from '../components/game-test/MessagePanel';
import { PlayerInfoPanel } from '../components/game-test/PlayerInfoPanel';
import { RoomPanel } from '../components/game-test/RoomPanel';

export default function GameTestPage() {
  const {
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

    // State setters
    setServerUrl,
    setUsername,
    setRoomName,
    setRoomIdToJoin,
    handleRoomConfigChange,
    setAnswer,

    // Actions
    connectToServer,
    disconnectFromServer,
    createRoom,
    joinRoom,
    quickJoin,
    leaveRoom,
    deleteRoom,
    continueGame,
    updateRoomSettings,
    startGame,
    submitAnswer,
    performAttack,
    performHeal,
  } = useGameEvents();

  // Determine the current game state
  const isInRoom = !!currentRoom;
  const isPlaying = isInRoom && currentRoom.status === RoomStatus.IN_PROGRESS;
  const isFinished = isInRoom && currentRoom.status === RoomStatus.FINISHED;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fill-in-the-Math Game Testing
      </Typography>

      <ConnectionPanel
        serverUrl={serverUrl}
        setServerUrl={setServerUrl}
        isConnected={isConnected}
        connectToServer={connectToServer}
        disconnectFromServer={disconnectFromServer}
      />

      {isConnected && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <PlayerInfoPanel
              username={username}
              setUsername={setUsername}
              currentRoom={currentRoom}
            />
          </Grid>

          {!isPlaying && !isFinished && (
            <Grid item xs={12}>
              <RoomPanel
                username={username}
                setUsername={setUsername}
                roomName={roomName}
                setRoomName={setRoomName}
                roomConfig={roomConfig}
                handleRoomConfigChange={handleRoomConfigChange}
                roomIdToJoin={roomIdToJoin}
                setRoomIdToJoin={setRoomIdToJoin}
                currentRoom={currentRoom}
                createRoom={createRoom}
                joinRoom={joinRoom}
                quickJoin={quickJoin}
                leaveRoom={leaveRoom}
                updateRoomSettings={updateRoomSettings}
                startGame={startGame}
              />
            </Grid>
          )}

          {isPlaying && currentRoom && (
            <Grid item xs={12}>
              <GamePanel
                currentRoom={currentRoom}
                health={health}
                currentQuestion={currentQuestion}
                answer={answer}
                setAnswer={setAnswer}
                canPerformAction={canPerformAction}
                submitAnswer={submitAnswer}
                performHeal={performHeal}
                performAttack={performAttack}
              />
            </Grid>
          )}

          {isFinished && (
            <Grid item xs={12}>
              <LeaderboardPanel
                leaderboard={leaderboard}
                currentRoom={currentRoom}
                leaveRoom={leaveRoom}
                deleteRoom={deleteRoom}
                continueGame={continueGame}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <MessagePanel gameMessage={gameMessage} />
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
