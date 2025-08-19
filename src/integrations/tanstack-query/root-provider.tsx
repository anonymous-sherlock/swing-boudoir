import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 3,
      },
    },
  });
  return {
    queryClient,
  };
}

export function Provider({ children, queryClient }: { children: React.ReactNode; queryClient: QueryClient }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
