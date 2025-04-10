'use client';

import { Grid2 } from '@mui/material';

import GameContainer from '@/app/components/game/game_container';
import InGameLeaderboard from '@/app/components/game/in_game_leaderboard';
import InGameTimer from '@/app/components/game/ui/in_game_timer';

// import Logo from '@/components/game_logo';

export default function Page() {
  return (
    <Grid2 p={2}>
      <InGameLeaderboard />
      <InGameTimer duration={15} />
      <GameContainer />
    </Grid2>
  );
}
