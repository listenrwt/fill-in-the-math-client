'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Grid2 } from '@mui/material';

import GameContainer from '@/app/components/game/game_container';
import InGameLeaderboard from '@/app/components/game/in_game_health_bar';
import InGameTimer from '@/app/components/game/ui/in_game_timer';
import { useGameEventsContext } from '@/app/contexts/GameEventsContext';
import { RoomStatus } from '@/lib/game.types';

export default function Page() {
  const router = useRouter();
  const {
    currentRoom,
    health,
    currentQuestion,
    submitAnswer,
    performHeal,
    performAttack,
    canPerformAction,
    answer,
    setAnswer,
  } = useGameEventsContext();

  // State for flash effect
  const [flashEffect, setFlashEffect] = useState<'none' | 'damage' | 'heal'>('none');
  const [prevHealth, setPrevHealth] = useState<number>(health);

  // Detect health changes and trigger appropriate flash effect
  useEffect(() => {
    if (prevHealth === 0 && health > 0) {
      // Initial health set, don't flash
      setPrevHealth(health);
      return;
    }

    if (health < prevHealth) {
      // Only flash red if health decreases by more than 1 (not natural loss)
      // Natural health loss is exactly 1 HP per second
      const healthDifference = prevHealth - health;
      if (healthDifference > 1) {
        setFlashEffect('damage');
        setTimeout(() => setFlashEffect('none'), 300); // Reset after 300ms
      }
    } else if (health > prevHealth) {
      // Player was healed
      setFlashEffect('heal');
      setTimeout(() => setFlashEffect('none'), 300); // Reset after 300ms
    }

    setPrevHealth(health);
  }, [health, prevHealth]);

  // Redirect to waiting room if not in a room or if game has ended
  useEffect(() => {
    if (!currentRoom || currentRoom.status !== RoomStatus.IN_PROGRESS) {
      router.push('/waiting_room');
    }
  }, [currentRoom, router]);

  // Timer duration based on room config or default to 30 seconds
  const timerDuration = currentRoom?.config?.timeLimit ?? 30;

  // Style for the flash effect
  const backgroundStyle = {
    position: 'fixed' as const,
    top: 0 as const,
    left: 0 as const,
    right: 0 as const,
    bottom: 0 as const,
    pointerEvents: 'none' as const,
    zIndex: 9999 as const,
    transition: 'background-color 0.15s ease-in, opacity 0.3s ease-out' as const,
    opacity: flashEffect !== 'none' ? 0.4 : 0,
    backgroundColor:
      flashEffect === 'damage' ? '#ff0000' : flashEffect === 'heal' ? '#00ff00' : 'transparent',
  };

  return (
    <>
      <div style={backgroundStyle} aria-hidden="true" />
      <Grid2 p={2}>
        <InGameLeaderboard />
        <InGameTimer
          duration={timerDuration}
          onTimerComplete={() => router.push('/waiting_room')}
        />
        {currentRoom?.status === RoomStatus.IN_PROGRESS && (
          <GameContainer
            currentQuestion={currentQuestion}
            answer={answer}
            setAnswer={setAnswer}
            submitAnswer={submitAnswer}
            performHeal={performHeal}
            performAttack={performAttack}
            canPerformAction={canPerformAction}
            health={health}
          />
        )}
      </Grid2>
    </>
  );
}
