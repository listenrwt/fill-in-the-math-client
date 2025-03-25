'use client';

import { Container, Typography } from '@mui/material';

import { useGameEvents } from '../../app/hooks/useGameEvents';
import { RoomStatus } from '../../types/game.types';
import { ConnectionPanel } from '../components/game-test/ConnectionPanel';
import { GamePanel } from '../components/game-test/GamePanel';
import { LeaderboardPanel } from '../components/game-test/LeaderboardPanel';
import { MessagePanel } from '../components/game-test/MessagePanel';
import { PlayerInfoPanel } from '../components/game-test/PlayerInfoPanel';
import { RoomManagementPanel } from '../components/game-test/RoomManagementPanel';
import { RoomPanel } from '../components/game-test/RoomPanel';

export default function GameTestPage() {
  const {
    // State
    isConnected,
    serverUrl,
    username,
    roomName,
    roomIdToJoin,
    timeLimit,
    difficulty,
    maxPlayers,
    attackDamage,
    healAmount,
    currentRoom,
    currentQuestion,
    answer,
    gameMessage,
    health,
    canPerformAction,
    leaderboard,
    wrongAnswerPenalty,

    // State setters
    setServerUrl,
    setUsername,
    setRoomName,
    setRoomIdToJoin,
    setTimeLimit,
    setDifficulty,
    setMaxPlayers,
    setAttackDamage,
    setHealAmount,
    setAnswer,
    setWrongAnswerPenalty,

    // Actions
    connectToServer,
    disconnectFromServer,
    createRoom,
    joinRoom,
    leaveRoom,
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

          {!currentRoom ? (
            <RoomManagementPanel
              roomName={roomName}
              setRoomName={setRoomName}
              timeLimit={timeLimit}
              setTimeLimit={setTimeLimit}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              maxPlayers={maxPlayers}
              setMaxPlayers={setMaxPlayers}
              attackDamage={attackDamage}
              setAttackDamage={setAttackDamage}
              healAmount={healAmount}
              setHealAmount={setHealAmount}
              roomIdToJoin={roomIdToJoin}
              setRoomIdToJoin={setRoomIdToJoin}
              createRoom={createRoom}
              joinRoom={joinRoom}
              wrongAnswerPenalty={wrongAnswerPenalty}
              setWrongAnswerPenalty={setWrongAnswerPenalty}
            />
          ) : (
            <>
              <RoomPanel
                currentRoom={currentRoom}
                timeLimit={timeLimit}
                setTimeLimit={setTimeLimit}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                maxPlayers={maxPlayers}
                setMaxPlayers={setMaxPlayers}
                attackDamage={attackDamage}
                setAttackDamage={setAttackDamage}
                healAmount={healAmount}
                setHealAmount={setHealAmount}
                leaveRoom={leaveRoom}
                startGame={startGame}
                wrongAnswerPenalty={wrongAnswerPenalty}
                setWrongAnswerPenalty={setWrongAnswerPenalty}
              />

              {currentRoom.status === RoomStatus.IN_PROGRESS && (
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

              {currentRoom.status === RoomStatus.FINISHED && (
                <LeaderboardPanel leaderboard={leaderboard} />
              )}
            </>
          )}

          <MessagePanel gameMessage={gameMessage} />
        </>
      )}
    </Container>
  );
}
