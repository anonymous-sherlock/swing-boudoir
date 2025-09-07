import { CompetitionDetails } from "@/components/competitions/CompetitionDetails";
import NotFound from "@/components/global/NotFound";
import { PageLoader } from "@/components/PageLoader";
import { api } from "@/lib/api";
import { Contest } from "@/types/contest.types";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/_public/competitions/$slug/")({
  component: React.lazy(() => import("@/components/competitions/CompetitionDetails").then(module => ({ default: module.CompetitionDetails }))),
  pendingComponent: () => <PageLoader title="Loading competition..." description="Please wait while we get competition details from the web" />,
  loader: async ({ params }) => {
    const response = await api.get<Contest>(`/api/v1/contest/slug/${params.slug}`);
    if (!response.success) throw new Error("Competition not found");
    return response.data;
  },
  errorComponent: () => <NotFound title="Competition Not Found" description="The competition you're looking for doesn't exist or has been removed." />,
});
