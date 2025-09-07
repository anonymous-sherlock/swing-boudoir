import Rules from '@/pages/Rules'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_public/rules')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Rules />
}
