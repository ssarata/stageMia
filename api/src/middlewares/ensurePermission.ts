import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import prisma from '../utils/prismaClient.js';

/**
 * Middleware pour vérifier que l'utilisateur est un administrateur
 */
export const ensureAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.roleName === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé. Seul un administrateur peut effectuer cette action.' });
  }
};

/**
 * Middleware pour vérifier un rôle spécifique
 * @param requiredRole - Le nom du rôle requis
 */
export const ensureRole = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.roleName === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: `Accès refusé. Rôle ${requiredRole} requis.` });
    }
  };
};

/**
 * Middleware pour vérifier que l'utilisateur a le rôle ADMIN ou MIA
 */
export const ensureAdminOrMIA = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && (req.user.roleName === 'ADMIN' || req.user.roleName === 'MIA')) {
    next();
  } else {
    res.status(403).json({
      message: 'Accès refusé. Seul un administrateur ou personnel MIA peut effectuer cette action.'
    });
  }
};

/**
 * Middleware pour vérifier plusieurs rôles autorisés
 * @param allowedRoles - Liste des noms de rôles autorisés
 */
export const ensureMultipleRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && req.user.roleName && allowedRoles.includes(req.user.roleName)) {
      next();
    } else {
      res.status(403).json({
        message: `Accès refusé. Rôles autorisés: ${allowedRoles.join(', ')}`
      });
    }
  };
};

/**
 * Middleware pour vérifier qu'un utilisateur possède une permission spécifique
 * @param requiredPermission - La clé de la permission requise (ex: 'contact.create')
 */
export const ensurePermission = (requiredPermission: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !req.user.roleId) {
      res.status(401).json({ message: 'Authentification requise.' });
      return;
    }

    try {
      const userRole = await prisma.role.findUnique({
        where: { id: req.user.roleId },
        include: { permissions: true }
      });

      if (!userRole) {
        res.status(403).json({ message: 'Rôle utilisateur non trouvé.' });
        return;
      }

      const hasPermission = userRole.permissions.some((permission) =>
        permission.nomPermission === requiredPermission
      );

      if (hasPermission) {
        next();
      } else {
        res.status(403).json({ message: `Permission ${requiredPermission} requise.` });
      }
    } catch (error) {
      console.error('❌ Erreur permissions:', error);
      res.status(500).json({ message: 'Erreur lors de la vérification des permissions.' });
    }
  };
};

/**
 * Middleware pour vérifier qu'un utilisateur possède au moins une des permissions listées
 * @param requiredPermissions - Liste des permissions (au moins une doit être possédée)
 */
export const ensureAnyPermission = (requiredPermissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !req.user.roleId) {
      res.status(401).json({ message: 'Authentification requise.' });
      return;
    }

    try {
      const userRole = await prisma.role.findUnique({
        where: { id: req.user.roleId },
        include: { permissions: true }
      });

      if (!userRole) {
        res.status(403).json({ message: 'Rôle utilisateur non trouvé.' });
        return;
      }

      const hasAnyPermission = requiredPermissions.some((requiredPerm) =>
        userRole.permissions.some((permission) => permission.nomPermission === requiredPerm)
      );

      if (hasAnyPermission) {
        next();
      } else {
        res.status(403).json({
          message: `Au moins une de ces permissions est requise: ${requiredPermissions.join(', ')}`
        });
      }
    } catch (error) {
      console.error('❌ Erreur permissions:', error);
      res.status(500).json({ message: 'Erreur lors de la vérification des permissions.' });
    }
  };
};

/**
 * Middleware pour vérifier qu'un utilisateur possède TOUTES les permissions listées
 * @param requiredPermissions - Liste des permissions (toutes doivent être possédées)
 */
export const ensureAllPermissions = (requiredPermissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user || !req.user.roleId) {
      res.status(401).json({ message: 'Authentification requise.' });
      return;
    }

    try {
      const userRole = await prisma.role.findUnique({
        where: { id: req.user.roleId },
        include: { permissions: true }
      });

      if (!userRole) {
        res.status(403).json({ message: 'Rôle utilisateur non trouvé.' });
        return;
      }

      const hasAllPermissions = requiredPermissions.every((requiredPerm) =>
        userRole.permissions.some((permission) => permission.nomPermission === requiredPerm)
      );

      if (hasAllPermissions) {
        next();
      } else {
        res.status(403).json({
          message: `Toutes ces permissions sont requises: ${requiredPermissions.join(', ')}`
        });
      }
    } catch (error) {
      console.error('❌ Erreur permissions:', error);
      res.status(500).json({ message: 'Erreur lors de la vérification des permissions.' });
    }
  };
};
