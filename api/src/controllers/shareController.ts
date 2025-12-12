import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';
import { notifyAdmins } from '../utils/notifyAdmins.js';
import { sendContactByEmail, isEmailConfigured } from '../utils/emailService.js';

// Partager un contact avec un autre utilisateur
export const shareContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { contactId, recipientId, recipientEmail, platform } = req.body;

    // Vérifier que le contact appartient à l'utilisateur
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
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

    // Si un email est fourni, partager par email
    if (recipientEmail && platform === 'email') {
      if (!isEmailConfigured()) {
        res.status(500).json({ error: 'Service email non configuré' });
        return;
      }

      const senderName = `${req.user.email}`;

      await sendContactByEmail(recipientEmail, contact, senderName);

      // Enregistrer le partage par email
      await prisma.sharedContact.create({
        data: {
          contactId,
          userId: req.user.id,
          recipientId: req.user.id, // Pour l'email, on met l'ID de l'expéditeur
          platform: 'email'
        }
      });

      // Notifier les administrateurs
      await notifyAdmins(
        `${req.user.email} a partagé le contact "${contact.nom} ${contact.prenom}" par email à ${recipientEmail}`,
        'info'
      );

      res.status(201).json({
        message: 'Contact partagé par email avec succès',
        recipientEmail
      });
      return;
    }

    // Partage interne (utilisateur de l'application)
    if (!recipientId) {
      res.status(400).json({ error: 'recipientId requis pour le partage interne' });
      return;
    }

    // Créer l'enregistrement de partage
    const share = await prisma.sharedContact.create({
      data: {
        contactId,
        userId: req.user.id,
        recipientId,
        platform: platform || 'internal'
      },
      include: {
        contact: true,
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    // Créer une notification pour le destinataire
    await prisma.notification.create({
      data: {
        message: `${req.user.email} a partagé un contact avec vous: ${contact.nom} ${contact.prenom}`,
        userId: recipientId,
        type: 'info'
      }
    });

    // Notifier les administrateurs
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { email: true }
    });

    await notifyAdmins(
      `${req.user.email} a partagé le contact "${contact.nom} ${contact.prenom}" avec ${recipient?.email || 'un utilisateur'}`,
      'info'
    );

    res.status(201).json(share);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du partage du contact' });
  }
};

// Obtenir tous les contacts partagés avec l'utilisateur
export const getSharedContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const sharedContacts = await prisma.sharedContact.findMany({
      where: { recipientId: req.user.id },
      include: {
        contact: {
          include: {
            categorie: true
          }
        },
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      },
      orderBy: {
        sharedAt: 'desc'
      }
    });

    res.json(sharedContacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des contacts partagés' });
  }
};

// Générer un lien de partage pour les réseaux sociaux
export const generateShareLink = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { contactId, platform } = req.body;

    // Vérifier que le contact appartient à l'utilisateur
    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId: req.user.id
      }
    });

    if (!contact) {
      res.status(404).json({ error: 'Contact introuvable' });
      return;
    }

    // Générer le texte du contact
    const contactText = `
Nom: ${contact.nom} ${contact.prenom}
Téléphone: ${contact.telephone}
${contact.email ? `Email: ${contact.email}` : ''}
${contact.organisation ? `Organisation: ${contact.organisation}` : ''}
${contact.fonction ? `Fonction: ${contact.fonction}` : ''}
    `.trim();

    let shareLink = '';

    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(contactText)}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(contactText)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(contactText)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://mia-app.com')}&summary=${encodeURIComponent(contactText)}`;
        break;
      case 'instagram':
        // Instagram ne permet pas de partage direct via URL, on retourne juste le texte
        res.json({ message: 'Pour Instagram, copiez et collez ce texte', text: contactText });
        return;
      default:
        res.status(400).json({ error: 'Plateforme non supportée' });
        return;
    }

    res.json({ shareLink, text: contactText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la génération du lien de partage' });
  }
};

// Importer un contact partagé dans ses propres contacts
export const importSharedContact = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const { sharedContactId } = req.body;

    // Récupérer le contact partagé
    const sharedContact = await prisma.sharedContact.findFirst({
      where: {
        id: sharedContactId,
        recipientId: req.user.id
      },
      include: {
        contact: true
      }
    });

    if (!sharedContact) {
      res.status(404).json({ error: 'Contact partagé introuvable' });
      return;
    }

    // Créer une copie du contact pour l'utilisateur
    const newContact = await prisma.contact.create({
      data: {
        nom: sharedContact.contact.nom,
        prenom: sharedContact.contact.prenom,
        telephone: sharedContact.contact.telephone,
        email: sharedContact.contact.email,
        adresse: sharedContact.contact.adresse,
        fonction: sharedContact.contact.fonction,
        organisation: sharedContact.contact.organisation,
        notes: `Contact partagé par un autre utilisateur`,
        userId: req.user.id,
        categorieId: sharedContact.contact.categorieId
      },
      include: {
        categorie: true
      }
    });

    res.status(201).json(newContact);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'importation du contact' });
  }
};
