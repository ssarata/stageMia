import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';
import { notifyAdmins } from '../utils/notifyAdmins.js';

// Obtenir tous les contacts de l'utilisateur connecté
export const getAllContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const contacts = await prisma.contact.findMany({
      where: { userId: req.user.id },
      include: {
        categorie: true
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

    const contact = await prisma.contact.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      },
      include: {
        categorie: true
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

    // Notifier les administrateurs
    await notifyAdmins(
      `${req.user.email} a créé un nouveau contact: ${nom} ${prenom} (${telephone})`,
      'info'
    );

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

    const contact = await prisma.contact.updateMany({
      where: {
        id: parseInt(id),
        userId: req.user.id
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

    if (contact.count === 0) {
      res.status(404).json({ error: 'Contact introuvable' });
      return;
    }

    const updatedContact = await prisma.contact.findUnique({
      where: { id: parseInt(id) },
      include: { categorie: true }
    });

    // Notifier les administrateurs
    if (updatedContact) {
      await notifyAdmins(
        `${req.user.email} a modifié le contact: ${updatedContact.nom} ${updatedContact.prenom}`,
        'info'
      );
    }

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

    const contacts = await prisma.contact.findMany({
      where: {
        userId: req.user.id,
        OR: [
          { nom: { contains: query as string, mode: 'insensitive' } },
          { prenom: { contains: query as string, mode: 'insensitive' } },
          { telephone: { contains: query as string } },
          { email: { contains: query as string, mode: 'insensitive' } },
          { organisation: { contains: query as string, mode: 'insensitive' } }
        ]
      },
      include: {
        categorie: true
      }
    });

    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la recherche de contacts' });
  }
};
