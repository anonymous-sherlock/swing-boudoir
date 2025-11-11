import { RefundCancellationPolicyPage } from '@/pages/RefundCancellationPolicyPage'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_public/refund-and-cancellation')({
  component: RefundCancellationPolicyPage,
})
