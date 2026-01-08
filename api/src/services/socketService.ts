import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../utils/jwt.js';

const connectedUsers = new Map<number, string>();

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: (origin, callback) => callback(null, true),
      credentials: true,
      methods: ['GET', 'POST']
    }
  });

  // Middleware d'authentification Socket.IO
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Token manquant'));
      }

      const decoded = verifyToken(token);
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.user.id;
    console.log(`✅ User ${userId} connected with socket ${socket.id}`);

    // Enregistrer l'utilisateur connecté
    connectedUsers.set(userId, socket.id);

    // Rejoindre une room personnelle
    socket.join(`user:${userId}`);

    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected`);
      connectedUsers.delete(userId);
    });
  });

  return io;
};

export const getConnectedUsers = (): number[] => {
  return Array.from(connectedUsers.keys());
};
