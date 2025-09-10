import { createFileRoute, redirect } from "@tanstack/react-router";
import Leaderboard from "@/pages/Leaderboard";
import { authApi } from "@/lib/api";
import { GetSessionResponse } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const Route = createFileRoute("/_public/leaderboard/")({
  component: () => (
    <ProtectedRoute>
      <Leaderboard />
    </ProtectedRoute>
  ),
  loader: async () => {
    const response = await authApi.getSession<GetSessionResponse>();
    if (!response.success) return;

    if (!response.data?.user) {
      return redirect({ to: "/auth/$id", params: { id: "sign-in" }, search: { callback: "/leaderboard" } });
    }
    return;
  },
});
