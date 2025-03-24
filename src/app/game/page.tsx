'use client';

import { Grid2 } from '@mui/material';

import GameContainer from '@/components/game/game_container';

// import Logo from '@/components/game_logo';

// Remember to use the correct colour and fonts
export default function Page() {
  return (
    <Grid2>
      {/* <InGameLeaderboard/> */}
      <GameContainer />
    </Grid2>
  );
}
