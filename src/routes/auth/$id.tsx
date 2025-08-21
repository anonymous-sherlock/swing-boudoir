import { createFileRoute } from "@tanstack/react-router";
import Auth from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

// Define valid auth route IDs
type AuthRouteId = "sign-in" | "sign-up";

// Define search parameters
interface AuthSearchParams {
  callback?: string;
}

export const Route = createFileRoute("/auth/$id")({
  component: AuthPage,
  errorComponent: NotFound,
  notFoundComponent: NotFound,
  validateSearch: (search: Record<string, unknown>): AuthSearchParams => {
    return {
      callback: typeof search.callback === "string" ? search.callback : undefined,
    };
  },
  params: {
    parse: (params) => {
      if (params.id !== "sign-in" && params.id !== "sign-up") {
        throw new Error(`Invalid auth route: ${params.id}`);
      }
      return { id: params.id as AuthRouteId };
    },
  },
  beforeLoad: ({ params }) => {
    // Type-safe validation
    const validIds: AuthRouteId[] = ["sign-in", "sign-up"];
    if (!validIds.includes(params.id as AuthRouteId)) {
      throw new Error(`Invalid auth route. Must be one of: ${validIds.join(", ")}`);
    }
  },
});

function AuthPage() {
  return <Auth />;
}
