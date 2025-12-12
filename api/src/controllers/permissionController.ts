import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';

// Obtenir toutes les permissions
export const getAllPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const permissions = await prisma.permission.findMany({
      include: {
        _count: {
          select: { roles: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des permissions' });
  }
};

// Obtenir une permission par ID
export const getPermissionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const permission = await prisma.permission.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: true
      }
    });

    if (!permission) {
      res.status(404).json({ error: 'Permission introuvable' });
      return;
    }

    res.json(permission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la permission' });
  }
};

// Créer une permission
export const createPermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomPermission, description } = req.body;

    const permission = await prisma.permission.create({
      data: {
        nomPermission,
        description
      }
    });

    res.status(201).json(permission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la permission' });
  }
};

// Mettre à jour une permission
export const updatePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nomPermission, description } = req.body;

    const permission = await prisma.permission.update({
      where: { id: parseInt(id) },
      data: {
        nomPermission,
        description
      }
    });

    res.json(permission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la permission' });
  }
};

// Supprimer une permission
export const deletePermission = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.permission.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Permission supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la permission' });
  }
};
