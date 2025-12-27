import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';

/**
 * Obtenir les statistiques globales du dashboard
 */
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.roleName === 'ADMIN';
    const isMIA = req.user?.roleName === 'MIA';
    const canSeeAllContacts = isAdmin || isMIA;

    // Statistiques des utilisateurs (tous les rôles peuvent voir)
    const totalUsers = await prisma.user.count();

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)) // Premier jour du mois
        }
      }
    });

    // Statistiques des contacts - MIA voit tous les contacts
    const totalContacts = canSeeAllContacts
      ? await prisma.contact.count()
      : await prisma.contact.count({
          where: { userId }
        });

    const newContactsThisMonth = canSeeAllContacts
      ? await prisma.contact.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setDate(1))
            }
          }
        })
      : await prisma.contact.count({
          where: {
            userId,
            createdAt: {
              gte: new Date(new Date().setDate(1))
            }
          }
        });

    // Statistiques des messages
    const totalMessages = await prisma.historiqueMessage.count({
      where: userId && !isAdmin && !isMIA
        ? {
            OR: [
              { senderId: userId },
              { receiverId: userId }
            ]
          }
        : undefined
    });

    const unreadMessages = await prisma.historiqueMessage.count({
      where: {
        receiverId: userId,
        lu: false,
        deletedByReceiver: false
      }
    });

    // Statistiques des notifications
    const totalNotifications = await prisma.notification.count({
      where: { userId }
    });

    const unreadNotifications = await prisma.notification.count({
      where: {
        userId,
        lu: false
      }
    });

    // Statistiques des partages
    const totalShares = userId
      ? await prisma.sharedContact.count({
          where: {
            OR: [
              { userId },
              { recipientId: userId }
            ]
          }
        })
      : await prisma.sharedContact.count();

    const sharesThisMonth = userId
      ? await prisma.sharedContact.count({
          where: {
            OR: [
              { userId },
              { recipientId: userId }
            ],
            sharedAt: {
              gte: new Date(new Date().setDate(1))
            }
          }
        })
      : await prisma.sharedContact.count({
          where: {
            sharedAt: {
              gte: new Date(new Date().setDate(1))
            }
          }
        });

    // Statistiques par catégorie de contacts - MIA voit toutes les catégories
    const contactsByCategory = canSeeAllContacts
      ? await prisma.categorie.findMany({
          select: {
            nomCategorie: true,
            _count: {
              select: {
                contacts: true
              }
            }
          }
        })
      : await prisma.categorie.findMany({
          where: {
            contacts: {
              some: {
                userId
              }
            }
          },
          select: {
            nomCategorie: true,
            _count: {
              select: {
                contacts: {
                  where: {
                    userId
                  }
                }
              }
            }
          }
        });

    // Activité récente des messages (7 derniers jours)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentMessages = await prisma.historiqueMessage.groupBy({
      by: ['dateEnvoi'],
      where: userId && !isAdmin && !isMIA
        ? {
            OR: [
              { senderId: userId },
              { receiverId: userId }
            ],
            dateEnvoi: {
              gte: last7Days
            }
          }
        : {
            dateEnvoi: {
              gte: last7Days
            }
          },
      _count: true
    });

    // Répartition des partages par plateforme
    const sharesByPlatform = await prisma.sharedContact.groupBy({
      by: ['platform'],
      where: userId && !isAdmin && !isMIA
        ? {
            OR: [
              { userId },
              { recipientId: userId }
            ]
          }
        : undefined,
      _count: true
    });

    res.json({
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth
      },
      contacts: {
        total: totalContacts,
        newThisMonth: newContactsThisMonth,
        byCategory: contactsByCategory.map(cat => ({
          category: cat.nomCategorie,
          count: cat._count.contacts
        }))
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        recentActivity: recentMessages.map(msg => ({
          date: msg.dateEnvoi,
          count: msg._count
        }))
      },
      notifications: {
        total: totalNotifications,
        unread: unreadNotifications
      },
      shares: {
        total: totalShares,
        thisMonth: sharesThisMonth,
        byPlatform: sharesByPlatform.map(share => ({
          platform: share.platform,
          count: share._count
        }))
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
  }
};
