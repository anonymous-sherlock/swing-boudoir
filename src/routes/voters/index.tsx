import { VoterDashboard } from '@/pages/voters'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/voters/')({
  component: VoterDashboard,
})
