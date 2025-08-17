import { PageLoader } from "@/components/PageLoader";
import CompetitionsList from "@/components/competitions";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/competitions/")({
  pendingComponent: () => <PageLoader title="Loading competitions..." description="Please wait while we get your information from the web" />,
  component: CompetitionsList,
});
