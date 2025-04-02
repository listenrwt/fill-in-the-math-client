'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'mono, monospace', // Default font set to 'mono'
    h1: {
      fontFamily: 'mono-bold, monospace',
    },
    h2: {
      fontFamily: 'mono-bold, monospace',
    },
    h3: {
      fontFamily: 'mono-bold, monospace',
    },
    button: {
      fontFamily: 'mono-bold, monospace',
    },
  },
  palette: {
    mode: 'dark', // Keeps dark mode styles
    background: {
      default: '#262626', // Fallback color
      paper: '#0A0A0A',
    },
    text: {
      primary: '#ffffff', // Fallback color
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        :root {
          --background: #262626;
          --foreground: #ffffff;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --background: #0a0a0a;
            --foreground: #ededed;
          }
        }

        body {
          background-color: var(--background);
          color: var(--foreground);
        }
      `,
    },
  },
});

export default theme;
