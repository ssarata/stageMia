import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function reassignAndDeleteLecteur() {
  console.log('🔄 Réassignation des utilisateurs LECTEUR vers MIA...');

  try {
    // Trouver les rôles
    const lecteurRole = await prisma.role.findUnique({
      where: { nomRole: 'LECTEUR' }
    });

    const miaRole = await prisma.role.findUnique({
      where: { nomRole: 'MIA' }
    });

    if (!lecteurRole) {
      console.log('ℹ️  Le rôle LECTEUR n\'existe pas.');
      return;
    }

    if (!miaRole) {
      console.log('❌ Le rôle MIA n\'existe pas. Impossible de réassigner.');
      return;
    }

    // Trouver tous les utilisateurs LECTEUR
    const lecteurUsers = await prisma.user.findMany({
      where: { roleId: lecteurRole.id },
      select: { id: true, email: true, nom: true, prenom: true }
    });

    console.log(`📊 ${lecteurUsers.length} utilisateur(s) à réassigner:`);
    lecteurUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.nom} ${user.prenom})`);
    });

    // Réassigner tous les utilisateurs LECTEUR au rôle MIA
    const result = await prisma.user.updateMany({
      where: { roleId: lecteurRole.id },
      data: { roleId: miaRole.id }
    });

    console.log(`✅ ${result.count} utilisateur(s) réassigné(s) au rôle MIA`);

    // Supprimer les relations avec les permissions
    await prisma.role.update({
      where: { id: lecteurRole.id },
      data: {
        permissions: {
          set: []
        }
      }
    });
    console.log('✅ Relations avec les permissions supprimées');

    // Supprimer le rôle LECTEUR
    await prisma.role.delete({
      where: { id: lecteurRole.id }
    });

    console.log('✅ Rôle LECTEUR supprimé avec succès!');
    console.log('\n📋 Résumé:');
    console.log(`   - ${result.count} utilisateur(s) réassigné(s) au rôle MIA`);
    console.log(`   - Rôle LECTEUR supprimé de la base de données`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

reassignAndDeleteLecteur()
  .then(() => {
    console.log('\n✅ Script terminé avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
