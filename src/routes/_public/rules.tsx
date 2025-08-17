import Rules from '@/pages/Rules'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/rules')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Rules />
}
