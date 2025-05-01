'use client';

import React from 'react';

import Image from 'next/image';

import { Box } from '@mui/material';

const Logo = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        padding: { xs: 1, md: 2 },
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <Box
        component="a"
        href="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        {/* Logo icon */}
        <Box sx={{ position: 'relative', width: { xs: 60, md: 72 }, height: { xs: 60, md: 72 } }}>
          <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} />
        </Box>

        {/* Logo title (only on md+) */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'block', md: 'block' },
            position: 'relative',
            width: { xs: 120, md: 144 },
            height: { xs: 60, md: 72 },
          }}
        >
          <Image src="/logoTitle.png" alt="Logo Title" fill style={{ objectFit: 'contain' }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Logo;
