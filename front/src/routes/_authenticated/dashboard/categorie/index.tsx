import ListeCategories from '@/components/privates/categorie/ListeCategories'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/categorie/')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <ListeCategories />
}
