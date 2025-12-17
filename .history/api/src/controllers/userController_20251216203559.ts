import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';

// Obtenir tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Retirer les mots de passe
    const sanitizedUsers = users.map(user => {
      const { motDePasse, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json(sanitizedUsers);
  } catch (error) {
    console.lo(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
};

// Obtenir un utilisateur par ID
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        role: {
          include: {
            permissions: true
          }
        },
        contacts: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur introuvable' });
      return;
    }

    const { motDePasse, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
  }
};

// Créer un utilisateur
export const createUser = async (req: Request, res: Response): Promise<void> => {
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

    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const user = await prisma.user.create({
      data: {
        nom,
        prenom,
        email,
        adresse,
        telephone,
        motDePasse: hashedPassword,
        sexe,
        roleId: roleId || 2
      },
      include: {
        role: true
      }
    });

    const { motDePasse: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, adresse, telephone, motDePasse, sexe, roleId } = req.body;

    const updateData: any = {
      nom,
      prenom,
      email,
      adresse,
      telephone,
      sexe,
      roleId
    };

    if (motDePasse) {
      updateData.motDePasse = await bcrypt.hash(motDePasse, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        role: true
      }
    });

    const { motDePasse: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
};

// Attribuer un rôle à un utilisateur
export const assignRoleToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, roleId } = req.body;

    // Validation des données
    if (!userId || !roleId) {
      res.status(400).json({ error: 'userId et roleId sont requis' });
      return;
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur introuvable' });
      return;
    }

    // Vérifier que le rôle existe
    const role = await prisma.role.findUnique({
      where: { id: parseInt(roleId) },
      include: { permissions: true }
    });

    if (!role) {
      res.status(404).json({ error: 'Rôle introuvable' });
      return;
    }

    // Attribuer le rôle
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { roleId: parseInt(roleId) },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });

    const { motDePasse, ...userWithoutPassword } = updatedUser;

    res.json({
      message: `Rôle "${role.nomRole}" attribué avec succès à ${user.nom} ${user.prenom}`,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'attribution du rôle' });
  }
};

// Obtenir le profil de l'utilisateur connecté
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        role: {
          include: {
            permissions: true
          }
        },
        contacts: {
          include: {
            categorie: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({ error: 'Utilisateur introuvable' });
      return;
    }

    const { motDePasse, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
};
