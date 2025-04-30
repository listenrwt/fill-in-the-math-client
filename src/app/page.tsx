'use client';

import React from 'react';

import Link from 'next/link';

import { Box, Button, Grid, Typography } from '@mui/material';

const Lobby = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        minWidth: '100vw',
        padding: 2,
      }}
    >
      {/* Top bar with logo (left) and course title (right) */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 0.5,
        }}
      >
        <Box>
          {/* TO BE IMPLEMENTED: <img src="/logo.png" alt="Fill in the Math Logo" style={{ height: '50px' }} /> */}
        </Box>
        <Box>
          <Typography sx={{ color: '#ffffff' }}>CSCI3100 Software&nbsp;Engineering</Typography>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        {/* Title */}
        <Typography variant="h4" sx={{ color: '#ffffff', mb: 2 }}>
          Fill in the Math
        </Typography>

        {/* Center box with prompt and buttons */}
        <Box
          bgcolor={'#ffffff'}
          width={{ xs: '400px', md: '600px' }}
          height={{ xs: '120px', md: '144px' }}
          borderRadius={2}
        >
          <Typography
            sx={{
              fontSize: { xs: '20px', md: '24px' },
              m: { xs: 1.875, md: 2.25 },
              color: '#000000',
            }}
          >
            please select
          </Typography>
          <Grid container justifyContent="center">
            <Box>
              <Link href="/lobby" passHref>
                <Button
                  variant="contained"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    borderRadius: '0 0 0 8px',
                    backgroundColor: '#919191',
                    '&:hover': { backgroundColor: '#7a7a7a' },
                    width: { xs: '200px', md: '300px' },
                    height: { xs: '60px', md: '72px' },
                  }}
                >
                  Play&nbsp;as&nbsp;Guest
                </Button>
              </Link>
            </Box>
            <Box>
              <Link href="/login" passHref>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    borderRadius: '0 0 8px 0',
                    backgroundColor: '#919191',
                    '&:hover': { backgroundColor: '#7a7a7a' },
                    width: { xs: '200px', md: '300px' },
                    height: { xs: '60px', md: '72px' },
                  }}
                >
                  Login/Register
                </Button>
              </Link>
            </Box>
          </Grid>
        </Box>
        {/* Title */}
        <Typography variant="h4" sx={{ color: 'transparent', mb: 2 }}>
          .
        </Typography>
      </Box>

      {/* Bottom left information */}
      <Box sx={{ position: 'fixed', bottom: 16, left: 16 }}>
        <Typography variant="body1" sx={{ color: '#ffffff' }}>
          Created by Group B8 <br></br> 1155194693&nbsp;Kwok&nbsp;Ka&nbsp;Ming&nbsp;|
          1155194687&nbsp;Lau&nbsp;Tsun&nbsp;Shing&nbsp;|
          1155190674&nbsp;Nagi&nbsp;Ka&nbsp;Shing&nbsp;|
          <br></br>1155189319&nbsp;Cheng&nbsp;Jonathan&nbsp;Yue&nbsp;Ming |
          1155192782&nbsp;Chan&nbsp;Jackson&nbsp;|
        </Typography>
      </Box>
    </Box>
  );
};

export default Lobby;
