import { TermsOfService } from '@/pages/voters/TermsOfService'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/terms-of-services')({
  component: TermsOfService,
})
