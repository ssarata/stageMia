import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obtenir les statistiques du dashboard
 *     description: Retourne les statistiques globales pour le dashboard utilisateur
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques du dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     newThisMonth:
 *                       type: number
 *                 contacts:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     newThisMonth:
 *                       type: number
 *                     byCategory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                           count:
 *                             type: number
 *                 messages:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     unread:
 *                       type: number
 *                 notifications:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     unread:
 *                       type: number
 *                 shares:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     thisMonth:
 *                       type: number
 *       401:
 *         description: Non authentifié
 */
router.get('/stats', authenticateToken, getDashboardStats);

export default router;
