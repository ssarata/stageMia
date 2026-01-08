import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../utils/prismaClient.js';
import emailService from './emailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète';
if (JWT_SECRET === 'votre_clé_secrète') {
  console.warn('⚠️ Utilisez une clé JWT_SECRET sécurisée en production!');
}

// Forgot Password - Génère un token et envoie l'email
export const forgotPassword = async (email: string): Promise<string | void> => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    // Pour des raisons de sécurité, ne pas révéler si l'email existe ou non
    return;
  }

  // Générer un token unique
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash le token avant de le stocker en base de données
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token valide pendant 1 heure
  const resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

  // Sauvegarder le token hashé et la date d'expiration
  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires,
    },
  });

  // Envoyer l'email de manière asynchrone pour ne pas bloquer la réponse
  // En cas d'échec, le token reste valide et l'utilisateur peut réessayer
  setImmediate(async () => {
    try {
      await emailService.sendPasswordResetEmail(
        user.email,
        resetToken,
        `${user.prenom} ${user.nom}`
      );
      console.log(`✅ Email de réinitialisation envoyé à ${user.email}`);
    } catch (error: any) {
      console.error(`❌ Erreur lors de l'envoi de l'email de réinitialisation à ${user.email}:`, error);
      // Ne pas supprimer le token si l'email échoue - l'utilisateur peut réessayer
      // ou utiliser le token si fourni en mode dev
    }
  });

  // En mode développement, retourner le token pour faciliter les tests
  if (process.env.NODE_ENV === 'development') {
    return resetToken;
  }
};

// Reset Password - Vérifie le token et réinitialise le mot de passe
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  // Hash le token reçu pour le comparer avec celui en base de données
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Trouver l'utilisateur avec ce token et vérifier qu'il n'est pas expiré
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        gt: new Date(), // Token non expiré
      },
    },
  });

  if (!user) {
    throw new Error('Token invalide ou expiré');
  }

  // Valider le nouveau mot de passe
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Le mot de passe doit contenir au moins 6 caractères');
  }

  // Hash le nouveau mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Mettre à jour le mot de passe et supprimer le token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      motDePasse: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    },
  });

  // Envoyer un email de confirmation de manière asynchrone
  setImmediate(async () => {
    try {
      await emailService.sendPasswordResetConfirmationEmail(
        user.email,
        `${user.prenom} ${user.nom}`
      );
      console.log(`✅ Email de confirmation de réinitialisation envoyé à ${user.email}`);
    } catch (error) {
      console.error(`❌ Erreur lors de l'envoi de l'email de confirmation à ${user.email}:`, error);
    }
  });
};

// Vérifier la validité d'un token de réinitialisation
export const verifyResetToken = async (token: string): Promise<boolean> => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        gt: new Date(),
      },
    },
  });

  return !!user;
};

export default {
  forgotPassword,
  resetPassword,
  verifyResetToken,
};
