import { createLazyFileRoute } from '@tanstack/react-router'
import PublicProfilePage from '@/pages/PublicProfilePage'
import NotFound from '@/pages/NotFound'

export const Route = createLazyFileRoute('/_public/profile/$username')({
  component: PublicProfilePage,
  errorComponent: NotFound,
})
