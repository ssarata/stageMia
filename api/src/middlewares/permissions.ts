import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import prisma from '../utils/prismaClient.js';

export const checkPermission = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Non authentifié' });
        return;
      }

      const role = await prisma.role.findUnique({
        where: { id: req.user.roleId },
        include: { permissions: true }
      });

      if (!role) {
        res.status(403).json({ error: 'Rôle introuvable' });
        return;
      }

      const hasPermission = role.permissions.some(
        (permission) => permission.nomPermission === requiredPermission
      );

      if (!hasPermission) {
        res.status(403).json({ error: 'Permission insuffisante' });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la vérification des permissions' });
    }
  };
};
