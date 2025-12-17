import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import contactRoutes from './contactRoutes.js';
import roleRoutes from './roleRoutes.js';
import permissionRoutes from './permissionRoutes.js';
import categorieRoutes from './categorieRoutes.js';
import messageRoutes from './messageRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import shareRoutes from './shareRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = Router();

// Routes principales
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/contacts', contactRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/categories', categorieRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);
router.use('/share', shareRoutes);
router.use('/dashboard', dashboardRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'MIA API is running' });
});

export default router;
