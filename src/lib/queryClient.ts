import { useQueryClient, QueryClient, QueryKey } from "@tanstack/react-query";

/**
 * Returns the react-query QueryClient instance.
 * Useful for advanced usage or for passing to context providers.
 */
export function useAppQueryClient(): QueryClient {
  return useQueryClient();
}

/**
 * Invalidates a query by key, with type safety.
 * @param key The query key to invalidate.
 */
export function useInvalidateQuery<T extends QueryKey = QueryKey>() {
  const queryClient = useQueryClient();
  return (key: T) => {
    return queryClient.invalidateQueries({ queryKey: key });
  };
}

/**
 * Example: usePredefinedQueryClient(["session"])
 * Returns a function to invalidate the "session" query, with auto typing.
 */
export function usePredefinedQueryClient<T extends QueryKey>(key: T) {
  const queryClient = useQueryClient();
  return {
    queryClient,
    invalidate: () => queryClient.invalidateQueries({ queryKey: key }),
  };
}
