import { PaymentFailure } from "@/pages/voters";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/payments/failure")({
  component: PaymentFailure,
});
