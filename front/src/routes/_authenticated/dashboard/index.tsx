import { createFileRoute } from '@tanstack/react-router'
import { useGetDashboardStats } from '@/hooks/private/dashboardHook'
import StatsCard from '@/components/privates/dashboard/StatsCard'
import {
  Users,
  Contact,
  Folder,
  Loader2,
  Bell
} from 'lucide-react'

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
      <div className="grid gap-6 md:grid-cols-4">
        {/* Total Utilisateurs */}
        {stats.users.total !== null && (
          <StatsCard
            title="Total Utilisateurs"
            value={stats.users.total}
            icon={Users}
            description="Nombre total d'utilisateurs"
            iconClassName="text-blue-600"
          />
        )}

        {/* Total Contacts */}
        <StatsCard
          title="Total Contacts"
          value={stats.contacts.total}
          icon={Contact}
          description="Nombre total de contacts"
          iconClassName="text-purple-600"
        />

        {/* Total Catégories */}
        {stats.contacts.byCategory && (
          <StatsCard
            title="Total Catégories"
            value={stats.contacts.byCategory.length}
            icon={Folder}
            description="Nombre total de catégories"
            iconClassName="text-green-600"
          />
        )}

        {/* Notifications non lues */}
        <StatsCard
          title="Notifications non lues"
          value={stats.notifications.unread}
          icon={Bell}
          description="Notifications en attente"
          iconClassName="text-orange-600"
        />
      </div>
    </div>
  )
}

