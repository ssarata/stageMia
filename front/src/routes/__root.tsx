import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { User } from '../interfaces/interfaceTable'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

interface MyRouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
})