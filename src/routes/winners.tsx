import { createFileRoute } from '@tanstack/react-router'
import Winners from '@/pages/Winners'

export const Route = createFileRoute('/winners')({
  component: Winners,
})
