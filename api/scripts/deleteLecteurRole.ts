import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteLecteurRole() {
  console.log('🗑️  Suppression du rôle LECTEUR...');

  try {
    // Vérifier si le rôle LECTEUR existe
    const lecteurRole = await prisma.role.findUnique({
      where: { nomRole: 'LECTEUR' },
      include: {
        _count: {
          select: {
            users: true,
            permissions: true
          }
        }
      }
    });

    if (!lecteurRole) {
      console.log('ℹ️  Le rôle LECTEUR n\'existe pas dans la base de données.');
      return;
    }

    console.log(`📊 Rôle LECTEUR trouvé:`);
    console.log(`   - ID: ${lecteurRole.id}`);
    console.log(`   - Utilisateurs associés: ${lecteurRole._count.users}`);
    console.log(`   - Permissions associées: ${lecteurRole._count.permissions}`);

    // Vérifier s'il y a des utilisateurs avec ce rôle
    if (lecteurRole._count.users > 0) {
      console.log(`⚠️  ATTENTION: ${lecteurRole._count.users} utilisateur(s) ont le rôle LECTEUR.`);
      console.log('   Ces utilisateurs doivent être réassignés à un autre rôle avant de supprimer LECTEUR.');

      const users = await prisma.user.findMany({
        where: { roleId: lecteurRole.id },
        select: { id: true, email: true, nom: true, prenom: true }
      });

      console.log('   Utilisateurs concernés:');
      users.forEach(user => {
        console.log(`   - ${user.email} (${user.nom} ${user.prenom})`);
      });

      console.log('\n❌ Suppression annulée. Veuillez d\'abord réassigner ces utilisateurs.');
      return;
    }

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

    // Supprimer le rôle
    await prisma.role.delete({
      where: { id: lecteurRole.id }
    });

    console.log('✅ Rôle LECTEUR supprimé avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de la suppression du rôle LECTEUR:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteLecteurRole()
  .then(() => {
    console.log('✅ Script terminé avec succès!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
