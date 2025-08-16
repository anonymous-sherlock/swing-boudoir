import { PaymentSuccess } from "@/pages/voters";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/payments/success")({
  component: PaymentSuccess,
  pendingComponent: () => (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
        <p className="text-gray-600">Verifying your payment...</p>
      </div>
    </div>
  ),
});
