import { createFileRoute } from '@tanstack/react-router'
import CompetitionDetails from '@/pages/CompetitionDetails'

export const Route = createFileRoute('/competition/$id')({
  component: CompetitionDetails,
})

