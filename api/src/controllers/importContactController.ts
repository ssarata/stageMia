import { Response } from 'express';
import * as XLSX from 'xlsx';
import prisma from '../utils/prismaClient.js';
import { AuthRequest } from '../middlewares/auth.js';
import { notifyAdmins } from '../utils/notifyAdmins.js';
import { sendNotificationEmail } from '../services/nodemailerService.js';

interface ContactRow {
  nom: string;
  prenom?: string;
  telephone: string;
  email?: string;
  adresse?: string;
  fonction?: string;
  organisation?: string;
  notes?: string;
  categorie: string;
}

// Import de contacts via fichier Excel
export const importContacts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Non authentifié' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: 'Aucun fichier fourni' });
      return;
    }

    // Lire le fichier Excel
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir en JSON
    const data: ContactRow[] = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      res.status(400).json({ error: 'Le fichier est vide ou invalide' });
      return;
    }

    // Vérifier les colonnes du fichier
    const validColumns = ['nom', 'prenom', 'telephone', 'email', 'adresse', 'fonction', 'organisation', 'notes', 'categorie'];
    const fileColumns = data.length > 0 ? Object.keys(data[0]) : [];
    const unknownColumns = fileColumns.filter(col => !validColumns.includes(col));
    const warnings: string[] = [];

    if (unknownColumns.length > 0) {
      warnings.push(`Colonnes non reconnues et ignorées: ${unknownColumns.join(', ')}`);
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Traiter chaque ligne de manière synchrone
    for (let index = 0; index < data.length; index++) {
      const row = data[index];
      try {
        // Validation des champs obligatoires
        if (!row.nom || !row.telephone || !row.categorie) {
          errors.push(`Ligne ${index + 2}: Nom, téléphone et catégorie sont requis`);
          errorCount++;
          continue;
        }

        // Trouver la catégorie
        let categorie = await prisma.categorie.findFirst({
          where: { nomCategorie: row.categorie }
        });

        // Si la catégorie n'existe pas, la créer
        if (!categorie) {
          categorie = await prisma.categorie.create({
            data: { nomCategorie: row.categorie }
          });
        }

        // Créer le contact
        await prisma.contact.create({
          data: {
            nom: row.nom,
            prenom: row.prenom || undefined,
            telephone: row.telephone,
            email: row.email || undefined,
            adresse: row.adresse || undefined,
            fonction: row.fonction || undefined,
            organisation: row.organisation || undefined,
            notes: row.notes || undefined,
            categorieId: categorie.id,
            userId: req.user!.id
          }
        });

        successCount++;
      } catch (error: any) {
        console.error(`Erreur ligne ${index + 2}:`, error);
        errors.push(`Ligne ${index + 2}: ${error.message}`);
        errorCount++;
      }
    }

    // Envoyer un email à l'utilisateur qui a importé
    const userMessage = successCount > 0
      ? `Vous avez importé ${successCount} contact(s) avec succès${errorCount > 0 ? `. ${errorCount} erreur(s) ont été rencontrées.` : '.'}`
      : `L'importation a échoué avec ${errorCount} erreur(s).`;

    try {
      await sendNotificationEmail(
        req.user.email,
        `${req.user.nom} ${req.user.prenom}`,
        userMessage,
        successCount > 0 ? 'success' : 'error'
      );
    } catch (error) {
      console.error(`Erreur lors de l'envoi d'email à ${req.user.email}:`, error);
    }

    // Notifier les administrateurs après l'import
    const notificationMessage = `${req.user.nom} ${req.user.prenom} (${req.user.email}) a importé ${successCount} contact(s) via fichier Excel (${errorCount} erreur(s))`;

    await notifyAdmins(notificationMessage, successCount > 0 ? 'success' : 'warning');

    // Envoyer des emails aux administrateurs
    const adminRole = await prisma.role.findFirst({
      where: { nomRole: 'ADMIN' }
    });

    if (adminRole) {
      const admins = await prisma.user.findMany({
        where: { roleId: adminRole.id }
      });

      for (const admin of admins) {
        try {
          await sendNotificationEmail(
            admin.email,
            `${admin.nom} ${admin.prenom}`,
            notificationMessage,
            successCount > 0 ? 'success' : 'warning'
          );
        } catch (error) {
          console.error(`Erreur lors de l'envoi d'email à ${admin.email}:`, error);
        }
      }
    }

    console.log(`✅ Import terminé: ${successCount} succès, ${errorCount} erreurs`);

    // Réponse à l'utilisateur AVANT d'envoyer les emails
    res.status(200).json({
      message: successCount > 0
        ? `Import réussi: ${successCount} contact(s) importé(s)${errorCount > 0 ? `, ${errorCount} erreur(s)` : ''}`
        : 'Import échoué',
      totalRows: data.length,
      successCount,
      errorCount,
      errors: errorCount > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
      status: successCount > 0 ? 'success' : 'error'
    });

    // Envoyer les emails de manière asynchrone APRÈS avoir répondu au client
    // Cela évite que les timeouts SMTP bloquent la réponse HTTP
    setImmediate(async () => {
      try {
        console.log('📧 Envoi des emails de notification...');

        // Envoyer un email à l'utilisateur qui a importé
        const userMessage = successCount > 0
          ? `Vous avez importé ${successCount} contact(s) avec succès${errorCount > 0 ? `. ${errorCount} erreur(s) ont été rencontrées.` : '.'}`
          : `L'importation a échoué avec ${errorCount} erreur(s).`;

        try {
          await sendNotificationEmail(
            req.user!.email,
            `${req.user!.nom} ${req.user!.prenom}`,
            userMessage,
            successCount > 0 ? 'success' : 'error'
          );
        } catch (error) {
          console.error(`Erreur lors de l'envoi d'email à ${req.user!.email}:`, error);
        }

        // Notifier les administrateurs
        const notificationMessage = `${req.user!.nom} ${req.user!.prenom} (${req.user!.email}) a importé ${successCount} contact(s) via fichier Excel (${errorCount} erreur(s))`;

        await notifyAdmins(notificationMessage, successCount > 0 ? 'success' : 'warning');

        // Envoyer des emails aux administrateurs
        const adminRole = await prisma.role.findFirst({
          where: { nomRole: 'ADMIN' }
        });

        if (adminRole) {
          const admins = await prisma.user.findMany({
            where: { roleId: adminRole.id }
          });

          for (const admin of admins) {
            try {
              await sendNotificationEmail(
                admin.email,
                `${admin.nom} ${admin.prenom}`,
                notificationMessage,
                successCount > 0 ? 'success' : 'warning'
              );
            } catch (error) {
              console.error(`Erreur lors de l'envoi d'email à ${admin.email}:`, error);
            }
          }
        }

        console.log('✅ Notifications email envoyées');
      } catch (error) {
        console.error('❌ Erreur lors de l\'envoi des notifications:', error);
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    res.status(500).json({ error: 'Erreur lors de l\'import des contacts' });
  }
};

// Obtenir un template Excel pour l'import
export const getImportTemplate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Créer un fichier Excel template
    const templateData = [
      {
        nom: 'Dupont',
        prenom: 'Jean',
        telephone: '+226 70 00 00 00',
        email: 'jean.dupont@email.com',
        adresse: 'Ouagadougou',
        fonction: 'Développeur',
        organisation: 'Tech Corp',
        notes: 'Contact important',
        categorie: 'Professionnel'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    // Générer le buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=template_contacts.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);

  } catch (error) {
    console.error('Erreur lors de la génération du template:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du template' });
  }
};
