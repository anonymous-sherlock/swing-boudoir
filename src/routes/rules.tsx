import { createFileRoute } from '@tanstack/react-router'
import Rules from '@/pages/Rules'

export const Route = createFileRoute('/rules')({
  component: Rules,
})
