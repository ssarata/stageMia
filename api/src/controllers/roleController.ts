import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';

// Obtenir tous les rôles
export const getAllRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
        _count: {
          select: { users: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des rôles' });
  }
};

// Obtenir un rôle par ID
export const getRoleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const role = await prisma.role.findUnique({
      where: { id: parseInt(id) },
      include: {
        permissions: true,
        users: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true
          }
        }
      }
    });

    if (!role) {
      res.status(404).json({ error: 'Rôle introuvable' });
      return;
    }

    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération du rôle' });
  }
};

// Créer un rôle
export const createRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomRole, description, permissionIds } = req.body;

    const role = await prisma.role.create({
      data: {
        nomRole,
        description,
        permissions: permissionIds ? {
          connect: permissionIds.map((id: number) => ({ id }))
        } : undefined
      },
      include: {
        permissions: true
      }
    });

    res.status(201).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du rôle' });
  }
};

// Mettre à jour un rôle
export const updateRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nomRole, description, permissionIds } = req.body;

    // Déconnecter toutes les permissions actuelles
    await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        permissions: {
          set: []
        }
      }
    });

    // Mettre à jour le rôle avec les nouvelles permissions
    const role = await prisma.role.update({
      where: { id: parseInt(id) },
      data: {
        nomRole,
        description,
        permissions: permissionIds ? {
          connect: permissionIds.map((id: number) => ({ id }))
        } : undefined
      },
      include: {
        permissions: true
      }
    });

    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du rôle' });
  }
};

// Supprimer un rôle
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.role.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Rôle supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression du rôle' });
  }
};
