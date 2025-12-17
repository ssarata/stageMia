import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/

async function main() {
  console.log('🌱 Démarrage du seed...');

  // ============================================
  // 1. CRÉATION DES RÔLES
  // ============================================

  console.log('📝 Création des rôles...');

  const roles = [
    { name: 'ADMIN', description: 'Administrateur système avec tous les droits' },
    { name: 'LECTEUR', description: 'le lecteur' },
    { name: 'MIA', description: 'Le personnel de la MIA' }
  ];

  const createdRoles = [];
  for (const roleData of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {},
      create: roleData
    });
    createdRoles.push(role);
    console.log(`✅ Rôle créé: ${role.name}`);
  }

  // ============================================
  // 2. CRÉATION DES PERMISSIONS
  // ============================================

  console.log('🔐 Création des permissions...');

  const permissions = [
    // Permissions Utilisateurs
    { key: 'user.read', description: 'Consulter les utilisateurs' },
    { key: 'user.create', description: 'Créer des utilisateurs' },
    { key: 'user.update', description: 'Modifier les utilisateurs' },
    { key: 'user.delete', description: 'Supprimer les utilisateurs' },
    { key: 'user.archive', description: 'Archiver les utilisateurs' },

    // Permissions Rôles
    { key: 'role.read', description: 'Consulter les rôles' },
    { key: 'role.create', description: 'Créer des rôles' },
    { key: 'role.update', description: 'Modifier les rôles' },
    { key: 'role.delete', description: 'Supprimer les rôles' },
    { key: 'role.assign_permissions', description: 'Assigner des permissions aux rôles' },

    // Permissions de base
    { key: 'permission.read', description: 'Consulter les permissions' },
    { key: 'permission.create', description: 'Créer des permissions' },
    { key: 'permission.update', description: 'Modifier les permissions' },
    { key: 'permission.delete', description: 'Supprimer les permissions' },

    // Permissions Élèves
    { key: 'categorie.read', description: 'Consulter les categories' },
    { key: 'categorie.create', description: 'Inscrire des categories' },
    { key: 'categorie.update', description: 'Modifier les informations des categories' },
    { key: 'categorie.delete', description: 'Supprimer des categories' },
  
    // Permissions Notes
    { key: 'contact.read', description: 'Consulter les contacts' },
    { key: 'contact.create', description: 'Saisir des contacts' },
    { key: 'contact.update', description: 'Modifier des contacts' },
    { key: 'contact.delete', description: 'Supprimer des contacts' },
    { key: 'contact.export', description: 'Exporter les relevés de contacts' },

    // Permissions Classes
    { key: 'notification.read', description: 'Consulter les notifications' },
    { key: 'notification.create', description: 'Créer des notifications' },
    { key: 'notification.update', description: 'Modifier les notifications' },
    { key: 'notification.delete', description: 'Supprimer des notifications' },
    { key: 'notification.manage_eleves', description: 'Gérer les élèves dans les notifications' },

    // Permissions Accueil
    { key: 'HistoriqueMessage.read', description: 'Consulter les pages HistoriqueMessage' },
    { key: 'HistoriqueMessage.create', description: 'Créer des pages HistoriqueMessage' },
    { key: 'HistoriqueMessage.update', description: 'Modifier les pages HistoriqueMessage' },
    { key: 'HistoriqueMessage.delete', description: 'Supprimer des pages HistoriqueMessage' },

    { key: 'SharedContact.read', description: 'Consulter les pages SharedContact' },
    { key: 'SharedContact.create', description: 'Créer des pages SharedContact' },
    { key: 'SharedContact.update', description: 'Modifier les pages SharedContact' },
    { key: 'SharedContact.delete', description: 'Supprimer des pages SharedContact' },

   

    // Ajouter d'autres permissions selon les besoins
  
  ];

  const createdPermissions: any[] = [];
  for (const permissionData of permissions) {
    const permission = await prisma.permission.upsert({
      where: { key: permissionData.key },
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
  const adminRole = createdRoles.find(r => r.name === 'ADMIN')!;
  await prisma.role.update({
    where: { id: adminRole.id },
    data: {
      permissions: {
        connect: createdPermissions.map(p => ({ id: p.id }))
      }
    }
  });
  console.log(`✅ ADMIN: ${createdPermissions.length} permissions assignées`);

  // PROVISEUR : Gestion complète de l'établissement
  const lecteurRole = createdRoles.find(r => r.name === 'LECTEUR')!;
  const lecteurPermissions = [
    // Gestion des utilisateurs et rôles
    'contact.read','categorie.read', 
  ];

  const lecteurPermissionsObjects = lecteurPermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

  await prisma.role.update({
    where: { id: lecteurRole.id },
    data: {
      permissions: {
        connect: lecteurPermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ lecteur: ${lecteurPermissionsObjects.length} permissions assignées`);

  // PROFESSEUR : Gestion pédagogique
  const miaRole = createdRoles.find(r => r.name === 'MIA')!;
  const miaPermissions = [
  'contact.read', 'contact.create', 'contact.update',
  'categorie.read', 'categorie.create', 'categorie.update',
  'user.read', 'user.create', 'user.update',
  'HistoriqueMessage.read', 'HistoriqueMessage.create', 'HistoriqueMessage.update','HistoriqueMessage.delete',
  'notification.read', 'notification.create', 'notification.update',
  'sharedContacts.read', 'sharedContacts.create', 'sharedContacts.update',

  
  ];

  const miaPermissionsObjects = miaPermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

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
        role: {
          connect: { id: adminRole.id }
        }
      }
    });

    console.log(`✅ Utilisateur admin créé: ${adminUser.email}`);
  }

  const usersData = [
    { nom: 'Diallo', prenom: 'Marie', email: 'marie.diallo@ecole.com', password: 'prof123', roleId: professorRole.id },
    { nom: 'Keita', prenom: 'Amadou', email: 'amadou.keita@ecole.com', password: 'prof123', roleId: professorRole.id },
    { nom: 'Ba', prenom: 'Fatoumata', email: 'fatoumata.ba@ecole.com', password: 'prof123', roleId: professorRole.id },
    { nom: 'Sow', prenom: 'Moussa', email: 'moussa.sow@parent.com', password: 'parent123', roleId: parentRole2.id },
    { nom: 'Camara', prenom: 'Aïssatou', email: 'aissatou.camara@parent.com', password: 'parent123', roleId: parentRole2.id },
    { nom: 'Toure', prenom: 'Khalipha', email: 'khalipha.toure@eleve.com', password: 'eleve123', roleId: eleveRole2.id },
    { nom: 'Diop', prenom: 'Aminata', email: 'aminata.diop@eleve.com', password: 'eleve123', roleId: eleveRole2.id },
    { nom: 'Fall', prenom: 'Ousmane', email: 'ousmane.fall@eleve.com', password: 'eleve123', roleId: eleveRole2.id },
    { nom: 'Ndiaye', prenom: 'Adama', email: 'adama.ndiaye@staff.com', password: 'staff123', roleId: staffRole.id }
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = await prisma.user.create({
        data: {
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          motDePasse: hashedPassword,
          adresse: `${userData.prenom} street, Dakar`,
          telephone: '221' + Math.floor(Math.random() * 900000000 + 100000000).toString(),
          roleId: userData.roleId
        }
      });
      createdUsers.push(user);
      console.log(`✅ Utilisateur créé: ${user.email}`);
    } else {
      createdUsers.push(existing);
    }
  }

  // ============================================
  // 6. CRÉATION DES ANNÉES ACADÉMIQUES
  // ============================================

  console.log('\n📅 Création des années académiques...');

  const currentYear = new Date().getFullYear();
  const createdAnnees = [];

  for (let i = -1; i <= 1; i++) {
    const year = currentYear + i;
    const annee = await prisma.annee.create({
      data: {
        dateDebut: new Date(`${year}-09-01`),
        dateFin: new Date(`${year + 1}-06-30`)
      }
    });
    createdAnnees.push(annee);
    console.log(`✅ Année académique créée: ${year}-${year + 1}`);
  }

 
}main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });