import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ModelOnlyProtected } from "@/components/ModelOnlyProtected";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <ProtectedRoute>
      <ModelOnlyProtected>
        <Outlet />
      </ModelOnlyProtected>
    </ProtectedRoute>
  );
}
