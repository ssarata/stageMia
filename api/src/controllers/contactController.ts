import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';
import { notifyAdmins } from '../utils/notifyAdmins.js';
import { sendNotificationEmail } from '../services/emailService.js';

// Obtenir tous les contacts de l'utilisateur connecté
export const getAllContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    // MIA peut voir tous les contacts, les autres voient uniquement les leurs
    const canSeeAllContacts = req.user.roleName === 'MIA';

    const contacts = await prisma.contact.findMany({
      where: canSeeAllContacts ? {} : { userId: req.user.id },
      include: {
        categorie: true,
        user: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contacts' });
  }
};

// Obtenir un contact par ID
export const getContactById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;
    const canSeeAllContacts = req.user.roleName === 'MIA';

    const contact = await prisma.contact.findFirst({
      where: canSeeAllContacts
        ? { id: parseInt(id) }
        : {
            id: parseInt(id),
            userId: req.user.id
          },
      include: {
        categorie: true,
        user: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact introuvable' });
      return;
    }

    res.json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du contact' });
  }
};

// Créer un contact
export const createContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { nom, prenom, telephone, email, adresse, fonction, organisation, notes, categorieId } = req.body;

    const contact = await prisma.contact.create({
      data: {
        nom,
        prenom,
        telephone,
        email,
        adresse,
        fonction,
        organisation,
        notes,
        categorieId,
        userId: req.user.id
      },
      include: {
        categorie: true
      }
    });

    const notificationMessage = `${req.user.email} a créé un nouveau contact: ${nom} ${prenom} (${telephone})`;

    // Notifier les administrateurs
    await notifyAdmins(notificationMessage, 'info');

    // Envoyer des emails aux administrateurs
    const adminRole = await prisma.role.findFirst({
      where: { nomRole: 'ADMIN' }
    });

    if (adminRole) {
      const admins = await prisma.user.findMany({
        where: { roleId: adminRole.id }
      });

      // Envoyer un email à chaque admin
      for (const admin of admins) {
        try {
          await sendNotificationEmail(
            admin.email,
            `${admin.nom} ${admin.prenom}`,
            notificationMessage,
            'info'
          );
        } catch (error) {
          console.error(`Erreur lors de l'envoi d'email à ${admin.email}:`, error);
        }
      }
    }

    res.status(201).json(contact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du contact' });
  }
};

// Mettre à jour un contact
export const updateContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;
    const { nom, prenom, telephone, email, adresse, fonction, organisation, notes, categorieId } = req.body;

    // Vérifier si le contact existe
    const existingContact = await prisma.contact.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingContact) {
      res.status(404).json({ error: 'Contact introuvable' });
      return;
    }

    // Vérifier si l'utilisateur est le propriétaire du contact
    if (existingContact.userId !== req.user.id) {
      res.status(403).json({
        error: 'Vous ne pouvez pas modifier ce contact car vous n\'en êtes pas le créateur. Seul le créateur du contact peut le modifier.'
      });
      return;
    }

    const contact = await prisma.contact.update({
      where: {
        id: parseInt(id)
      },
      data: {
        nom,
        prenom,
        telephone,
        email,
        adresse,
        fonction,
        organisation,
        notes,
        categorieId
      }
    });

    const notificationMessage = `${req.user.email} a modifié le contact: ${contact.nom} ${contact.prenom}`;

    // Notifier les administrateurs
    await notifyAdmins(notificationMessage, 'info');

    // Envoyer des emails aux administrateurs
    const adminRole = await prisma.role.findFirst({
      where: { nomRole: 'ADMIN' }
    });

    if (adminRole) {
      const admins = await prisma.user.findMany({
        where: { roleId: adminRole.id }
      });

      // Envoyer un email à chaque admin
      for (const admin of admins) {
        try {
          await sendNotificationEmail(
            admin.email,
            `${admin.nom} ${admin.prenom}`,
            notificationMessage,
            'info'
          );
        } catch (error) {
          console.error(`Erreur lors de l'envoi d'email à ${admin.email}:`, error);
        }
      }
    }

    const updatedContact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
      include: { categorie: true }
    });

    res.json(updatedContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du contact' });
  }
};

// Supprimer un contact
export const deleteContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { id } = req.params;

    const result = await prisma.contact.deleteMany({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });

    if (result.count === 0) {
      res.status(404).json({ error: 'Contact introuvable' });
      return;
    }

    res.json({ message: 'Contact supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du contact' });
  }
};

// Rechercher des contacts
export const searchContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { query } = req.query;
    const canSeeAllContacts = req.user.roleName === 'MIA';

    const whereClause: any = {
      OR: [
        { nom: { contains: query as string, mode: 'insensitive' } },
        { prenom: { contains: query as string, mode: 'insensitive' } },
        { telephone: { contains: query as string } },
        { email: { contains: query as string, mode: 'insensitive' } },
        { organisation: { contains: query as string, mode: 'insensitive' } }
      ]
    };

    // MIA peut chercher dans tous les contacts, les autres dans les leurs
    if (!canSeeAllContacts) {
      whereClause.userId = req.user.id;
    }

    const contacts = await prisma.contact.findMany({
      where: whereClause,
      include: {
        categorie: true,
        user: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la recherche de contacts' });
  }
};
