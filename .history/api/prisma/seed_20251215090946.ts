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
    { name: 'LECTEUR', description: '' },
    { name: 'MIA', description: 'Professeur - gestion pédagogique et notes' },
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
    { key: 'eleve.read', description: 'Consulter les élèves' },
    { key: 'eleve.create', description: 'Inscrire des élèves' },
    { key: 'eleve.update', description: 'Modifier les informations des élèves' },
    { key: 'eleve.delete', description: 'Supprimer des élèves' },
    { key: 'eleve.export', description: 'Exporter la liste des élèves' },
    { key: 'eleve.statistics', description: 'Voir les statistiques des élèves' },

    // Permissions Notes
    { key: 'note.read', description: 'Consulter les notes' },
    { key: 'note.create', description: 'Saisir des notes' },
    { key: 'note.update', description: 'Modifier des notes' },
    { key: 'note.delete', description: 'Supprimer des notes' },
    { key: 'note.export', description: 'Exporter les relevés de notes' },

    // Permissions Classes
    { key: 'classe.read', description: 'Consulter les classes' },
    { key: 'classe.create', description: 'Créer des classes' },
    { key: 'classe.update', description: 'Modifier les classes' },
    { key: 'classe.delete', description: 'Supprimer des classes' },
    { key: 'classe.manage_eleves', description: 'Gérer les élèves dans les classes' },

    // Permissions Accueil
    { key: 'accueil.read', description: 'Consulter les pages d\'accueil' },
    { key: 'accueil.create', description: 'Créer des pages d\'accueil' },
    { key: 'accueil.update', description: 'Modifier les pages d\'accueil' },
    { key: 'accueil.delete', description: 'Supprimer des pages d\'accueil' },

    { key: 'presentation.read', description: 'Consulter les pages d\'presentation' },
    { key: 'presentation.create', description: 'Créer des pages d\'presentation' },
    { key: 'presentation.update', description: 'Modifier les pages d\'presentation' },
    { key: 'presentation.delete', description: 'Supprimer des pages d\'presentation' },

    { key: 'evaluation.read', description: 'Consulter les pages d\'evaluation' },
    { key: 'evaluation.create', description: 'Créer des pages d\'evaluation' },
    { key: 'evaluation.update', description: 'Modifier les pages d\'evaluation' },
    { key: 'evaluation.delete', description: 'Supprimer des pages d\'evaluation' },

    { key: 'inscription.read', description: 'Consulter les pages d\'inscription' },
    { key: 'inscription.create', description: 'Créer des pages d\'inscription' },
    { key: 'inscription.update', description: 'Modifier les pages d\'inscription' },
    { key: 'inscription.delete', description: 'Supprimer des pages d\'inscription' },

    { key: 'parent.read', description: 'Consulter les pages d\'parent' },
    { key: 'parent.create', description: 'Créer des pages d\'parent' },
    { key: 'parent.update', description: 'Modifier les pages d\'parent' },
    { key: 'parent.delete', description: 'Supprimer des pages d\'parent' },

      { key: 'matiere.read', description: 'Consulter les pages d\'matiere' },
    { key: 'matiere.create', description: 'Créer des pages d\'matiere' },
    { key: 'matiere.update', description: 'Modifier les pages d\'matiere' },
    { key: 'matiere.delete', description: 'Supprimer des pages d\'matiere' },

    { key: 'staff.read', description: 'Consulter les pages d\'staff' },
    { key: 'staff.create', description: 'Créer des pages d\'staff' },
    { key: 'staff.update', description: 'Modifier les pages d\'staff' },
    { key: 'staff.delete', description: 'Supprimer des pages d\'staff' },

       // Permissions Types (liés à la galerie)
    { key: 'type.read', description: 'Consulter les types de galeries' },
    { key: 'type.create', description: 'Créer des types de galeries' },
    { key: 'type.update', description: 'Modifier des types de galeries' },
    { key: 'type.delete', description: 'Supprimer des types de galeries' },

    { key: 'evenement.read', description: 'Consulter les pages d\'evenement' },
    { key: 'evenement.create', description: 'Créer des pages d\'evenement' },
    { key: 'evenement.update', description: 'Modifier les pages d\'evenement' },
    { key: 'evenement.delete', description: 'Supprimer des pages d\'evenement' },

    { key: 'cours.read', description: 'Consulter les pages de cours' },
    { key: 'cours.create', description: 'Créer des pages de cours' },
    { key: 'cours.update', description: 'Modifier les pages de cours' },
    { key: 'cours.delete', description: 'Supprimer des pages de cours' },

    { key: 'galery.read', description: 'Consulter les pages de galery' },
    { key: 'galery.create', description: 'Créer des pages de galery' },
    { key: 'galery.update', description: 'Modifier les pages de galery' },
    { key: 'galery.delete', description: 'Supprimer des pages de galery' },

    { key: 'video.read', description: 'Consulter les pages de video' },
    { key: 'video.create', description: 'Créer des pages de video' },
    { key: 'video.update', description: 'Modifier les pages de video' },
    { key: 'video.delete', description: 'Supprimer des pages de video' },

    { key: 'contact.read', description: 'Consulter les pages de contact' },
    { key: 'contact.create', description: 'Créer des pages de contact' },
    { key: 'contact.update', description: 'Modifier les pages de contact' },
    { key: 'contact.delete', description: 'Supprimer des pages de contact' },

    { key: 'leavePermission.read', description: 'Consulter les pages de leavePermission' },
    { key: 'leavePermission.create', description: 'Créer des pages de leavePermission' },
    { key: 'leavePermission.update', description: 'Modifier les pages de leavePermission' },
    { key: 'leavePermission.delete', description: 'Supprimer des pages de leavePermission' },
    { key: 'leavePermission.approve', description: 'Approuver les demandes de leavePermission' },
    { key: 'leavePermission.reject', description: 'Rejeter les demandes de leavePermission' },
    { key: 'leavePermission.export', description: 'Exporter les demandes de leavePermission' },
    { key: 'leavePermission.statistics', description: 'Voir les statistiques de leavePermission' },
    { key: 'leavePermission.manage_own', description: 'Gérer ses propres demandes de leavePermission' },

    {key:'niveau.read', description: 'Consulter les pages de niveau'},
    {key:'niveau.create', description: 'Créer des pages de niveau'},
    {key:'niveau.update', description: 'Modifier les pages de niveau'},
    {key:'niveau.delete', description: 'Supprimer des pages de niveau'},

    {key:'annee.read', description: 'Consulter les pages d\'année'},
    {key:'annee.create', description: 'Créer des pages d\'année'},
    {key:'annee.update', description: 'Modifier les pages d\'année'},
    {key:'annee.delete', description: 'Supprimer des pages d\'année'},

    {key:'specialite.read', description: 'Consulter les pages de spécialité'},
    {key:'specialite.create', description: 'Créer des pages de spécialité'},
    {key:'specialite.update', description: 'Modifier les pages de spécialité'},
    {key:'specialite.delete', description: 'Supprimer des pages de spécialité'},

    {key:'filiere.read', description: 'Consulter les pages de filière'},
    {key:'filiere.create', description: 'Créer des pages de filière'},
    {key:'filiere.update', description: 'Modifier les pages de filière'},
    {key:'filiere.delete', description: 'Supprimer des pages de filière'},
    {key:'paiement.read', description: 'Consulter des paiements'},

    {key:'paiement.create', description: 'Enregistrer des paiements'},
    {key:'paiement.update', description: 'Modifier des paiements'},
    {key:'paiement.delete', description: 'Supprimer des paiements'},
    {key:'paiement.export', description: 'Exporter des paiements'},
    {key:'paiement.statistics', description: 'Voir les statistiques de paiements'},

    {key:'absence.read', description: 'Consulter des absences'},
    {key:'absence.create', description: 'Enregistrer des absences'},
    {key:'absence.update', description: 'Modifier des absences'},
    {key:'absence.delete', description: 'Supprimer des absences'},
    {key:'absence.export', description: 'Exporter des absences'},
    {key:'absence.statistics', description: 'Voir les statistiques d\'absences'},

    {key:'retard.read', description: 'Consulter des retard'},
    {key:'retard.create', description: 'Créer des retard'},
    {key:'retard.update', description: 'Modifier des retard'},
    {key:'retard.delete', description: 'Supprimer des retard'},
    {key:'retard.export', description: 'Exporter des retard'},
    {key:'retard.statistics', description: 'Voir les statistiques d\'retard'},

   

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
  const proviseurRole = createdRoles.find(r => r.name === 'PROVISEUR')!;
  const proviseurPermissions = [
    // Gestion des utilisateurs et rôles
    'user.read', 'user.create', 'user.update', 'user.archive',
    'role.read', 'role.create', 'role.update', 'role.assign_permissions',
    'permission.read', 'permission.create', 'permission.update',
    'type.read', 'type.create', 'type.update', 'type.delete',

    // Gestion pédagogique
    'matiere.read', 'matiere.create', 'matiere.update', 'matiere.delete',
    'staff.read', 'staff.create', 'staff.update', 'staff.delete', // Professeurs
    'eleve.read', 'eleve.create', 'eleve.update', 'eleve.export', 'eleve.statistics',
    'classe.read', 'classe.create', 'classe.update', 'classe.manage_eleves',

    // Enregistrer les permissions (leavePermission)
    'leavePermission.read', 'leavePermission.create', 'leavePermission.update', 'leavePermission.approve', 'leavePermission.reject', 'leavePermission.statistics',

    // Statistiques générales
    'note.read', 'note.export',
    'absence.read', 'absence.statistics',
    'retard.read', 'retard.statistics',
    'paiement.read', 'paiement.statistics',

    // Événements
    'evenement.read', 'evenement.create', 'evenement.update', 'evenement.delete',
    

    // Pages de contenu
    'accueil.read', 'accueil.create', 'accueil.update',

    // Gestion des médias et contenus
    'galery.read', 'galery.create', 'galery.update', 'galery.delete',
    'video.read', 'video.create', 'video.update', 'video.delete',
    'presentation.read', 'presentation.create', 'presentation.update', 'presentation.delete',

    // Gestion académique
    'niveau.read', 'niveau.create', 'niveau.update', 'niveau.delete',
    'annee.read', 'annee.create', 'annee.update', 'annee.delete',
    'specialite.read', 'specialite.create', 'specialite.update', 'specialite.delete',
    'filiere.read', 'filiere.create', 'filiere.update', 'filiere.delete'
  ];

  const proviseurPermissionsObjects = proviseurPermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

  await prisma.role.update({
    where: { id: proviseurRole.id },
    data: {
      permissions: {
        connect: proviseurPermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ PROVISEUR: ${proviseurPermissionsObjects.length} permissions assignées`);

  // PROFESSEUR : Gestion pédagogique
  const professeurRole = createdRoles.find(r => r.name === 'PROFESSEUR')!;
  const professeurPermissions = [
    'eleve.read', 'eleve.statistics',
    'classe.read',
    'note.read', 'note.create', 'note.update', 'note.export'
  ];

  const professeurPermissionsObjects = professeurPermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

  await prisma.role.update({
    where: { id: professeurRole.id },
    data: {
      permissions: {
        connect: professeurPermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ PROFESSEUR: ${professeurPermissionsObjects.length} permissions assignées`);

  // SECRETAIRE : Gestion administrative limitée
  const secretaireRole = createdRoles.find(r => r.name === 'SECRETAIRE')!;
  const secretairePermissions = [
    'user.read', 'user.update',
    'eleve.read', 'eleve.update', 'eleve.export',
    'classe.read',
    'note.read',
    
    'accueil.read', 'accueil.update'
  ];

  const secretairePermissionsObjects = secretairePermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

  await prisma.role.update({
    where: { id: secretaireRole.id },
    data: {
      permissions: {
        connect: secretairePermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ SECRETAIRE: ${secretairePermissionsObjects.length} permissions assignées`);

  // ECONOME : Gestion financière et inscriptions
  const economeRole = createdRoles.find(r => r.name === 'ECONOME')!;
  const economePermissions = [
    'inscription.read', 'inscription.create', 'inscription.update', 'inscription.delete',
    'paiement.read', 'paiement.create', 'paiement.update', 'paiement.export', 'paiement.statistics',
    'eleve.read', 'eleve.update', // Pour répartir les élèves par classe
    'classe.read', 'classe.update', 'classe.manage_eleves',
    'evenement.read'
  ];

  const economePermissionsObjects = economePermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

  await prisma.role.update({
    where: { id: economeRole.id },
    data: {
      permissions: {
        connect: economePermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ ECONOME: ${economePermissionsObjects.length} permissions assignées`);

  // SURVEILLANT : Discipline et présence
  const surveillantRole = createdRoles.find(r => r.name === 'SURVEILLANT')!;
  const surveillantPermissions = [
    'eleve.read', // Voir la liste des élèves
    'staff.read', // Voir la liste des professeurs
    'retard.read', 'retard.create', 'retard.update',
    'absence.read', 'absence.create', 'absence.update',
    'leavePermission.read', 'leavePermission.create', 'leavePermission.update', 'leavePermission.approve', 'leavePermission.reject',
    'evenement.read'
  ];

  const surveillantPermissionsObjects = surveillantPermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

  await prisma.role.update({
    where: { id: surveillantRole.id },
    data: {
      permissions: {
        connect: surveillantPermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ SURVEILLANT: ${surveillantPermissionsObjects.length} permissions assignées`);

  // PARENT : Consultation de son enfant
  const parentRole = createdRoles.find(r => r.name === 'PARENT')!;
  const parentPermissions = [
    'evenement.read', // Voir les événements
    'matiere.read', 'eleve.read', 'staff.read', // Voir liste matières, élèves, professeurs
    'absence.read', 'retard.read', // Voir absences/retards de son enfant
    'paiement.read', 'paiement.create', // Effectuer un paiement
    'inscription.read', 'inscription.create', // Faire une inscription
    'note.read' // Consulter les notes de son enfant
  ];

  const parentPermissionsObjects = parentPermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

  await prisma.role.update({
    where: { id: parentRole.id },
    data: {
      permissions: {
        connect: parentPermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ PARENT: ${parentPermissionsObjects.length} permissions assignées`);

  // ELEVE : Consultation de ses propres données
  const eleveRole = createdRoles.find(r => r.name === 'ELEVE')!;
  const elevePermissions = [
    'contact.create', // Faire une réclamation
    'evenement.read', // Voir les événements
    'matiere.read', 'eleve.read', 'staff.read', // Voir liste matières, élèves, professeurs
    'absence.read', 'retard.read', // Voir ses absences et retards
    'paiement.read', 'paiement.create', // Effectuer un paiement
    'inscription.read', 'inscription.create', // Faire une inscription
    'note.read' // Consulter ses notes
  ];

  const elevePermissionsObjects = elevePermissions
    .map(key => createdPermissions.find(p => p.key === key))
    .filter(p => p !== undefined);

  await prisma.role.update({
    where: { id: eleveRole.id },
    data: {
      permissions: {
        connect: elevePermissionsObjects.map(p => ({ id: p!.id }))
      }
    }
  });
  console.log(`✅ ELEVE: ${elevePermissionsObjects.length} permissions assignées`);

  // ============================================
  // 4. CRÉATION D'UN UTILISATEUR ADMIN PAR DÉFAUT
  // ============================================

  console.log('👤 Création de l\'utilisateur admin par défaut...');

  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@ecole.com' }
  });

  if (existingAdmin) {
    console.log('✅ Utilisateur admin existe déjà:', existingAdmin.email);
  } else {
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@ecole.com',
        password: hashedPassword,
        nom: 'Admin',
        prenom: 'System',
        role: {
          connect: { id: adminRole.id }
        }
      }
    });

    console.log(`✅ Utilisateur admin créé: ${adminUser.email}`);
  }

  // ============================================
  // 5. CRÉATION DES UTILISATEURS SUPPLÉMENTAIRES
  // ============================================

  console.log('\n👥 Création des utilisateurs supplémentaires...');

  const professorRole = createdRoles.find(r => r.name === 'PROFESSEUR')!;
  const parentRole2 = createdRoles.find(r => r.name === 'PARENT')!;
  const eleveRole2 = createdRoles.find(r => r.name === 'ELEVE')!;
  const staffRole = createdRoles.find(r => r.name === 'SURVEILLANT')!;

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
          password: hashedPassword,
          adresse: `${userData.prenom} street, Dakar`,
          phone: '221' + Math.floor(Math.random() * 900000000 + 100000000).toString(),
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

  // ============================================
  // 7. CRÉATION DES TYPES D'ENSEIGNEMENT
  // ============================================

  console.log('\n🎓 Création des types d\'enseignement...');

  const typeEnseignements = [];
  for (const nom of ['Primaire', 'Collège', 'Lycée']) {
    const type = await prisma.typeEnseignement.create({ data: { nom } });
    typeEnseignements.push(type);
    console.log(`✅ Type d'enseignement créé: ${type.nom}`);
  }

  // ============================================
  // 8. CRÉATION DES NIVEAUX
  // ============================================

  console.log('\n📚 Création des niveaux...');

  const niveaux = [];
  const niveauxData = [
    { nomNiveau: '6ème', cycle: 'Collège', typeEnseignementId: typeEnseignements[1].id },
    { nomNiveau: '5ème', cycle: 'Collège', typeEnseignementId: typeEnseignements[1].id },
    { nomNiveau: '4ème', cycle: 'Collège', typeEnseignementId: typeEnseignements[1].id },
    { nomNiveau: '3ème', cycle: 'Collège', typeEnseignementId: typeEnseignements[1].id },
    { nomNiveau: '2nde', cycle: 'Lycée', typeEnseignementId: typeEnseignements[2].id },
    { nomNiveau: '1ère', cycle: 'Lycée', typeEnseignementId: typeEnseignements[2].id },
    { nomNiveau: 'Terminale', cycle: 'Lycée', typeEnseignementId: typeEnseignements[2].id }
  ];

  for (const niveauData of niveauxData) {
    const niveau = await prisma.niveau.create({ data: niveauData });
    niveaux.push(niveau);
    console.log(`✅ Niveau créé: ${niveau.nomNiveau}`);
  }

  // ============================================
  // 9. CRÉATION DES FILIÈRES
  // ============================================

  console.log('\n🎯 Création des filières...');

  const filieres = [];
  for (const nom of ['Scientifique', 'Littéraire', 'Technique']) {
    const filiere = await prisma.filiere.upsert({
      where: { nom },
      update: {},
      create: { nom }
    });
    filieres.push(filiere);
    console.log(`✅ Filière créée: ${filiere.nom}`);
  }

  // ============================================
  // 10. CRÉATION DES SPÉCIALITÉS
  // ============================================

  console.log('\n🔬 Création des spécialités...');

  const specialites = [];
  const specialitesData = [
    { nom: 'Mathématiques', filiereId: filieres[0].id },
    { nom: 'Physique-Chimie', filiereId: filieres[0].id },
    { nom: 'Biologie', filiereId: filieres[0].id },
    { nom: 'Français', filiereId: filieres[1].id },
    { nom: 'Philosophie', filiereId: filieres[1].id }
  ];

  for (const s of specialitesData) {
    const specialite = await prisma.specialite.upsert({
      where: { nom: s.nom },
      update: {},
      create: s
    });
    specialites.push(specialite);
    console.log(`✅ Spécialité créée: ${specialite.nom}`);
  }

  // ============================================
  // 11. CRÉATION DES MATIÈRES
  // ============================================

  console.log('\n📖 Création des matières...');

  const matieres = [];
  const matieresData = [
    { libelle: 'Mathématiques', type: 'scientifique' },
    { libelle: 'Français', type: 'litteraire' },
    { libelle: 'Anglais', type: 'litteraire' },
    { libelle: 'Physique', type: 'scientifique' },
    { libelle: 'Chimie', type: 'scientifique' },
    { libelle: 'Histoire-Géographie', type: 'litteraire' },
    { libelle: 'Éducation Civique', type: 'litteraire' },
    { libelle: 'Éducation Physique', type: null },
    { libelle: 'Informatique', type: 'scientifique' },
    { libelle: 'Biologie', type: 'scientifique' }
  ];

  for (const matiereData of matieresData) {
    try {
      const matiere = await prisma.matiere.create({ data: matiereData });
      matieres.push(matiere);
      console.log(`✅ Matière créée: ${matiere.libelle} (${matiere.type || 'non spécifié'})`);
    } catch (e: any) {
      // Si la matière existe déjà, la récupérer
      const existing = await prisma.matiere.findFirst({ where: { libelle: matiereData.libelle } });
      if (existing) {
        matieres.push(existing);
      }
    }
  }

  // ============================================
  // 12. CRÉATION DES SÉRIES
  // ============================================

  console.log('\n🔗 Création des séries...');

  const series = [];
  const seriesData = [
    { nom: 'Série S1', niveauId: niveaux[4].id },
    { nom: 'Série L1', niveauId: niveaux[4].id },
    { nom: 'Série S2', niveauId: niveaux[5].id },
    { nom: 'Série L2', niveauId: niveaux[5].id }
  ];

  for (const s of seriesData) {
    const serie = await prisma.serie.create({ data: s });
    series.push(serie);
    console.log(`✅ Série créée: ${serie.nom}`);
  }

  // ============================================
  // 13. CRÉATION DES COEFFICIENTS NIVEAU
  // ============================================

  console.log('\n📊 Création des coefficients niveau...');

  let coefNiveauCount = 0;
  for (let i = 0; i < Math.min(4, niveaux.length); i++) {
    for (let j = 0; j < Math.min(3, matieres.length); j++) {
      try {
        await prisma.coeficientNiveau.create({
          data: {
            valeur: Math.floor((j + 1) * 2) as any,
            niveauId: niveaux[i].id,
            matiereId: matieres[j].id
          }
        } as any);
        coefNiveauCount++;
      } catch (e) {}
    }
  }
  console.log(`✅ ${coefNiveauCount} coefficients niveau créés`);

  // ============================================
  // 14. CRÉATION DES COEFFICIENTS SÉRIE
  // ============================================

  console.log('\n📊 Création des coefficients série...');

  let coefSerieCount = 0;
  for (let i = 0; i < Math.min(2, series.length); i++) {
    for (let j = 0; j < Math.min(3, matieres.length); j++) {
      try {
        await prisma.coeficientSerie.create({
          data: {
            valeur: Math.floor((j + 2) * 3),
            matiereId: matieres[j].id,
            serieId: series[i].id
          }
        } as any);
        coefSerieCount++;
      } catch (e) {}
    }
  }
  console.log(`✅ ${coefSerieCount} coefficients série créés`);

  // ============================================
  // 15. CRÉATION DES CLASSES
  // ============================================

  console.log('\n🏛️ Création des classes...');

  const classes = [];
  for (let i = 0; i < Math.min(3, niveaux.length); i++) {
    for (let j = 1; j <= 2; j++) {
      const classe = await prisma.classe.create({
        data: {
          nom: `${niveaux[i].nomNiveau} - Classe ${j}`,
          capacite: Math.floor(30 + Math.random() * 20),
          niveauId: niveaux[i].id,
          anneeId: createdAnnees[1].id
        }
      });
      classes.push(classe);
      console.log(`✅ Classe créée: ${classe.nom}`);
    }
  }

  // ============================================
  // 16. CRÉATION DES STAFF
  // ============================================

  console.log('\n👨‍💼 Création des staff...');

  const staffs = [];
  for (const user of createdUsers) {
    if (user.roleId === professorRole.id || user.roleId === staffRole.id) {
      const staff = await prisma.staff.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id }
      });
      staffs.push(staff);
      console.log(`✅ Staff créé pour: ${user.prenom} ${user.nom}`);
    }
  }

  // ============================================
  // 17. CRÉATION DES ÉLÈVES
  // ============================================

  console.log('\n👨‍🎓 Création des élèves...');

  const eleves = [];
  for (const user of createdUsers) {
    if (user.roleId === eleveRole2.id) {
      const eleve = await prisma.eleve.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          niveauId: niveaux[0].id,
          classeId: classes[0].id,
          anneeId: createdAnnees[1].id,
          filiereId: filieres[0].id
        }
      });
      eleves.push(eleve);
      console.log(`✅ Élève créé: ${user.prenom} ${user.nom}`);
    }
  }

  // ============================================
  // 18. CRÉATION DES PARENTS
  // ============================================

  console.log('\n👨‍👩‍👧 Création des parents...');

  const parents = [];
  for (const user of createdUsers) {
    if (user.roleId === parentRole2.id) {
      const parent = await prisma.parent.upsert({
        where: { userId: user.id },
        update: {},
        create: { userId: user.id }
      });
      if (eleves.length > 0) {
        await prisma.parent.update({
          where: { id: parent.id },
          data: { eleves: { connect: { id: eleves[0].id } } }
        });
      }
      parents.push(parent);
      console.log(`✅ Parent créé: ${user.prenom} ${user.nom}`);
    }
  }

  // ============================================
  // 19. CRÉATION DES TYPES (GALERIE)
  // ============================================

  console.log('\n🎨 Création des types...');

  const types = [];
  for (const nom of ['Événement', 'Classe', 'Activité', 'Sortie']) {
    const type = await prisma.type.create({ data: { nom } });
    types.push(type);
    console.log(`✅ Type créé: ${type.nom}`);
  }

  // ============================================
  // 20. CRÉATION DES INSCRIPTIONS
  // ============================================

  console.log('\n📝 Création des inscriptions...');

  let inscCount = 0;
  for (let i = 0; i < Math.min(2, eleves.length); i++) {
    await prisma.inscription.create({
      data: {
        eleveId: eleves[i].id,
        anneeId: createdAnnees[1].id,
        etape1: 'validée',
        etape2: 'validée',
        etape3: 'en cours'
      }
    });
    inscCount++;
  }
  console.log(`✅ ${inscCount} inscriptions créées`);

  // ============================================
  // 21. CRÉATION DES PAIEMENTS
  // ============================================

  console.log('\n💳 Création des paiements...');

  const inscriptions = await prisma.inscription.findMany({ take: 2 });
  let paiCount = 0;
  for (const insc of inscriptions) {
    await prisma.paiement.create({
      data: {
        date: new Date(),
        modePaiement: 'Virement',
        montant: 150000,
        inscriptionId: insc.id,
        eleveId: insc.eleveId
      }
    });
    paiCount++;
  }
  console.log(`✅ ${paiCount} paiements créés`);

  // ============================================
  // 22. CRÉATION DES RETARDS
  // ============================================

  console.log('\n⏰ Création des retards...');

  let retCount = 0;
  for (let i = 0; i < Math.min(2, eleves.length); i++) {
    await prisma.retard.create({
      data: {
        date: new Date(),
        autorisation: 'Oui',
        justification: true,
        confProf: false,
        eleveId: eleves[i].id,
        matiereId: matieres[0].id,
        classeId: classes[0].id
      }
    });
    retCount++;
  }
  console.log(`✅ ${retCount} retards créés`);

  // ============================================
  // 23. CRÉATION DES ABSENCES
  // ============================================

  console.log('\n❌ Création des absences...');

  let absCount = 0;
  for (let i = 0; i < Math.min(2, eleves.length); i++) {
    await prisma.absence.create({
      data: {
        dateDebut: new Date(),
        dateFin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        motif: 'Maladie',
        justification: false,
        eleveId: eleves[i].id,
        matiereId: matieres[1].id,
        classeId: classes[0].id
      }
    });
    absCount++;
  }
  console.log(`✅ ${absCount} absences créées`);

  // ============================================
  // 24. CRÉATION DES RÉFÉRENCES SAC
  // ============================================

  console.log('\n📚 Création des références SAC...');

  const referenceSacs = [];
  let refCount = 0;
  if (staffs.length > 0 && classes.length > 0 && matieres.length > 0) {
    const ref = await prisma.reference_sac.create({
      data: {
        staffId: staffs[0].id,
        matiereId: matieres[0].id,
        classeId: classes[0].id,
        anneeId: createdAnnees[1].id
      }
    });
    referenceSacs.push(ref);
    refCount++;
  }
  console.log(`✅ ${refCount} références SAC créées`);

  // ============================================
  // 25. CRÉATION DES ÉVALUATIONS
  // ============================================

  console.log('\n📋 Création des évaluations...');

  const evals = [];
  if (referenceSacs.length > 0) {
    for (let i = 0; i < 2; i++) {
      const eval_item = await prisma.evaluation.create({
        data: {
          type: i === 0 ? 'Contrôle continu' : 'Devoir',
          date: new Date(),
          referenceSacId: referenceSacs[0].id
        }
      });
      evals.push(eval_item);
    }
  }
  console.log(`✅ ${evals.length} évaluations créées`);

  // ============================================
  // 26. CRÉATION DES NOTES
  // ============================================

  console.log('\n📝 Création des notes...');

  let noteCount = 0;
  if (eleves.length > 0 && evals.length > 0) {
    await prisma.note.create({
      data: {
        valeur: 15.5,
        eleveId: eleves[0].id,
        evaluationId: evals[0].id
      }
    });
    noteCount++;
  }
  console.log(`✅ ${noteCount} notes créées`);

  // ============================================
  // 27. CRÉATION DES ÉVÉNEMENTS
  // ============================================

  console.log('\n🎉 Création des événements...');

  let eventCount = 0;
  const eventDates = [
    { nom: 'Rentrée 2025', debut: '2025-09-01', fin: '2025-09-05' },
    { nom: 'Journée du sport', debut: '2025-10-15', fin: '2025-10-15' },
    { nom: 'Examens Q1', debut: '2025-11-20', fin: '2025-12-10' }
  ];

  for (const evt of eventDates) {
    await prisma.evenement.create({
      data: {
        nom: evt.nom,
        dateDebut: new Date(evt.debut),
        dateFin: new Date(evt.fin),
        lieu: 'Établissement',
        statut: 'EN_ATTENTE',
        userId: createdUsers[0].id
      }
    });
    eventCount++;
  }
  console.log(`✅ ${eventCount} événements créés`);

  // ============================================
  // 27. CRÉATION DES COURS
  // ============================================

  console.log('\n📚 Création des cours...');

  const cours = await prisma.cours.create({
    data: {
      nom: 'Math - Algebra',
      description: 'Introduction',
      userId: createdUsers[0].id,
      niveauId: niveaux[0].id,
      matiereId: matieres[0].id
    }
  });
  if (eleves.length > 0) {
    await prisma.cours.update({
      where: { id: cours.id },
      data: { eleves: { connect: [{ id: eleves[0].id }] } }
    });
  }
  console.log(`✅ 1 cours créé`);

  // ============================================
  // 28. CRÉATION DES VIDÉOS
  // ============================================

  console.log('\n🎥 Création des vidéos...');

  await prisma.video.create({
    data: {
      fileVideo: 'math.mp4',
      description: 'Intro aux équations',
      userId: createdUsers[0].id,
      niveauId: niveaux[0].id,
      matiereId: matieres[0].id
    }
  });
  console.log(`✅ 1 vidéo créée`);

  // ============================================
  // 29. CRÉATION DES CONTACTS
  // ============================================

  console.log('\n📞 Création des contacts...');

  await prisma.contact.create({ data: { nom: 'Diallo', email: 'contact@test.com' } });
  console.log(`✅ 1 contact créé`);

  // ============================================
  // 30. CRÉATION DE L'ACCUEIL
  // ============================================

  console.log('\n🏠 Création de l\'accueil...');

  await prisma.accueil.create({
    data: {
      nom: 'Accueil',
      description: 'Bienvenue',
      images: ['banner1.jpg'],
      userId: createdUsers[0].id
    }
  });
  console.log(`✅ 1 accueil créé`);

  // ============================================
  // 31. CRÉATION DES ACTUALITÉS
  // ============================================

  console.log('\n📰 Création des actualités...');

  if (types.length > 0) {
    await prisma.actualite.create({
      data: {
        nom: 'Nouvelle année',
        description: 'La rentrée!',
        typeId: types[0].id,
        userId: createdUsers[0].id
      }
    });
  }
  console.log(`✅ 1 actualité créée`);

  // ============================================
  // 32. CRÉATION DES GALERIES
  // ============================================

  console.log('\n🖼️ Création des galeries...');

  if (types.length > 0) {
    await prisma.gallery.create({
      data: {
        image: 'photo1.jpg',
        description: 'Photos',
        userId: createdUsers[0].id,
        typeId: types[0].id
      }
    });
  }
  console.log(`✅ 1 galerie créée`);

  // ============================================
  // 33. CRÉATION DE LA PRÉSENTATION
  // ============================================

  console.log('\n📄 Création de la présentation...');

  await prisma.presentation.create({
    data: {
      description: 'Notre école',
      histoire: 'Fondée en 1995',
      mission: 'Éduquer',
      phone: '221771234567',
      email: 'info@ecole.com',
      userId: createdUsers[0].id
    }
  });
  console.log(`✅ 1 présentation créée`);

  // ============================================
  // 34. CRÉATION DES SITE ELEVES (Page du site pour élèves)
  // ============================================

  console.log('\n🌐 Création des élèves du site...');

  let siteEleveCount = 0;
  for (const user of createdUsers) {
    if (user.roleId === eleveRole2.id) {
      await prisma.siteEleve.create({
        data: {
          nom: user.nom,
          prenom: user.prenom,
          userId: user.id
        }
      });
      siteEleveCount++;
    }
  }
  console.log(`✅ ${siteEleveCount} élève(s) du site créé(s)`);

  // ============================================
  // 35. CRÉATION DES DEMANDES DE CONGÉ
  // ============================================

  console.log('\n🏖️ Création des congés...');

  let leaveCount = 0;
  if (staffs.length > 0) {
    await prisma.leavePermission.create({
      data: {
        motif: 'Congé annuel',
        dateDebut: new Date(),
        dateFin: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        statut: 'en attente',
        userId: createdUsers[0].id
      }
    });
    leaveCount++;
  }
  console.log(`✅ ${leaveCount} congé créé`);

  // ============================================
  // 36. AFFICHAGE DU RÉSUMÉ
  // ============================================

  console.log('\n' + '='.repeat(60));
  console.log('✅ SEED COMPLET TERMINÉ AVEC SUCCÈS!');
  console.log('='.repeat(60));
  console.log('\n📊 RÉSUMÉ DU SEED:');
  console.log(`• ${createdRoles.length} rôles créés`);
  console.log(`• ${createdPermissions.length} permissions créées`);
  console.log(`• ${createdUsers.length} utilisateurs supplémentaires créés`);
  console.log(`• ${createdAnnees.length} années académiques créées`);
  console.log(`• ${typeEnseignements.length} types d'enseignement créés`);
  console.log(`• ${niveaux.length} niveaux créés`);
  console.log(`• ${filieres.length} filières créées`);
  console.log(`• ${specialites.length} spécialités créées`);
  console.log(`• ${matieres.length} matières créées`);
  console.log(`• ${series.length} séries créées`);
  console.log(`• ${coefNiveauCount} coefficients niveau créés`);
  console.log(`• ${coefSerieCount} coefficients série créés`);
  console.log(`• ${classes.length} classes créées`);
  console.log(`• ${staffs.length} staff créés`);
  console.log(`• ${eleves.length} élèves créés`);
  console.log(`• ${siteEleveCount} élève(s) du site créé(s)`);
  console.log(`• ${parents.length} parents créés`);
  console.log(`• ${types.length} types créés`);
  console.log(`• ${inscCount} inscriptions créées`);
  console.log(`• ${paiCount} paiements créés`);
  console.log(`• ${retCount} retards créés`);
  console.log(`• ${absCount} absences créées`);
  console.log(`• ${evals.length} évaluations créées`);
  console.log(`• ${refCount} références SAC créées`);
  console.log(`• ${eventCount} événements créés`);
  console.log(`• 1 cours créé, 1 vidéo créée, 1 contact créé`);
  console.log(`• 1 accueil, 1 actualité, 1 galerie, 1 présentation créés`);
  console.log(`• ${leaveCount} demande de congé créée`);

  console.log('\n🔐 COMPTES DE TEST CRÉÉS:');
  console.log('   Admin: admin@ecole.com / admin123');
  console.log('   Professeurs: marie.diallo@ecole.com / prof123');
  console.log('   Parents: moussa.sow@parent.com / parent123');
  console.log('   Élèves: khalipha.toure@eleve.com / eleve123');
  console.log('   Staff: adama.ndiaye@staff.com / staff123');
  console.log('='.repeat(60));
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