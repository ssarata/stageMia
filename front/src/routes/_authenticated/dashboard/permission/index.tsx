import ListePermission from '@/components/privates/permission/ListePermission'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/permission/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ListePermission />
}
