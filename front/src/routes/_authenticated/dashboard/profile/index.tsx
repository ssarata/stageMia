import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/components/privates/profile/ProfilePage'

export const Route = createFileRoute('/_authenticated/dashboard/profile/')({
  component: ProfilePage,
})
