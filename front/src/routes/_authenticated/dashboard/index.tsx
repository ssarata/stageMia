import { createFileRoute } from '@tanstack/react-router'
import { useGetDashboardStats } from '@/hooks/private/dashboardHook'
import StatsCard from '@/components/privates/dashboard/StatsCard'
import CategoryChart from '@/components/privates/dashboard/CategoryChart'
import PlatformChart from '@/components/privates/dashboard/PlatformChart'
import RecentActivity from '@/components/privates/dashboard/RecentActivity'
import {
  Users,
  UserPlus,
  Contact,
  Mail,
  Bell,
  Share2,
  Loader2
} from 'lucide-react'
import { AdminOnly, MIAOnly } from '@/components/Global/ProtectedAction'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: DashboardHome,
})

function DashboardHome() {
  const { data: stats, isLoading } = useGetDashboardStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Impossible de charger les statistiques
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur votre tableau de bord MIA
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Statistiques utilisateurs - visible seulement pour Admin et MIA */}
        <AdminOnly hideIfNoAccess>
          {stats.users.total !== null && (
            <StatsCard
              title="Total Utilisateurs"
              value={stats.users.total}
              icon={Users}
              description="Nombre total d'utilisateurs"
              iconClassName="text-blue-600"
            />
          )}
        </AdminOnly>

        <MIAOnly hideIfNoAccess>
          {stats.users.total !== null && (
            <StatsCard
              title="Total Utilisateurs"
              value={stats.users.total}
              icon={Users}
              description="Nombre total d'utilisateurs"
              iconClassName="text-blue-600"
            />
          )}
        </MIAOnly>

        <AdminOnly hideIfNoAccess>
          {stats.users.newThisMonth !== null && (
            <StatsCard
              title="Nouveaux ce mois"
              value={stats.users.newThisMonth}
              icon={UserPlus}
              description="Nouveaux utilisateurs ce mois"
              iconClassName="text-green-600"
            />
          )}
        </AdminOnly>

        <MIAOnly hideIfNoAccess>
          {stats.users.newThisMonth !== null && (
            <StatsCard
              title="Nouveaux ce mois"
              value={stats.users.newThisMonth}
              icon={UserPlus}
              description="Nouveaux utilisateurs ce mois"
              iconClassName="text-green-600"
            />
          )}
        </MIAOnly>

        {/* Statistiques contacts - visible pour tous */}
        <StatsCard
          title="Total Contacts"
          value={stats.contacts.total}
          icon={Contact}
          description={`${stats.contacts.newThisMonth} nouveaux ce mois`}
          iconClassName="text-purple-600"
        />

        {/* Statistiques messages */}
        <StatsCard
          title="Messages"
          value={stats.messages.total}
          icon={Mail}
          description={`${stats.messages.unread} non lus`}
          iconClassName="text-orange-600"
        />

        {/* Statistiques notifications */}
        <StatsCard
          title="Notifications"
          value={stats.notifications.total}
          icon={Bell}
          description={`${stats.notifications.unread} non lues`}
          iconClassName="text-red-600"
        />

        {/* Statistiques partages */}
        <StatsCard
          title="Partages"
          value={stats.shares.total}
          icon={Share2}
          description={`${stats.shares.thisMonth} ce mois`}
          iconClassName="text-cyan-600"
        />
      </div>

      {/* Graphiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Activité récente - prend 2 colonnes */}
        <RecentActivity data={stats.messages.recentActivity} />

        {/* Contacts par catégorie */}
        <CategoryChart data={stats.contacts.byCategory} />
      </div>

      {/* Partages par plateforme */}
      <div className="grid gap-4 md:grid-cols-1">
        <PlatformChart data={stats.shares.byPlatform} />
      </div>
    </div>
  )
}

