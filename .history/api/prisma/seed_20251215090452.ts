import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer les permissions
  const permissions = [
    { nomPermission: 'VIEW_USERS', description: 'Voir tous les utilisateurs' },
    { nomPermission: 'CREATE_USER', description: 'Créer un utilisateur' },
    { nomPermission: 'UPDATE_USER', description: 'Modifier un utilisateur' },
    { nomPermission: 'DELETE_USER', description: 'Supprimer un utilisateur' },
    { nomPermission: 'VIEW_ROLES', description: 'Voir tous les rôles' },
    { nomPermission: 'CREATE_ROLE', description: 'Créer un rôle' },
    { nomPermission: 'UPDATE_ROLE', description: 'Modifier un rôle' },
    { nomPermission: 'DELETE_ROLE', description: 'Supprimer un rôle' },
    { nomPermission: 'VIEW_PERMISSIONS', description: 'Voir toutes les permissions' },
    { nomPermission: 'CREATE_PERMISSION', description: 'Créer une permission' },
    { nomPermission: 'UPDATE_PERMISSION', description: 'Modifier une permission' },
    { nomPermission: 'DELETE_PERMISSION', description: 'Supprimer une permission' },

    { nomPermission: 'VIEW_contactS', description: 'Voir toutes les contacts' },
    { nomcontact: 'CREATE_contact', description: 'Créer une contact' },
    { nomcontact: 'UPDATE_contact', description: 'Modifier une contact' },
    { nomcontact: 'DELETE_contact', description: 'Supprimer une contact' },

    { nomPermission: 'VIEW_PERMISSIONS', description: 'Voir toutes les permissions' },
    { nomPermission: 'CREATE_PERMISSION', description: 'Créer une permission' },
    { nomPermission: 'UPDATE_PERMISSION', description: 'Modifier une permission' },
    { nomPermission: 'DELETE_PERMISSION', description: 'Supprimer une permission' },

  ];

  console.log('📝 Création des permissions...');
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { nomPermission: permission.nomPermission },
      update: {},
      create: permission
    });
  }
  console.log('✅ Permissions créées');

  // Créer les rôles
  console.log('👥 Création des rôles...');

  const adminRole = await prisma.role.upsert({
    where: { nomRole: 'Admin' },
    update: {},
    create: {
      nomRole: 'Admin',
      description: 'Administrateur avec tous les droits',
      permissions: {
        connect: permissions.map(p => ({ nomPermission: p.nomPermission }))
      }
    }
  });

  const userRole = await prisma.role.upsert({
    where: { nomRole: 'User' },
    update: {},
    create: {
      nomRole: 'User',
      description: 'Utilisateur standard'
    }
  });

  console.log('✅ Rôles créés');

  // Créer des catégories
  console.log('📂 Création des catégories...');
  const categories = [
    { nomCategorie: 'Travail', description: 'Contacts professionnels' },
    { nomCategorie: 'Famille', description: 'Membres de la famille' },
    { nomCategorie: 'Amis', description: 'Amis et connaissances' },
    { nomCategorie: 'Fournisseurs', description: 'Fournisseurs et partenaires' },
    { nomCategorie: 'Clients', description: 'Clients et prospects' }
  ];

  for (const categorie of categories) {
    await prisma.categorie.upsert({
      where: { nomCategorie: categorie.nomCategorie },
      update: {},
      create: categorie
    });
  }
  console.log('✅ Catégories créées');

  // Créer un utilisateur admin
  console.log('👤 Création de l\'utilisateur admin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@mia.com' },
    update: {},
    create: {
      nom: 'Admin',
      prenom: 'MIA',
      email: 'admin@mia.com',
      adresse: '123 rue de l\'Admin',
      telephone: '+22890000000',
      motDePasse: hashedPassword,
      sexe: 'M',
      roleId: adminRole.id
    }
  });
  console.log('✅ Utilisateur admin créé');

  // Créer quelques utilisateurs de test
  console.log('👥 Création des utilisateurs de test...');
  const testUsers = [
    {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@mia.com',
      adresse: '10 rue de Paris',
      telephone: '+22890111111',
      motDePasse: await bcrypt.hash('password123', 10),
      sexe: 'M',
      roleId: userRole.id
    },
    {
      nom: 'Martin',
      prenom: 'Marie',
      email: 'marie.martin@mia.com',
      adresse: '20 avenue des Champs',
      telephone: '+22890222222',
      motDePasse: await bcrypt.hash('password123', 10),
      sexe: 'F',
      roleId: userRole.id
    },
    {
      nom: 'Bernard',
      prenom: 'Pierre',
      email: 'pierre.bernard@mia.com',
      adresse: '30 boulevard de la République',
      telephone: '+22890333333',
      motDePasse: await bcrypt.hash('password123', 10),
      sexe: 'M',
      roleId: userRole.id
    }
  ];

  for (const user of testUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
  }
  console.log('✅ Utilisateurs de test créés');

  // Créer quelques contacts pour l'admin
  console.log('📇 Création de contacts de test...');
  const travailCategorie = await prisma.categorie.findUnique({
    where: { nomCategorie: 'Travail' }
  });

  const contacts = [
    {
      nom: 'Kouassi',
      prenom: 'Kofi',
      telephone: '+22890444444',
      email: 'kofi.kouassi@entreprise.com',
      adresse: '15 rue du Commerce',
      fonction: 'Directeur',
      organisation: 'Entreprise ABC',
      notes: 'Contact important',
      userId: adminUser.id,
      categorieId: travailCategorie?.id
    },
    {
      nom: 'Adjovi',
      prenom: 'Sena',
      telephone: '+22890555555',
      email: 'sena.adjovi@societe.com',
      adresse: '25 avenue de la Liberté',
      fonction: 'Manager',
      organisation: 'Société XYZ',
      notes: 'Rencontre programmée',
      userId: adminUser.id,
      categorieId: travailCategorie?.id
    }
  ];

  for (const contact of contacts) {
    await prisma.contact.create({
      data: contact
    });
  }
  console.log('✅ Contacts de test créés');

  console.log('🎉 Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
