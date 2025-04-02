'use client';

import { Container, Typography } from '@mui/material';

import { useGameEvents } from '../../app/hooks/useGameEvents';
import { RoomStatus } from '../../types/game.types';
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
    leaveRoom,
    updateRoomSettings,
    startGame,
    submitAnswer,
    performAttack,
    performHeal,
  } = useGameEvents();

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
        <>
          <PlayerInfoPanel
            username={username}
            setUsername={setUsername}
            currentRoom={currentRoom}
          />

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
            leaveRoom={leaveRoom}
            updateRoomSettings={updateRoomSettings}
            startGame={startGame}
          />

          {currentRoom && currentRoom.status === RoomStatus.IN_PROGRESS && (
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
          )}

          {currentRoom && currentRoom.status === RoomStatus.FINISHED && (
            <LeaderboardPanel leaderboard={leaderboard} />
          )}

          <MessagePanel gameMessage={gameMessage} />
        </>
      )}
    </Container>
  );
}
