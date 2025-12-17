import { Router } from 'express';
import {
  getAllCategories,
  getCategorieById,
  createCategorie,
  updateCategorie,
  deleteCategorie
} from '../controllers/categorieController.js';
import authenticateToken from '../middlewares/auth.js';
import { ensurePermission, ensureAdminOrMIA } from '../middlewares/ensurePermission.js';

const router = Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtenir toutes les catégories
 *     description: Retourne la liste complète des catégories de contacts disponibles
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categorie'
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticateToken, ensurePermission('categorie.read'), getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtenir une catégorie par ID
 *     description: Retourne les détails d'une catégorie spécifique
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         description: Catégorie introuvable
 *       401:
 *         description: Non authentifié
 */
router.get('/:id', authenticateToken, ensurePermission('categorie.read'), getCategorieById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Créer une nouvelle catégorie
 *     description: Crée une nouvelle catégorie de contacts
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nomCategorie
 *             properties:
 *               nomCategorie:
 *                 type: string
 *                 description: Nom de la catégorie
 *                 example: Travail
 *               description:
 *                 type: string
 *                 description: Description de la catégorie
 *                 example: Contacts professionnels et collègues
 *     responses:
 *       201:
 *         description: Catégorie créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/', authenticateToken, ensureAdminOrMIA, ensurePermission('categorie.create'), createCategorie);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Mettre à jour une catégorie
 *     description: Modifie les informations d'une catégorie existante
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie à mettre à jour
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomCategorie:
 *                 type: string
 *                 description: Nouveau nom de la catégorie
 *                 example: Travail
 *               description:
 *                 type: string
 *                 description: Nouvelle description
 *                 example: Contacts professionnels et collègues
 *     responses:
 *       200:
 *         description: Catégorie mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categorie'
 *       404:
 *         description: Catégorie introuvable
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.put('/:id', authenticateToken, ensureAdminOrMIA, ensurePermission('categorie.update'), updateCategorie);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     description: Supprime définitivement une catégorie de contacts
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la catégorie à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Catégorie supprimée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Catégorie supprimée avec succès
 *       404:
 *         description: Catégorie introuvable
 *       401:
 *         description: Non authentifié
 */
router.delete('/:id', authenticateToken, ensureAdminOrMIA, ensurePermission('categorie.delete'), deleteCategorie);

export default router;
