import { Router } from 'express';
import {
  getAllMessages,
  getConversation,
  sendMessage,
  markAsRead,
  getRecentConversations,
  updateMessage,
  deleteMessageForMe,
  deleteMessageForEveryone
} from '../controllers/messageController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Obtenir les conversations récentes
 *     description: Retourne la liste des conversations avec le dernier message et le nombre de messages non lus
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *                   lastMessage:
 *                     $ref: '#/components/schemas/Message'
 *                   unreadCount:
 *                     type: integer
 *                     example: 3
 *       401:
 *         description: Non authentifié
 */
router.get('/conversations', authenticate, getRecentConversations);

/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Obtenir tous les messages de l'utilisateur
 *     description: Retourne tous les messages envoyés et reçus
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticate, getAllMessages);

/**
 * @swagger
 * /api/messages/conversation/{userId}:
 *   get:
 *     summary: Obtenir la conversation avec un utilisateur spécifique
 *     description: Retourne tous les messages échangés avec un utilisateur
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'autre utilisateur
 *         example: 2
 *     responses:
 *       200:
 *         description: Messages de la conversation (triés par date)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       401:
 *         description: Non authentifié
 */
router.get('/conversation/:userId', authenticate, getConversation);

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Envoyer un message
 *     description: Envoie un message à un autre utilisateur (REST API, pour temps réel utiliser Socket.IO)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - contenu
 *             properties:
 *               receiverId:
 *                 type: integer
 *                 description: ID du destinataire
 *                 example: 2
 *               contenu:
 *                 type: string
 *                 description: Contenu du message
 *                 example: Bonjour! Comment vas-tu?
 *               typeMessage:
 *                 type: string
 *                 enum: [text, contact, file]
 *                 default: text
 *                 description: Type de message
 *                 example: text
 *     responses:
 *       201:
 *         description: Message envoyé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authenticate, sendMessage);

/**
 * @swagger
 * /api/messages/{id}/read:
 *   put:
 *     summary: Marquer un message comme lu
 *     description: Change le statut d'un message reçu en "lu"
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du message
 *         example: 1
 *     responses:
 *       200:
 *         description: Message marqué comme lu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Message marqué comme lu
 *       404:
 *         description: Message introuvable
 *       401:
 *         description: Non authentifié
 */
router.put('/:id/read', authenticate, markAsRead);

/**
 * @swagger
 * /api/messages/{id}:
 *   put:
 *     summary: Modifier un message
 *     description: Permet à l'expéditeur de modifier le contenu d'un message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du message
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contenu
 *             properties:
 *               contenu:
 *                 type: string
 *                 description: Nouveau contenu du message
 *                 example: Message modifié
 *     responses:
 *       200:
 *         description: Message modifié avec succès
 *       400:
 *         description: Contenu invalide
 *       404:
 *         description: Message introuvable ou non autorisé
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticate, updateMessage);

/**
 * @swagger
 * /api/messages/{id}/delete-for-me:
 *   delete:
 *     summary: Supprimer un message pour moi uniquement
 *     description: Le message reste visible pour l'autre personne
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du message
 *         example: 1
 *     responses:
 *       200:
 *         description: Message supprimé pour vous
 *       404:
 *         description: Message introuvable
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id/delete-for-me', authenticate, deleteMessageForMe);

/**
 * @swagger
 * /api/messages/{id}/delete-for-everyone:
 *   delete:
 *     summary: Supprimer un message pour tout le monde
 *     description: Supprime définitivement le message pour les deux parties (seulement l'expéditeur)
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du message
 *         example: 1
 *     responses:
 *       200:
 *         description: Message supprimé pour tout le monde
 *       404:
 *         description: Message introuvable ou non autorisé
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id/delete-for-everyone', authenticate, deleteMessageForEveryone);

export default router;
