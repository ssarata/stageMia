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
        roleId: roleId || 2 // Par défaut, rôle utilisateur
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
      response.resetUrl = `http://localhost:3000/reset-password?token=${token}`;
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
