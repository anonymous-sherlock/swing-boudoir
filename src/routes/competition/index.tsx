import { createFileRoute } from '@tanstack/react-router'
import { CompetitionsPage } from '@/pages/Competitions'
import CompetitionDetails from '@/pages/CompetitionDetails'

export const Route = createFileRoute('/competition/')({
  component: CompetitionsPage,
})
