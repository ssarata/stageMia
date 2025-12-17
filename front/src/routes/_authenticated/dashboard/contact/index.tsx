import ListeContact from '@/components/privates/contact/ListeContact'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/contact/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ListeContact />
}
