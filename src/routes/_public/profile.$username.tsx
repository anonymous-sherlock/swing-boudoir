import { createFileRoute } from '@tanstack/react-router'
import PublicProfilePage from '@/pages/PublicProfilePage'
import NotFound from '@/pages/NotFound'

export const Route = createFileRoute('/_public/profile/$username')({
  component: PublicProfilePage,
  errorComponent: NotFound,
})
