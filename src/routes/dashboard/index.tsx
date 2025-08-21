// /routes/dashboard/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";
import { ModelOnlyProtected } from "@/components/ModelOnlyProtected";

export const Route = createFileRoute("/dashboard/")({
  component: () => (
    <ModelOnlyProtected>
      <Dashboard />
    </ModelOnlyProtected>
  ),
});
