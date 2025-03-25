import { Button, Grid, Paper, TextField, Typography } from '@mui/material';

interface ConnectionPanelProps {
  serverUrl: string;
  setServerUrl: (url: string) => void;
  isConnected: boolean;
  connectToServer: () => void;
  disconnectFromServer: () => void;
}

export const ConnectionPanel = ({
  serverUrl,
  setServerUrl,
  isConnected,
  connectToServer,
  disconnectFromServer,
}: ConnectionPanelProps) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Connection
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Server URL"
            value={serverUrl}
            onChange={(e) => setServerUrl(e.target.value)}
            disabled={isConnected}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color={isConnected ? 'error' : 'primary'}
            onClick={isConnected ? disconnectFromServer : connectToServer}
            fullWidth
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
