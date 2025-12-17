// src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import NotFound from './components/errors/404'

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultNotFoundComponent: () => (
    <NotFound />
  ),
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}