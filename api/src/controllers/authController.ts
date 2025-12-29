import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prismaClient.js';
import { generateToken } from '../utils/jwt.js';
import authService from '../services/authService.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, prenom, email, adresse, telephone, motDePasse, sexe, roleId } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { telephone }
        ]
      }
    });

    if (existingUser) {
      res.status(400).json({ error: 'Email ou téléphone déjà utilisé' });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Si pas de roleId fourni, utiliser le rôle MIA par défaut
    let finalRoleId = roleId;
    if (!finalRoleId) {
      const miaRole = await prisma.role.findUnique({
        where: { nomRole: 'MIA' }
      });
      finalRoleId = miaRole?.id;
    }

    if (!finalRoleId) {
      res.status(500).json({ error: 'Aucun rôle disponible pour l\'inscription' });
      return;
    }

    // Vérifier que le rôle existe
    const roleExists = await prisma.role.findUnique({
      where: { id: finalRoleId }
    });

    if (!roleExists) {
      res.status(400).json({ error: 'Le rôle spécifié n\'existe pas' });
      return;
    }

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        adresse,
        telephone,
        motDePasse: hashedPassword,
        sexe,
        roleId: finalRoleId
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    // Générer le token
    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId
    });

    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, motDePasse } = req.body;

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    if (!user) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      return;
    }

    // Générer le token
    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId
    });

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        telephone: user.telephone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

/**
 * Controller pour la demande de réinitialisation de mot de passe
 */
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email est requis' });
      return;
    }

    const token = await authService.forgotPassword(email);

    const response: any = {
      message: 'Si cet email existe dans notre système, vous recevrez un lien de réinitialisation.'
    };

    // En mode développement, inclure le token pour faciliter les tests
    if (process.env.NODE_ENV === 'development' && token) {
      response.devToken = token;
      response.resetUrl = `http://localhost:5173/auth/resetpwd?token=${token}`;
    }

    res.status(200).json(response);
  } catch (error: any) {
    console.error("Erreur dans forgotPassword:", error);
    res.status(500).json({
      message: 'Erreur lors de l\'envoi de l\'email de réinitialisation',
      details: error.message
    });
  }
};

/**
 * Controller pour la réinitialisation du mot de passe
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ message: 'Token et nouveau mot de passe sont requis' });
      return;
    }

    await authService.resetPassword(token, newPassword);

    res.status(200).json({
      message: 'Votre mot de passe a été réinitialisé avec succès'
    });
  } catch (error: any) {
    console.error("Erreur dans resetPassword:", error);

    if (error.message === 'Token invalide ou expiré' ||
        error.message === 'Le mot de passe doit contenir au moins 6 caractères') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({
        message: 'Erreur lors de la réinitialisation du mot de passe',
        details: error.message
      });
    }
  }
};

/**
 * Controller pour vérifier la validité d'un token de réinitialisation
 */
export const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    if (!token) {
      res.status(400).json({ message: 'Token est requis' });
      return;
    }

    const isValid = await authService.verifyResetToken(token);

    res.status(200).json({ valid: isValid });
  } catch (error: any) {
    console.error("Erreur dans verifyResetToken:", error);
    res.status(500).json({
      message: 'Erreur lors de la vérification du token',
      details: error.message
    });
  }
};

/**
 * Controller pour changer le mot de passe
 */
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Non authentifié' });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Mot de passe actuel et nouveau mot de passe requis' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
      return;
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      res.status(404).json({ message: 'Utilisateur introuvable' });
      return;
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, user.motDePasse);

    if (!isPasswordValid) {
      res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      return;
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    await prisma.user.update({
      where: { id: userId },
      data: { motDePasse: hashedPassword }
    });

    res.status(200).json({
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error: any) {
    console.error("Erreur dans updatePassword:", error);
    res.status(500).json({
      message: 'Erreur lors de la modification du mot de passe',
      details: error.message
    });
  }
};

/**
 * Controller pour mettre à jour le profil utilisateur
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Non authentifié' });
      return;
    }

    const { nom, prenom, email, telephone, adresse } = req.body;

    // Vérifier si l'email ou le téléphone sont déjà utilisés par un autre utilisateur
    if (email || telephone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                email ? { email } : {},
                telephone ? { telephone } : {},
              ].filter(obj => Object.keys(obj).length > 0)
            }
          ]
        }
      });

      if (existingUser) {
        res.status(400).json({ message: 'Email ou téléphone déjà utilisé' });
        return;
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nom && { nom }),
        ...(prenom && { prenom }),
        ...(email && { email }),
        ...(telephone && { telephone }),
        ...(adresse && { adresse }),
      },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser.id,
        nom: updatedUser.nom,
        prenom: updatedUser.prenom,
        email: updatedUser.email,
        telephone: updatedUser.telephone,
        adresse: updatedUser.adresse,
        sexe: updatedUser.sexe,
        roleId: updatedUser.roleId,
        role: updatedUser.role
      }
    });
  } catch (error: any) {
    console.error("Erreur dans updateProfile:", error);
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du profil',
      details: error.message
    });
  }
};
