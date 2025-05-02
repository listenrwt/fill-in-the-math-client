'use client';

import { Box, Divider, SxProps } from '@mui/material';

interface GameContainerProps {
  sx?: SxProps;
}

export default function GameContainer({ sx }: GameContainerProps) {
  return (
    <Divider
      sx={{
        borderBottomWidth: 1.5,
        borderColor: '#000000',
        borderRadius: 1,
        width: '90%',
        alignContent: 'center',
        margin: '0 auto',
        ...sx, // override or add to default styles
      }}
    />
  );
}

export function Stroke() {
  return (
    <Box
      sx={{
        height: '1px',
        width: '100%',
        backgroundColor: '#000000',
        opacity: 0.2,
        my: 1,
      }}
    />
  );
}
