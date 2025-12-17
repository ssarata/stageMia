import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  searchContacts
} from '../controllers/contactController.js';
import authenticateToken from '../middlewares/auth.js';
import { validatePhone } from '../middlewares/validatePhone.js';
import { ensurePermission, ensureAdminOrMIA } from '../middlewares/ensurePermission.js';

const router = Router();

/**
 * @swagger
 * /api/contacts/search:
 *   get:
 *     summary: Rechercher des contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Terme de recherche (nom, prénom, téléphone, email, organisation)
 *         example: Koffi
 *     responses:
 *       200:
 *         description: Liste des contacts correspondants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission insuffisante
 */
router.get('/search', authenticateToken, ensurePermission('contact.read'), searchContacts);

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Obtenir tous les contacts de l'utilisateur connecté
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission insuffisante
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authenticateToken, ensurePermission('contact.read'), getAllContacts);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Obtenir un contact par ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du contact
 *         example: 1
 *     responses:
 *       200:
 *         description: Détails du contact
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact introuvable
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission insuffisante
 */
router.get('/:id', authenticateToken, ensurePermission('contact.read'), getContactById);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Créer un nouveau contact
 *     description: Crée un contact avec validation automatique du numéro de téléphone
 *     tags: [Contacts]
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
 *               - telephone
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Kouassi
 *               prenom:
 *                 type: string
 *                 example: Kofi
 *               telephone:
 *                 type: string
 *                 description: Format international (+226...)
 *                 example: "+22670123456"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: kofi.kouassi@example.com
 *               adresse:
 *                 type: string
 *                 example: 15 rue du Commerce, Ouagadougou
 *               fonction:
 *                 type: string
 *                 example: Directeur
 *               organisation:
 *                 type: string
 *                 example: Entreprise ABC
 *               notes:
 *                 type: string
 *                 example: Contact important pour le projet
 *               categorieId:
 *                 type: integer
 *                 description: ID de la catégorie (1=Travail, 2=Famille, etc.)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Contact créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Données invalides (téléphone invalide, champs manquants)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Numéro de téléphone invalide
 *                 field:
 *                   type: string
 *                   example: telephone
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission insuffisante
 *       500:
 *         description: Erreur serveur
 */
router.post('/', authenticateToken, ensurePermission('contact.create'), validatePhone({ field: 'telephone', required: true }), createContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Mettre à jour un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du contact à mettre à jour
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
 *               telephone:
 *                 type: string
 *                 description: Format international (+226...)
 *               email:
 *                 type: string
 *                 format: email
 *               adresse:
 *                 type: string
 *               fonction:
 *                 type: string
 *               organisation:
 *                 type: string
 *               notes:
 *                 type: string
 *               categorieId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Contact mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contact introuvable
 *       400:
 *         description: Téléphone invalide
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission insuffisante
 */
//router.put('/:id', authenticateToken, ensurePermission('contact.update'), validatePhone({ field: 'telephone', required: false }), updateContact);
router.put('/:id', authenticateToken, ensurePermission('contact.update'), validatePhone({ field: 'telephone', required: false }), updateContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Supprimer un contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du contact à supprimer
 *         example: 1
 *     responses:
 *       200:
 *         description: Contact supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contact supprimé avec succès
 *       404:
 *         description: Contact introuvable
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission insuffisante ou rôle non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', authenticateToken, ensureAdminOrMIA, ensurePermission('contact.delete'), deleteContact);

export default router;
