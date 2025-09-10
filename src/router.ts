import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider'
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import NotFound from './pages/NotFound';

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
export const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: false, // Enable structural sharing to prevent unnecessary re-renders
  defaultPreloadStaleTime: 0, // 1 seconds - cache preloaded data longer
  defaultPreloadDelay: 100,
  defaultNotFoundComponent: () => NotFound
})

NProgress.configure({
  showSpinner: false,
});

router.subscribe("onBeforeLoad", () => {
  NProgress.start();
});

router.subscribe('onBeforeLoad', ({ pathChanged }) => pathChanged && NProgress.start())
router.subscribe('onLoad', () => NProgress.done())



declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
