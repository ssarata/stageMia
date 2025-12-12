import { Router } from 'express';
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission
} from '../controllers/permissionController.js';
import { authenticate } from '../middlewares/auth.js';
import { checkPermission } from '../middlewares/permissions.js';

const router = Router();

/**
 * @swagger
 * /api/permissions:
 *   get:
 *     summary: Obtenir toutes les permissions
 *     description: Retourne la liste complète des permissions disponibles (nécessite la permission VIEW_PERMISSIONS)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.get('/', authenticate, checkPermission('VIEW_PERMISSIONS'), getAllPermissions);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Obtenir une permission par ID
 *     description: Retourne les détails d'une permission spécifique (nécessite la permission VIEW_PERMISSIONS)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la permission
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails de la permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission introuvable
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.get('/:id', authenticate, checkPermission('VIEW_PERMISSIONS'), getPermissionById);

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Créer une nouvelle permission
 *     description: Crée une nouvelle permission système (nécessite la permission CREATE_PERMISSION)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomPermission
 *             properties:
 *               nomPermission:
 *                 type: string
 *                 description: Nom de la permission
 *                 example: MANAGE_REPORTS
 *               description:
 *                 type: string
 *                 description: Description de la permission
 *                 example: Peut créer, modifier et supprimer des rapports
 *     responses:
 *       201:
 *         description: Permission créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.post('/', authenticate, checkPermission('CREATE_PERMISSION'), createPermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   put:
 *     summary: Mettre à jour une permission
 *     description: Modifie les informations d'une permission existante (nécessite la permission UPDATE_PERMISSION)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la permission à mettre à jour
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomPermission:
 *                 type: string
 *                 description: Nouveau nom de la permission
 *                 example: MANAGE_ALL_REPORTS
 *               description:
 *                 type: string
 *                 description: Nouvelle description
 *                 example: Peut gérer tous les rapports du système
 *     responses:
 *       200:
 *         description: Permission mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission introuvable
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.put('/:id', authenticate, checkPermission('UPDATE_PERMISSION'), updatePermission);

/**
 * @swagger
 * /api/permissions/{id}:
 *   delete:
 *     summary: Supprimer une permission
 *     description: Supprime définitivement une permission (nécessite la permission DELETE_PERMISSION)
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la permission à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Permission supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Permission supprimée avec succès
 *       404:
 *         description: Permission introuvable
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.delete('/:id', authenticate, checkPermission('DELETE_PERMISSION'), deletePermission);

export default router;
