import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';
import { notifyAdmins } from '../utils/notifyAdmins.js';
import { sendContactByEmail, isEmailConfigured } from '../utils/nodemailerService.js';
import { sendNotificationEmail } from '../services/nodemailerService.js';

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

    // Partage par email uniquement
    if (!recipientEmail) {
      res.status(400).json({ error: 'recipientEmail requis pour le partage' });
      return;
    }

    if (!isEmailConfigured()) {
      res.status(500).json({ error: 'Service email non configuré' });
      return;
    }

    const senderName = `${req.user.nom} ${req.user.prenom}`;

    // Envoyer le contact par email
    await sendContactByEmail(recipientEmail, contact, senderName);

    // Enregistrer le partage
    await prisma.sharedContact.create({
      data: {
        contactId,
        userId: req.user.id,
        recipientId: req.user.id,
        platform: platform || 'email'
      }
    });

    // Notifier l'utilisateur qui a partagé
    const userMessage = `Vous avez partagé le contact "${contact.nom} ${contact.prenom}" par email à ${recipientEmail}`;
    try {
      await sendNotificationEmail(
        req.user.email,
        `${req.user.nom} ${req.user.prenom}`,
        userMessage,
        'success'
      );
    } catch (error) {
      console.error(`Erreur lors de l'envoi d'email à ${req.user.email}:`, error);
    }

    // Notifier les administrateurs
    const adminMessage = `${req.user.nom} ${req.user.prenom} (${req.user.email}) a partagé le contact "${contact.nom} ${contact.prenom}" par ${platform || 'email'} à ${recipientEmail}`;
    await notifyAdmins(adminMessage, 'info');

    // Envoyer des emails aux administrateurs
    const adminRole = await prisma.role.findFirst({
      where: { nomRole: 'ADMIN' }
    });

    if (adminRole) {
      const admins = await prisma.user.findMany({
        where: { roleId: adminRole.id }
      });

      for (const admin of admins) {
        try {
          await sendNotificationEmail(
            admin.email,
            `${admin.nom} ${admin.prenom}`,
            adminMessage,
            'info'
          );
        } catch (error) {
          console.error(`Erreur lors de l'envoi d'email à ${admin.email}:`, error);
        }
      }
    }

    res.status(201).json({
      message: 'Contact partagé avec succès',
      recipientEmail,
      platform: platform || 'email'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors du partage du contact' });
  }
};

// Obtenir l'historique des partages de l'utilisateur
export const getSharedContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const sharedContacts = await prisma.sharedContact.findMany({
      where: { userId: req.user.id },
      include: {
        contact: {
          include: {
            categorie: true
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
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'historique des partages' });
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

