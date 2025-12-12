import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';

// Obtenir toutes les notifications de l'utilisateur connecté
export const getAllNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
  }
};

// Créer une notification
export const createNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, userId, type } = req.body;

    const notification = await prisma.notification.create({
      data: {
        message,
        userId,
        type: type || 'info'
      }
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la notification' });
  }
};

// Marquer une notification comme lue
export const markNotificationAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;

    const notification = await prisma.notification.updateMany({
      where: {
        id: parseInt(id),
        userId: req.user.id
      },
      data: {
        lu: true
      }
    });

    if (notification.count === 0) {
      res.status(404).json({ error: 'Notification introuvable' });
      return;
    }

    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
  }
};

// Marquer toutes les notifications comme lues
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    await prisma.notification.updateMany({
      where: {
        userId: req.user.id,
        lu: false
      },
      data: {
        lu: true
      }
    });

    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour des notifications' });
  }
};

// Supprimer une notification
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;

    const result = await prisma.notification.deleteMany({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (result.count === 0) {
      res.status(404).json({ error: 'Notification introuvable' });
      return;
    }

    res.json({ message: 'Notification supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
  }
};

// Obtenir le nombre de notifications non lues
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const count = await prisma.notification.count({
      where: {
        userId: req.user.id,
        lu: false
      }
    });

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du comptage des notifications' });
  }
};
