import { TermsOfService } from "@/pages/TermsOfService";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_public/terms-of-services")({
  component: TermsOfService,
});
