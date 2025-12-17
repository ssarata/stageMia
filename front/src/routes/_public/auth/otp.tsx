import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/auth/otp')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_public/auth/otp"!</div>
}
