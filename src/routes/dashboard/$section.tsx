import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/pages/Dashboard";

export const dashboardSections = [
  "notifications",
  "edit-profile",
  "public-profile",
  "competitions",
  "votes",
  "prize-history",
  "leaderboard",
  "settings",
  "support",
  "official-rules",
  "privacy",
] as const;

export type DashboardSection = (typeof dashboardSections)[number];

export const Route = createFileRoute("/dashboard/$section")({
  params: {
    parse: (params) => {
      const section =
        (params.section as DashboardSection) ?? "notifications";

      if (!dashboardSections.includes(section)) {
        throw new Error(`Invalid dashboard route: ${params.section}`);
      }

      return { section } as const;
    },
  },
  component: Dashboard,
});

