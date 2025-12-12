import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../utils/jwt.js';
import prisma from '../utils/prismaClient.js';



const connectedUsers = new Map<number, string>();

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:4000'],
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

    // Émettre la liste des utilisateurs en ligne
    //io.emit('users:online', Array.from(connectedUsers.keys()));

    // Rejoindre une room personnelle
    socket.join(`user:${userId}`);

    // Écouter les messages privés
    socket.on('message:send', async (data) => {
      try {
        const { receiverId, contenu, typeMessage } = data;

        // Créer le message dans la base de données
        const message = await prisma.historiqueMessage.create({
          data: {
            senderId: userId,
            receiverId,
            contenu,
            typeMessage: typeMessage || 'text'
          },
          include: {
            sender: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true
              }
            },
            receiver: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        });

        // Envoyer le message au destinataire s'il est en ligne
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:received', message);
        }

        // Confirmer l'envoi à l'expéditeur
        socket.emit('message:sent', message);

        // Créer une notification pour le destinataire
        await prisma.notification.create({
          data: {
            message: `Nouveau message de ${message.sender.prenom} ${message.sender.nom}`,
            userId: receiverId,
            type: 'info'
          }
        });

        // Notifier le destinataire
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('notification:new', {
            message: `Nouveau message de ${message.sender.prenom} ${message.sender.nom}`,
            type: 'info'
          });
        }

      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        socket.emit('message:error', { error: 'Erreur lors de l\'envoi du message' });
      }
    });

   
    // Utilisateur en train de taper
    socket.on('typing:start', (data) => {
      const { receiverId } = data;
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:user', {
          userId,
          isTyping: true
        });
      }
    });

    socket.on('typing:stop', (data) => {
      const { receiverId } = data;
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing:user', {
          userId,
          isTyping: false
        });
      }
    });

    // Marquer les messages comme lus
    socket.on('messages:mark-read', async (data) => {
      try {
        const { senderId } = data;

        await prisma.historiqueMessage.updateMany({
          where: {
            senderId,
            receiverId: userId,
            lu: false
          },
          data: {
            lu: true
          }
        });

        socket.emit('messages:marked-read', { senderId });

        // Notifier l'expéditeur
        const senderSocketId = connectedUsers.get(senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('messages:read-by', { userId });
        }

      } catch (error) {
        console.error('Erreur lors du marquage des messages:', error);
      }
    });

    // ========== MESSAGES EN TEMPS RÉEL (AVEC SAUVEGARDE BDD) ==========

    // Envoyer un message en temps réel (avec sauvegarde DB)
    socket.on('realtime:message:send', async (message) => {
      try {
        console.log(`💬 Message temps réel de ${userId} vers ${message.receiverId}`);

        // Sauvegarder le message dans la base de données
        const savedMessage = await prisma.historiqueMessage.create({
          data: {
            senderId: userId,
            receiverId: message.receiverId,
            contenu: message.contenu,
            typeMessage: 'text',
            lu: false
          },
          include: {
            sender: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true
              }
            },
            receiver: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true
              }
            }
          }
        });

        // Créer le message enrichi pour Socket.IO
        const realtimeMessage = {
          id: savedMessage.id.toString(),
          senderId: savedMessage.senderId,
          receiverId: savedMessage.receiverId,
          contenu: savedMessage.contenu,
          timestamp: new Date(savedMessage.dateEnvoi).getTime(),
          lu: savedMessage.lu,
          senderName: `${savedMessage.sender.prenom} ${savedMessage.sender.nom}`
        };

        const receiverSocketId = connectedUsers.get(message.receiverId);

        // Envoyer au destinataire s'il est en ligne
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('realtime:message:received', realtimeMessage);
          console.log(`✅ Message délivré à ${message.receiverId}`);
        } else {
          console.log(`⚠️ Destinataire ${message.receiverId} hors ligne (message sauvegardé en BDD)`);
        }

        // Confirmer à l'expéditeur
        socket.emit('realtime:message:sent', realtimeMessage);

      } catch (error) {
        console.error('Erreur message temps réel:', error);
        socket.emit('realtime:message:error', { error: 'Erreur lors de l\'envoi' });
      }
    });

    // Marquer un message comme lu (temps réel)
    socket.on('realtime:message:mark-read', async (data) => {
      try {
        const { messageId } = data;

        // Mettre à jour dans la base de données
        await prisma.historiqueMessage.update({
          where: { id: parseInt(messageId) },
          data: { lu: true }
        });

        // Notifier tous les clients concernés
        io.emit('realtime:message:read', { messageId });

      } catch (error) {
        console.error('Erreur marquage lu:', error);
      }
    });

    // Modifier un message (temps réel)
    socket.on('realtime:message:update', async (data) => {
      try {
        const { messageId, contenu } = data;

        // Vérifier que le message appartient à l'utilisateur
        const existingMessage = await prisma.historiqueMessage.findFirst({
          where: {
            id: parseInt(messageId),
            senderId: userId
          }
        });

        if (!existingMessage) {
          socket.emit('realtime:message:error', { error: 'Message introuvable ou non autorisé' });
          return;
        }

        // Mettre à jour dans la base de données
        const updatedMessage = await prisma.historiqueMessage.update({
          where: { id: parseInt(messageId) },
          data: { contenu },
          include: {
            sender: {
              select: { id: true, nom: true, prenom: true, email: true }
            },
            receiver: {
              select: { id: true, nom: true, prenom: true, email: true }
            }
          }
        });

        // Créer le message enrichi
        const realtimeMessage = {
          id: updatedMessage.id.toString(),
          senderId: updatedMessage.senderId,
          receiverId: updatedMessage.receiverId,
          contenu: updatedMessage.contenu,
          timestamp: new Date(updatedMessage.dateEnvoi).getTime(),
          lu: updatedMessage.lu,
          senderName: `${updatedMessage.sender.prenom} ${updatedMessage.sender.nom}`
        };

        const receiverSocketId = connectedUsers.get(updatedMessage.receiverId);

        // Notifier le destinataire
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('realtime:message:updated', realtimeMessage);
        }

        // Confirmer à l'expéditeur
        socket.emit('realtime:message:updated', realtimeMessage);

      } catch (error) {
        console.error('Erreur modification message:', error);
        socket.emit('realtime:message:error', { error: 'Erreur lors de la modification' });
      }
    });

    // Supprimer un message pour moi uniquement (temps réel)
    socket.on('realtime:message:delete-for-me', async (data) => {
      try {
        const { messageId } = data;

        // Vérifier que le message existe
        const existingMessage = await prisma.historiqueMessage.findFirst({
          where: {
            id: parseInt(messageId),
            OR: [
              { senderId: userId },
              { receiverId: userId }
            ]
          }
        });

        if (!existingMessage) {
          socket.emit('realtime:message:error', { error: 'Message introuvable' });
          return;
        }

        // Marquer comme supprimé pour l'utilisateur
        const isSender = existingMessage.senderId === userId;
        await prisma.historiqueMessage.update({
          where: { id: parseInt(messageId) },
          data: isSender ? { deletedBySender: true } : { deletedByReceiver: true }
        });

        // Confirmer à l'expéditeur (seulement lui voit la suppression)
        socket.emit('realtime:message:deleted-for-me', {
          messageId: messageId.toString(),
          senderId: existingMessage.senderId,
          receiverId: existingMessage.receiverId
        });

      } catch (error) {
        console.error('Erreur suppression message:', error);
        socket.emit('realtime:message:error', { error: 'Erreur lors de la suppression' });
      }
    });

    // Supprimer un message pour tout le monde (temps réel)
    socket.on('realtime:message:delete-for-everyone', async (data) => {
      try {
        const { messageId } = data;

        // Vérifier que le message appartient à l'utilisateur (seulement le sender peut supprimer pour tous)
        const existingMessage = await prisma.historiqueMessage.findFirst({
          where: {
            id: parseInt(messageId),
            senderId: userId
          }
        });

        if (!existingMessage) {
          socket.emit('realtime:message:error', { error: 'Message introuvable ou non autorisé' });
          return;
        }

        const receiverId = existingMessage.receiverId;
        const senderId = existingMessage.senderId;

        // Supprimer de la base de données
        await prisma.historiqueMessage.delete({
          where: { id: parseInt(messageId) }
        });

        const deletedEvent = {
          messageId: messageId.toString(),
          senderId,
          receiverId
        };

        const receiverSocketId = connectedUsers.get(receiverId);

        // Notifier le destinataire
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('realtime:message:deleted-for-everyone', deletedEvent);
        }

        // Confirmer à l'expéditeur
        socket.emit('realtime:message:deleted-for-everyone', deletedEvent);

      } catch (error) {
        console.error('Erreur suppression message:', error);
        socket.emit('realtime:message:error', { error: 'Erreur lors de la suppression' });
      }
    });

    // Demander les infos d'un utilisateur
    socket.on('user:info:request', async (data) => {
      try {
        const { userId: requestedUserId } = data;

        const user = await prisma.user.findUnique({
          where: { id: requestedUserId },
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        });

        if (user) {
          socket.emit('user:info:response', user);
        }

      } catch (error) {
        console.error('Erreur récupération info user:', error);
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`❌ User ${userId} disconnected`);
      connectedUsers.delete(userId);
      io.emit('users:online', Array.from(connectedUsers.keys()));
    });
  });

  return io;
};

export const getConnectedUsers = (): number[] => {
  return Array.from(connectedUsers.keys());
};
