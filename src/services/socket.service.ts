import { Socket, io } from 'socket.io-client';

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(url: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
      this.socket = io(url, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket'],
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        resolve(this.socket as Socket);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error', error);
        reject(error);
      });
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Disconnected from server');
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public emit<T>(eventName: string, data: T): void {
    if (this.socket) {
      this.socket.emit(eventName, {
        ...data,
        timestamp: Date.now(),
      });
    }
  }

  public on<T>(eventName: string, callback: (data: T) => void): void {
    if (this.socket) {
      this.socket.on(eventName, callback);
    }
  }

  public off(eventName: string): void {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default SocketService.getInstance();
