import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createSWRQueryClient } from "@/lib/swr-config";

export function getContext() {
  const queryClient = createSWRQueryClient();
  return {
    queryClient,
  };
}

export function Provider({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
