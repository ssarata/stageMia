import { Request, Response } from 'express';
import prisma from '../utils/prismaClient.js';

// Obtenir toutes les catégories
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await prisma.categorie.findMany({
      include: {
        _count: {
          select: { contacts: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
};

// Obtenir une catégorie par ID
export const getCategorieById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const categorie = await prisma.categorie.findUnique({
      where: { id: parseInt(id) },
      include: {
        contacts: true
      }
    });

    if (!categorie) {
      res.status(404).json({ error: 'Catégorie introuvable' });
      return;
    }

    res.json(categorie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la catégorie' });
  }
};

// Créer une catégorie
export const createCategorie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nomCategorie, description } = req.body;

    const categorie = await prisma.categorie.create({
      data: {
        nomCategorie,
        description
      }
    });

    res.status(201).json(categorie);
  } catch (error: any) {
    console.error(error);

    // Vérifier si c'est une erreur de contrainte unique
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Une catégorie avec ce nom existe déjà' });
      return;
    }

    res.status(500).json({ error: 'Erreur lors de la création de la catégorie' });
  }
};

// Mettre à jour une catégorie
export const updateCategorie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nomCategorie, description } = req.body;

    const categorie = await prisma.categorie.update({
      where: { id: parseInt(id) },
      data: {
        nomCategorie,
        description
      }
    });

    res.json(categorie);
  } catch (error: any) {
    console.error(error);

    // Vérifier si c'est une erreur de contrainte unique
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Une catégorie avec ce nom existe déjà' });
      return;
    }

    // Vérifier si l'enregistrement n'existe pas
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Catégorie introuvable' });
      return;
    }

    res.status(500).json({ error: 'Erreur lors de la mise à jour de la catégorie' });
  }
};

// Supprimer une catégorie
export const deleteCategorie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Vérifier si la catégorie existe
    const categorie = await prisma.categorie.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            contacts: true
          }
        }
      }
    });

    if (!categorie) {
      res.status(404).json({ error: 'Catégorie introuvable' });
      return;
    }

    // Vérifier s'il y a des contacts dans cette catégorie
    if (categorie._count.contacts > 0) {
      res.status(400).json({
        error: `Impossible de supprimer cette catégorie. Elle contient ${categorie._count.contacts} contact(s). Veuillez d'abord supprimer ou déplacer les contacts.`
      });
      return;
    }

    // Supprimer la catégorie si elle est vide
    await prisma.categorie.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error: any) {
    console.error(error);

    if (error.code === 'P2003') {
      res.status(400).json({ error: 'Impossible de supprimer cette catégorie car elle contient des contacts' });
      return;
    }

    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Catégorie introuvable' });
      return;
    }

    res.status(500).json({ error: 'Erreur lors de la suppression de la catégorie' });
  }
};
