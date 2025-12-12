import { Router } from 'express';
import { register, login } from '../controllers/authController.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentication]
 *     security: []
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
 *                 example: Koffi
 *               prenom:
 *                 type: string
 *                 example: Ama
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ama.koffi@example.com
 *               telephone:
 *                 type: string
 *                 description: Format international (+226...)
 *                 example: +22670123456
 *               motDePasse:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *               adresse:
 *                 type: string
 *                 example: Ouagadougou, Burkina Faso
 *               sexe:
 *                 type: string
 *                 enum: [M, F, Autre]
 *                 example: F
 *               roleId:
 *                 type: integer
 *                 description: ID du rôle (optionnel, 2 par défaut pour utilisateur)
 *                 example: 2
 *     responses:
 *       201:
 *         description: Inscription réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inscription réussie
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT pour l'authentification
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email ou téléphone déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@mia.com
 *               motDePasse:
 *                 type: string
 *                 format: password
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Connexion réussie
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Token JWT à utiliser pour les requêtes suivantes
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Email ou mot de passe incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', login);

export default router;
