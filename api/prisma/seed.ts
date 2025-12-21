import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seed...');

  // ============================================
  // 1. CRÉATION DES RÔLES
  // ============================================

  console.log('📝 Création des rôles...');

  const roles = [
    { nomRole: 'ADMIN', description: 'Administrateur système avec tous les droits' },
    { nomRole: 'LECTEUR', description: 'le lecteur' },
    { nomRole: 'MIA', description: 'Le personnel de la MIA' }
  ];

  const createdRoles = [];
  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { nomRole: roleData.nomRole },
      update: {},
      create: roleData
    });
    createdRoles.push(role);
    console.log(`✅ Rôle créé: ${role.nomRole}`);
  }

  // ============================================
  // 2. CRÉATION DES PERMISSIONS
  // ============================================

  console.log('🔐 Création des permissions...');

  const permissions = [
    // Permissions Utilisateurs
    { nomPermission: 'user.read', description: 'Consulter les utilisateurs' },
    { nomPermission: 'user.create', description: 'Créer des utilisateurs' },
    { nomPermission: 'user.update', description: 'Modifier les utilisateurs' },
    { nomPermission: 'user.delete', description: 'Supprimer les utilisateurs' },
    { nomPermission: 'user.archive', description: 'Archiver les utilisateurs' },

    // Permissions Rôles
    { nomPermission: 'role.read', description: 'Consulter les rôles' },
    { nomPermission: 'role.create', description: 'Créer des rôles' },
    { nomPermission: 'role.update', description: 'Modifier les rôles' },
    { nomPermission: 'role.delete', description: 'Supprimer les rôles' },
    { nomPermission: 'role.assign_permissions', description: 'Assigner des permissions aux rôles' },

    // Permissions de base
    { nomPermission: 'permission.read', description: 'Consulter les permissions' },
    { nomPermission: 'permission.create', description: 'Créer des permissions' },
    { nomPermission: 'permission.update', description: 'Modifier les permissions' },
    { nomPermission: 'permission.delete', description: 'Supprimer les permissions' },

    // Permissions Élèves
    { nomPermission: 'categorie.read', description: 'Consulter les categories' },
    { nomPermission: 'categorie.create', description: 'Inscrire des categories' },
    { nomPermission: 'categorie.update', description: 'Modifier les informations des categories' },
    { nomPermission: 'categorie.delete', description: 'Supprimer des categories' },

    // Permissions Notes
    { nomPermission: 'contact.read', description: 'Consulter les contacts' },
    { nomPermission: 'contact.create', description: 'Saisir des contacts' },
    { nomPermission: 'contact.update', description: 'Modifier des contacts' },
    { nomPermission: 'contact.delete', description: 'Supprimer des contacts' },
    { nomPermission: 'contact.export', description: 'Exporter les relevés de contacts' },

    // Permissions Classes
    { nomPermission: 'notification.read', description: 'Consulter les notifications' },
    { nomPermission: 'notification.create', description: 'Créer des notifications' },
    { nomPermission: 'notification.update', description: 'Modifier les notifications' },
    { nomPermission: 'notification.delete', description: 'Supprimer des notifications' },
    { nomPermission: 'notification.manage_eleves', description: 'Gérer les élèves dans les notifications' },

    // Permissions Accueil
    { nomPermission: 'HistoriqueMessage.read', description: 'Consulter les pages HistoriqueMessage' },
    { nomPermission: 'HistoriqueMessage.create', description: 'Créer des pages HistoriqueMessage' },
    { nomPermission: 'HistoriqueMessage.update', description: 'Modifier les pages HistoriqueMessage' },
    { nomPermission: 'HistoriqueMessage.delete', description: 'Supprimer des pages HistoriqueMessage' },

    { nomPermission: 'SharedContact.read', description: 'Consulter les pages SharedContact' },
    { nomPermission: 'SharedContact.create', description: 'Créer des pages SharedContact' },
    { nomPermission: 'SharedContact.update', description: 'Modifier les pages SharedContact' },
    { nomPermission: 'SharedContact.delete', description: 'Supprimer des pages SharedContact' },



    // Ajouter d'autres permissions selon les besoins

  ];

  const createdPermissions: any[] = [];
  for (const permissionData of permissions) {
    const permission = await prisma.permission.upsert({
      where: { nomPermission: permissionData.nomPermission },
      update: {},
      create: permissionData
    });
    createdPermissions.push(permission);
  }
  console.log(`✅ ${createdPermissions.length} permissions créées`);

  // ============================================
  // 3. ATTRIBUTION DES PERMISSIONS AUX RÔLES
  // ============================================

  console.log('🔗 Attribution des permissions aux rôles...');

  // ADMIN : Toutes les permissions
  const adminRole = createdRoles.find(r => r.nomRole === 'ADMIN')!;
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: createdPermissions.map(p => ({ id: p.id }))
      }
    }
  });
  console.log(`✅ ADMIN: ${createdPermissions.length} permissions assignées`);

  // LECTEUR : Lecture seule des contacts et catégories
  const lecteurRole = createdRoles.find(r => r.nomRole === 'LECTEUR')!;
  const lecteurPermissions = [
    // Lecture des contacts et catégories
    'contact.read',
    'categorie.read',
    'notification.read',
    'HistoriqueMessage.read',
  ];

  const lecteurPermissionsObjects = lecteurPermissions
    .map(nomPermission => createdPermissions.find(p => p.nomPermission === nomPermission))
    .filter(p => p !== undefined);

  // Déconnecter toutes les permissions existantes puis reconnecter les nouvelles
  await prisma.role.update({
    where: { id: lecteurRole.id },
    data: {
      permissions: {
        set: [], // Vider d'abord
      }
    }
  });

  await prisma.role.update({
    where: { id: lecteurRole.id },
    data: {
      permissions: {
        connect: lecteurPermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ lecteur: ${lecteurPermissionsObjects.length} permissions assignées`);

  // MIA : Personnel MIA avec gestion des contacts et messages
  const miaRole = createdRoles.find(r => r.nomRole === 'MIA')!;
  const miaPermissions = [
  'contact.read', 'contact.create', 'contact.update',
  'categorie.read', 'categorie.create', 'categorie.update',
  'user.read',
  'HistoriqueMessage.read', 'HistoriqueMessage.create', 'HistoriqueMessage.update', 'HistoriqueMessage.delete',
  'SharedContact.read', 'SharedContact.create', 'SharedContact.update',
  ];

  const miaPermissionsObjects = miaPermissions
    .map(nomPermission => createdPermissions.find(p => p.nomPermission === nomPermission))
    .filter(p => p !== undefined);

  // Déconnecter toutes les permissions existantes puis reconnecter les nouvelles
  await prisma.role.update({
    where: { id: miaRole.id },
    data: {
      permissions: {
        set: [], // Vider d'abord
      }
    }
  });

  await prisma.role.update({
    where: { id: miaRole.id },
    data: {
      permissions: {
        connect: miaPermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ mia: ${miaPermissionsObjects.length} permissions assignées`);

  console.log('👤 Création de l\'utilisateur admin par défaut...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@mia.com' }
  });

  if (existingAdmin) {
    console.log('✅ Utilisateur admin existe déjà:', existingAdmin.email);
  } else {
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@mia.com',
        motDePasse: hashedPassword,
        nom: 'Admin',
        prenom: 'System',
        telephone: '+226 00 00 00 00',
        adresse: 'Ouagadougou, Burkina Faso',
        role: {
          connect: { id: adminRole.id }
        }
      }
    });

    console.log(`✅ Utilisateur admin créé: ${adminUser.email}`);
  }

  console.log('✅ Seed terminé avec succès!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });