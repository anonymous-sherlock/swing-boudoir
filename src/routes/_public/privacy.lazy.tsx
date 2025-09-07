import { PrivacyPolicy } from "@/pages/PrivacyPolicy";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_public/privacy")({
  component: PrivacyPolicy,
});
