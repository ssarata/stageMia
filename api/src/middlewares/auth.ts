import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import prisma from '../utils/prismaClient.js';

// Étend l'objet Request pour inclure un utilisateur typé
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    roleId: number;
    roleName?: string;
    nom: string;
    prenom: string;
  };
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token et charge les informations complètes de l'utilisateur
 */
const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Accès non autorisé : token manquant.' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Récupérer l'utilisateur depuis la base de données pour vérifier son statut actuel
    const userFromDb = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true }
    });

    if (!userFromDb) {
      res.status(403).json({ message: 'Accès refusé : Utilisateur du token non trouvé.' });
      return;
    }

    // Attacher les informations utilisateur à la requête
    req.user = {
      id: userFromDb.id,
      email: userFromDb.email,
      roleId: userFromDb.roleId,
      roleName: userFromDb.role?.nomRole,
      nom: userFromDb.nom,
      prenom: userFromDb.prenom
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

export default authenticateToken;
