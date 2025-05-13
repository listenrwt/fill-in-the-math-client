'use client';

import React from 'react';

import { Box, Grid, Typography } from '@mui/material';

import UserAvatar from '../UserAvatar';
import Stroke from '../game/ui/stroke';

export interface GameResult {
  rank: number;
  username: string;
  avatarId: number;
  score: number;
}

interface GameEndResultProps {
  results: GameResult[];
}

const GameEndResult: React.FC<GameEndResultProps> = ({ results }) => {
  return (
    <Box
      sx={{
        bgcolor: '#D9D9D9',
        color: '#000',
        width: '95%',
        p: 3,
        borderRadius: 2,
        minWidth: { xs: 300, sm: 500, md: 900 },
        maxWidth: { xs: 500, sm: 900 },
        mx: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" mb={1}>
        Game Over!
      </Typography>
      <Stroke sx={{ width: '95%' }} />

      <Grid container direction="row" mt={1} spacing={1}>
        <Grid item mt={3} mb={1} xs={3}>
          <Typography variant="h5">Place</Typography>
        </Grid>
        <Grid item mt={3} mb={1} xs={5}>
          <Typography variant="h5" textAlign={'left'}>
            Player
          </Typography>
        </Grid>
        <Grid item mt={3} mb={1} xs={4}>
          <Typography variant="h5">Score</Typography>
        </Grid>
        <Stroke sx={{ width: '85%' }} />

        {results.map((result) => (
          <Grid key={result.rank} container justifyContent="space-between">
            <Grid mt={2} mb={2} item xs={3}>
              <Typography variant="h5">{result.rank}</Typography>
            </Grid>
            <Grid container alignContent="row" xs={5}>
              <Grid item mt={1} mb={1} mr={1}>
                <UserAvatar avatarId={result.avatarId} size={48} />
              </Grid>
              <Grid item mt={2} mb={2}>
                <Typography variant="h5" textAlign={'left'}>
                  {result.username}
                </Typography>
              </Grid>
            </Grid>
            <Grid mt={2} mb={2} item xs={4}>
              <Typography variant="h5">{result.score}</Typography>
            </Grid>
            <Stroke sx={{ width: '85%' }} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GameEndResult;
