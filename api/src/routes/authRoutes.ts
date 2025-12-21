import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, verifyResetToken } from '../controllers/authController.js';
import { validatePhone } from '../middlewares/validatePhone.js';

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
 *                 example: "+22670123456"
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
 *                 description: ID du rôle (optionnel, 2 par défaut)
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
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Email ou téléphone déjà utilisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', validatePhone({ field: 'telephone', required: true }), register);

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
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Email ou mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Demander une réinitialisation de mot de passe
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.
 *       400:
 *         description: Email requis
 *       500:
 *         description: Erreur serveur
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token reçu par email
 *                 example: abc123def456...
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Votre mot de passe a été réinitialisé avec succès
 *       400:
 *         description: Token invalide ou mot de passe trop court
 *       500:
 *         description: Erreur serveur
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/verify-token/{token}:
 *   get:
 *     summary: Vérifier la validité d'un token de réinitialisation
 *     tags: [Authentication]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de réinitialisation à vérifier
 *     responses:
 *       200:
 *         description: Résultat de la vérification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Token requis
 *       500:
 *         description: Erreur serveur
 */
router.get('/verify-token/:token', verifyResetToken);

export default router;
