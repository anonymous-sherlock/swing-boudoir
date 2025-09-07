import { createLazyFileRoute } from '@tanstack/react-router'
import { PaymentsTable } from '@/components/admin/payments/PaymentsTable'

export const Route = createLazyFileRoute('/admin/payments')({
  component: PaymentsPage,
})

function PaymentsPage() {
  return (
    <div className="min-w-0 overflow-x-auto">
      <div className="mb-8 min-w-0">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">
          Manage and view all payment transactions in the system.
        </p>
      </div>
      
      <div className="min-w-0 overflow-x-auto">
        <PaymentsTable />
      </div>
    </div>
  )
}
