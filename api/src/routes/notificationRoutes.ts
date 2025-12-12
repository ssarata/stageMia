import { Router } from 'express';
import {
  getAllNotifications,
  createNotification,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} from '../controllers/notificationController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /api/notifications/unread-count:
 *   get:
 *     summary: Obtenir le nombre de notifications non lues
 *     description: Retourne le nombre total de notifications non lues pour l'utilisateur connecté
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nombre de notifications non lues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 unreadCount:
 *                   type: integer
 *                   example: 5
 *       401:
 *         description: Non authentifié
 */
router.get('/unread-count', authenticate, getUnreadCount);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Obtenir toutes les notifications de l'utilisateur
 *     description: Retourne la liste complète des notifications (lues et non lues)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticate, getAllNotifications);

// /**
//  * @swagger
//  * /api/notifications:
//  *   post:
//  *     summary: Créer une notification
//  *     description: Crée une nouvelle notification pour l'utilisateur
//  *     tags: [Notifications]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - message
//  *             properties:
//  *               message:
//  *                 type: string
//  *                 description: Contenu de la notification
//  *                 example: Vous avez reçu un nouveau message
//  *               type:
//  *                 type: string
//  *                 enum: [info, success, warning, error]
//  *                 default: info
//  *                 description: Type de notification
//  *                 example: info
//  *     responses:
//  *       201:
//  *         description: Notification créée avec succès
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Notification'
//  *       400:
//  *         description: Données invalides
//  *       401:
//  *         description: Non authentifié
//  */
// router.post('/', authenticate, createNotification);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Marquer une notification comme lue
 *     description: Change le statut d'une notification en "lue"
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notification
 *         example: 1
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification marquée comme lue
 *       404:
 *         description: Notification introuvable
 *       401:
 *         description: Non authentifié
 */
router.put('/:id/read', authenticate, markNotificationAsRead);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   put:
 *     summary: Marquer toutes les notifications comme lues
 *     description: Change le statut de toutes les notifications non lues en "lues"
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Toutes les notifications marquées comme lues
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Toutes les notifications ont été marquées comme lues
 *                 count:
 *                   type: integer
 *                   description: Nombre de notifications mises à jour
 *                   example: 5
 *       401:
 *         description: Non authentifié
 */
router.put('/mark-all-read', authenticate, markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Supprimer une notification
 *     description: Supprime définitivement une notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la notification à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Notification supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notification supprimée avec succès
 *       404:
 *         description: Notification introuvable
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticate, deleteNotification);

export default router;
