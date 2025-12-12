import { Router } from 'express';
import {
  shareContact,
  getSharedContacts,
  generateShareLink,
  importSharedContact
} from '../controllers/shareController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /api/share/contact:
 *   post:
 *     summary: Partager un contact avec un autre utilisateur
 *     description: Partage un contact via le système interne ou par email
 *     tags: [Share]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactId
 *             properties:
 *               contactId:
 *                 type: integer
 *                 description: ID du contact à partager
 *                 example: 5
 *               recipientId:
 *                 type: integer
 *                 description: ID de l'utilisateur destinataire (pour partage interne)
 *                 example: 3
 *               recipientEmail:
 *                 type: string
 *                 format: email
 *                 description: Email du destinataire (pour partage par email)
 *                 example: destinataire@example.com
 *               platform:
 *                 type: string
 *                 enum: [internal, email]
 *                 description: Plateforme de partage (internal ou email)
 *                 example: email
 *     responses:
 *       201:
 *         description: Contact partagé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact partagé avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Contact ou utilisateur introuvable
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Service email non configuré
 */
router.post('/contact', authenticate, shareContact);

/**
 * @swagger
 * /api/share/received:
 *   get:
 *     summary: Obtenir tous les contacts partagés avec l'utilisateur
 *     description: Retourne la liste des contacts que d'autres utilisateurs ont partagés avec vous
 *     tags: [Share]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts partagés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   contact:
 *                     $ref: '#/components/schemas/Contact'
 *                   sharedBy:
 *                     $ref: '#/components/schemas/User'
 *                   sharedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non authentifié
 */
router.get('/received', authenticate, getSharedContacts);

/**
 * @swagger
 * /api/share/generate-link:
 *   post:
 *     summary: Générer un lien de partage pour les réseaux sociaux
 *     description: Crée des liens formatés pour partager un contact sur WhatsApp, Telegram, Facebook, LinkedIn, Instagram
 *     tags: [Share]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contactId
 *               - platform
 *             properties:
 *               contactId:
 *                 type: integer
 *                 description: ID du contact à partager
 *                 example: 5
 *               platform:
 *                 type: string
 *                 enum: [whatsapp, telegram, facebook, linkedin, instagram]
 *                 description: Plateforme de partage
 *                 example: whatsapp
 *     responses:
 *       200:
 *         description: Lien de partage généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shareUrl:
 *                   type: string
 *                   example: https://wa.me/?text=Contact%3A%20Kofi%20Kouassi%0A%2B22670123456
 *                 platform:
 *                   type: string
 *                   example: whatsapp
 *       400:
 *         description: Plateforme invalide
 *       404:
 *         description: Contact introuvable
 *       401:
 *         description: Non authentifié
 */
router.post('/generate-link', authenticate, generateShareLink);

/**
 * @swagger
 * /api/share/import:
 *   post:
 *     summary: Importer un contact partagé dans ses propres contacts
 *     description: Crée une copie d'un contact partagé dans votre liste de contacts personnelle
 *     tags: [Share]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sharedContactId
 *             properties:
 *               sharedContactId:
 *                 type: integer
 *                 description: ID du contact partagé à importer
 *                 example: 12
 *               categorieId:
 *                 type: integer
 *                 description: ID de la catégorie pour ce contact (optionnel)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Contact importé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact partagé introuvable
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/import', authenticate, importSharedContact);

export default router;
