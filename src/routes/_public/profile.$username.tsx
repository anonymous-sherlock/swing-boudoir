import { createFileRoute } from '@tanstack/react-router'
import PublicProfilePage from '@/pages/PublicProfilePage'

export const Route = createFileRoute('/_public/profile/$username')({
  component: PublicProfilePage,
})
