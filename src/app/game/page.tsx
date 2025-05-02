'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Grid2 } from '@mui/material';

import GameContainer from '@/app/components/game/game_container';
import InGameLeaderboard from '@/app/components/game/in_game_health_bar';
import InGameTimer from '@/app/components/game/ui/in_game_timer';

export default function Page() {
  const [isGameOver, setIsGameOver] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isGameOver) {
      router.push('/waiting_room?gameStatus=Ended');
    }
  }, [isGameOver, router]);

  return (
    <Grid2 p={2}>
      <InGameLeaderboard />
      <InGameTimer duration={15} onTimerComplete={() => setIsGameOver(true)} />
      {!isGameOver && <GameContainer />}
    </Grid2>
  );
}
