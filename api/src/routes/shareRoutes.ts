import { Router } from 'express';
import {
  shareContact,
  getSharedContacts,
  generateShareLink
} from '../controllers/shareController.js';
import authenticateToken from '../middlewares/auth.js';
import { ensurePermission } from '../middlewares/ensurePermission.js';

const router = Router();

/**
 * @swagger
 * /api/share/contact:
 *   post:
 *     summary: Partager un contact par email ou réseaux sociaux
 *     description: Partage un contact via email ou génère un lien pour les réseaux sociaux
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
 *               - recipientEmail
 *             properties:
 *               contactId:
 *                 type: integer
 *                 description: ID du contact à partager
 *                 example: 5
 *               recipientEmail:
 *                 type: string
 *                 format: email
 *                 description: Email du destinataire
 *                 example: destinataire@example.com
 *               platform:
 *                 type: string
 *                 enum: [email, whatsapp, telegram, facebook, linkedin, instagram]
 *                 description: Plateforme de partage
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
 *                 recipientEmail:
 *                   type: string
 *                   example: destinataire@example.com
 *                 platform:
 *                   type: string
 *                   example: email
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Contact introuvable
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission insuffisante
 *       500:
 *         description: Service email non configuré
 */
router.post('/contact', authenticateToken, ensurePermission('SharedContact.create'), shareContact);

/**
 * @swagger
 * /api/share/history:
 *   get:
 *     summary: Obtenir l'historique des partages de l'utilisateur
 *     description: Retourne la liste des contacts que vous avez partagés
 *     tags: [Share]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historique des partages
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
 *                   platform:
 *                     type: string
 *                   sharedAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission insuffisante
 */
router.get('/history', authenticateToken, ensurePermission('SharedContact.read'), getSharedContacts);

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
 *       403:
 *         description: Permission insuffisante
 */
router.post('/generate-link', authenticateToken, ensurePermission('SharedContact.create'), generateShareLink);

export default router;
