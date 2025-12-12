import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';

// Obtenir tous les messages de l'utilisateur connecté
export const getAllMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const messages = await prisma.historiqueMessage.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
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
      },
      orderBy: {
        dateEnvoi: 'desc'
      }
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
};

// Obtenir la conversation entre deux utilisateurs
export const getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { userId } = req.params;
    const otherUserId = parseInt(userId);

    // Récupérer les messages (en excluant ceux supprimés par l'utilisateur)
    const messages = await prisma.historiqueMessage.findMany({
      where: {
        OR: [
          {
            senderId: req.user.id,
            receiverId: otherUserId,
            deletedBySender: false  // Ne pas afficher si supprimé par le sender
          },
          {
            senderId: otherUserId,
            receiverId: req.user.id,
            deletedByReceiver: false  // Ne pas afficher si supprimé par le receiver
          }
        ]
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
      },
      orderBy: {
        dateEnvoi: 'asc'
      }
    });

    // Récupérer les informations du destinataire
    const recipient = await prisma.user.findUnique({
      where: { id: otherUserId },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true
      }
    });

    res.json({
      messages,
      recipient
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la conversation' });
  }
};

// Envoyer un message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { receiverId, contenu, typeMessage } = req.body;

    const message = await prisma.historiqueMessage.create({
      data: {
        senderId: req.user.id,
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

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
};

// Marquer un message comme lu
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;

    const message = await prisma.historiqueMessage.updateMany({
      where: {
        id: parseInt(id),
        receiverId: req.user.id
      },
      data: {
        lu: true
      }
    });

    if (message.count === 0) {
      res.status(404).json({ error: 'Message introuvable' });
      return;
    }

    res.json({ message: 'Message marqué comme lu' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du message' });
  }
};

// Modifier un message
export const updateMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;
    const { contenu } = req.body;

    if (!contenu || !contenu.trim()) {
      res.status(400).json({ error: 'Le contenu ne peut pas être vide' });
      return;
    }

    // Vérifier que le message existe et appartient à l'utilisateur
    const existingMessage = await prisma.historiqueMessage.findFirst({
      where: {
        id: parseInt(id),
        senderId: req.user.id
      }
    });

    if (!existingMessage) {
      res.status(404).json({ error: 'Message introuvable ou non autorisé' });
      return;
    }

    // Mettre à jour le message
    const updatedMessage = await prisma.historiqueMessage.update({
      where: { id: parseInt(id) },
      data: { contenu },
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

    res.json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la modification du message' });
  }
};

// Supprimer un message pour moi uniquement
export const deleteMessageForMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;

    // Vérifier que le message existe
    const existingMessage = await prisma.historiqueMessage.findFirst({
      where: {
        id: parseInt(id),
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      }
    });

    if (!existingMessage) {
      res.status(404).json({ error: 'Message introuvable' });
      return;
    }

    // Marquer comme supprimé pour l'utilisateur
    const isSender = existingMessage.senderId === req.user.id;
    await prisma.historiqueMessage.update({
      where: { id: parseInt(id) },
      data: isSender ? { deletedBySender: true } : { deletedByReceiver: true }
    });

    res.json({
      message: 'Message supprimé pour vous',
      id: parseInt(id),
      isSender,
      senderId: existingMessage.senderId,
      receiverId: existingMessage.receiverId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
};

// Supprimer un message pour tout le monde
export const deleteMessageForEveryone = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;

    // Vérifier que le message existe et appartient à l'utilisateur (seulement le sender peut supprimer pour tous)
    const existingMessage = await prisma.historiqueMessage.findFirst({
      where: {
        id: parseInt(id),
        senderId: req.user.id
      }
    });

    if (!existingMessage) {
      res.status(404).json({ error: 'Message introuvable ou non autorisé' });
      return;
    }

    // Supprimer complètement le message
    await prisma.historiqueMessage.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      message: 'Message supprimé pour tout le monde',
      id: parseInt(id),
      senderId: existingMessage.senderId,
      receiverId: existingMessage.receiverId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
};

// Obtenir les conversations récentes
export const getRecentConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const messages = await prisma.historiqueMessage.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
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
      },
      orderBy: {
        dateEnvoi: 'desc'
      }
    });

    // Grouper par conversation
    const conversationsMap = new Map();

    messages.forEach(message => {
      const otherUserId = message.senderId === req.user!.id ? message.receiverId : message.senderId;

      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          user: message.senderId === req.user!.id ? message.receiver : message.sender,
          lastMessage: message,
          unreadCount: 0
        });
      }

      if (message.receiverId === req.user!.id && !message.lu) {
        conversationsMap.get(otherUserId).unreadCount++;
      }
    });

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des conversations' });
  }
};
