import { api } from "@/lib/api";
import { CompetitionDetails } from "@/components/competitions/CompetitionDetails";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/competitions/$slug")({
  component: CompetitionDetails,
  loader: async ({ params }) => {
    const response = await api.get(`/api/v1/contest/slug/${params.slug}`);
    return response.data;
  },
});


