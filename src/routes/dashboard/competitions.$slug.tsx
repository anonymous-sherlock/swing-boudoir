import CompetitionDetails from '@/pages/CompetitionDetails'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/competitions/$slug')({
  component: CompetitionDetails,
})

