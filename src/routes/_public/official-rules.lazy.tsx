import { createLazyFileRoute } from "@tanstack/react-router";
import { OfficialRules } from "../../pages/OfficialRules";

export const Route = createLazyFileRoute("/_public/official-rules")({
  component: OfficialRules,
});
