import { Router } from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} from '../controllers/roleController.js';
import { authenticate } from '../middlewares/auth.js';
import { checkPermission } from '../middlewares/permissions.js';

const router = Router();

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtenir tous les rôles
 *     description: Retourne la liste complète des rôles (nécessite la permission VIEW_ROLES)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des rôles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.get('/', authenticate, checkPermission('VIEW_ROLES'), getAllRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtenir un rôle par ID
 *     description: Retourne les détails d'un rôle spécifique (nécessite la permission VIEW_ROLES)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rôle
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails du rôle
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rôle introuvable
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.get('/:id', authenticate, checkPermission('VIEW_ROLES'), getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Créer un nouveau rôle
 *     description: Crée un nouveau rôle avec des permissions associées (nécessite la permission CREATE_ROLE)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomRole
 *             properties:
 *               nomRole:
 *                 type: string
 *                 description: Nom du rôle
 *                 example: Modérateur
 *               description:
 *                 type: string
 *                 description: Description du rôle
 *                 example: Peut modérer les contenus et gérer les utilisateurs
 *     responses:
 *       201:
 *         description: Rôle créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.post('/', authenticate, checkPermission('CREATE_ROLE'), createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Mettre à jour un rôle
 *     description: Modifie les informations d'un rôle existant (nécessite la permission UPDATE_ROLE)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rôle à mettre à jour
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomRole:
 *                 type: string
 *                 description: Nouveau nom du rôle
 *                 example: Modérateur Senior
 *               description:
 *                 type: string
 *                 description: Nouvelle description
 *                 example: Modérateur avec privilèges étendus
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rôle introuvable
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.put('/:id', authenticate, checkPermission('UPDATE_ROLE'), updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Supprimer un rôle
 *     description: Supprime définitivement un rôle (nécessite la permission DELETE_ROLE)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du rôle à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Rôle supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rôle supprimé avec succès
 *       404:
 *         description: Rôle introuvable
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.delete('/:id', authenticate, checkPermission('DELETE_ROLE'), deleteRole);

export default router;
