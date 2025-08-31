import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'


const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: false,
  defaultStructuralSharing: false,
  defaultPreloadStaleTime: 0,
  defaultPreloadDelay: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
