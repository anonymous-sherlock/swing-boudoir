import { createFileRoute } from '@tanstack/react-router'
import { PaymentsTable } from '@/components/admin/payments/PaymentsTable'

export const Route = createFileRoute('/admin/payments')({
  component: PaymentsPage,
})

function PaymentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-600 mt-2">
          Manage and view all payment transactions in the system.
        </p>
      </div>
      
      <PaymentsTable />
    </div>
  )
}
