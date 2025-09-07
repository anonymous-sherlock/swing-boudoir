import { PageLoader } from "@/components/PageLoader";
import CompetitionsList from "@/components/competitions";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_public/competitions/")({
  pendingComponent: () => <PageLoader title="Loading competitions..." description="Please wait while we get your information from the web" />,
  component: CompetitionsList,
});
