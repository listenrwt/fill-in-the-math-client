import { useState } from 'react';

import socketService from '../../services/socket.service';

export const useConnectionEvents = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [serverUrl, setServerUrl] = useState(
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001'
  );

  // Connect to socket server
  const connectToServer = async () => {
    try {
      await socketService.connect(serverUrl);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
      setIsConnected(false);
    }
  };

  // Disconnect from socket server
  const disconnectFromServer = () => {
    socketService.disconnect();
    setIsConnected(false);
  };

  return {
    isConnected,
    serverUrl,
    setServerUrl,
    connectToServer,
    disconnectFromServer,
  };
};
