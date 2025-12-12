import prisma from './prismaClient.js';

/**
 * Envoie une notification à tous les administrateurs
 * @param message - Message de la notification
 * @param type - Type de notification (info, success, warning, error)
 */
export const notifyAdmins = async (
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): Promise<void> => {
  try {
    // Trouver tous les utilisateurs avec le rôle Admin
    const adminRole = await prisma.role.findFirst({
      where: { nomRole: 'Admin' }
    });

    if (!adminRole) {
      console.warn('Rôle Admin introuvable');
      return;
    }

    // Récupérer tous les administrateurs
    const admins = await prisma.user.findMany({
      where: { roleId: adminRole.id }
    });

    if (admins.length === 0) {
      console.warn('Aucun administrateur trouvé');
      return;
    }

    // Créer une notification pour chaque admin
    const notifications = admins.map(admin => ({
      message,
      userId: admin.id,
      type,
      lu: false,
      date: new Date()
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    console.log(`✅ Notification envoyée à ${admins.length} administrateur(s)`);
  } catch (error) {
    console.error('Erreur lors de la notification des administrateurs:', error);
  }
};
