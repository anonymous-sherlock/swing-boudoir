import { PageLoader } from "@/components/PageLoader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Onboarding from "@/components/story-onboarding";
import { authApi } from "@/lib/api";
import { GetSessionResponse } from "@/types/auth.types";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/")({
  component: () => (
    <ProtectedRoute>
      <Onboarding />
    </ProtectedRoute>
  ),
  pendingComponent: () => <PageLoader />,
  loader: async () => {
    const response = await authApi.getSession<GetSessionResponse>();
    if (!response.success) return;

    if (!response.data?.user) {
      return redirect({ to: "/auth/$id", params: { id: "sign-in" } });
    }
    if (response.data?.user.profileId) {
      return redirect({ to: "/dashboard" });
    }
    return;
  },
});
