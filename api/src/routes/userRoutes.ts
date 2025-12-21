import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  assignRoleToUser
} from '../controllers/userController.js';
import authenticateToken from '../middlewares/auth.js';
import { ensurePermission, ensureAdmin } from '../middlewares/ensurePermission.js';
import { validatePhone } from '../middlewares/validatePhone.js';

const router = Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     description: Retourne les informations complètes du profil de l'utilisateur authentifié
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtenir tous les utilisateurs
 *     description: Retourne la liste de tous les utilisateurs (nécessite la permission VIEW_USERS)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.get('/', authenticateToken, ensurePermission('user.read'), getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtenir un utilisateur par ID
 *     description: Retourne les informations d'un utilisateur spécifique
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur introuvable
 *       401:
 *         description: Non authentifié
 */
router.get('/:id', authenticateToken, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: Crée un nouvel utilisateur (nécessite la permission CREATE_USER)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - telephone
 *               - motDePasse
 *               - adresse
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Ouedraogo
 *               prenom:
 *                 type: string
 *                 example: Fatima
 *               email:
 *                 type: string
 *                 format: email
 *                 example: fatima.ouedraogo@example.com
 *               telephone:
 *                 type: string
 *                 example: "+22670987654"
 *               motDePasse:
 *                 type: string
 *                 format: password
 *                 example: SecurePassword123!
 *               adresse:
 *                 type: string
 *                 example: Ouagadougou, Burkina Faso
 *               sexe:
 *                 type: string
 *                 enum: [M, F, Autre]
 *                 example: F
 *               roleId:
 *                 type: integer
 *                 description: ID du rôle à assigner
 *                 example: 2
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.post('/', authenticateToken, ensurePermission('user.create'), validatePhone({ field: 'telephone', required: true }), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     description: Modifie les informations d'un utilisateur (nécessite la permission UPDATE_USER)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à mettre à jour
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               telephone:
 *                 type: string
 *               adresse:
 *                 type: string
 *               sexe:
 *                 type: string
 *                 enum: [M, F, Autre]
 *               roleId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Utilisateur introuvable
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.put('/:id', authenticateToken, ensurePermission('user.update'), validatePhone({ field: 'telephone', required: false }), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprime un utilisateur définitivement (nécessite la permission DELETE_USER)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur introuvable
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 */
router.delete('/:id', authenticateToken, ensurePermission('user.delete'), deleteUser);

/**
 * @swagger
 * /api/users/assign-role:
 *   post:
 *     summary: Attribuer un rôle à un utilisateur
 *     description: Permet à un administrateur d'attribuer ou modifier le rôle d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - roleId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID de l'utilisateur
 *                 example: 5
 *               roleId:
 *                 type: integer
 *                 description: ID du rôle à attribuer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Rôle attribué avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rôle "MIA" attribué avec succès à Jean Dupont
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée (admin requis)
 *       404:
 *         description: Utilisateur ou rôle introuvable
 *       500:
 *         description: Erreur serveur
 */
router.post('/assign-role', authenticateToken, ensureAdmin, assignRoleToUser);

export default router;
