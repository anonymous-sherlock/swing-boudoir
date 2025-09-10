import { QueryClient } from '@tanstack/react-query';

/**
 * Global SWR configuration for the application
 * This provides consistent stale-while-revalidate behavior across all queries
 */
export const createSWRQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default stale time - data stays fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        
        // Default garbage collection time - cache retained for 10 minutes
        gcTime: 10 * 60 * 1000,
        
        // Refetch behavior
        refetchOnWindowFocus: true, // Refetch when user returns to tab
        refetchOnMount: true, // Always refetch on mount for fresh data
        refetchOnReconnect: true, // Refetch when network reconnects
        
        // Retry configuration
        retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof Error && 'status' in error) {
          const status = (error as { status: number }).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
};

/**
 * SWR configuration presets for different types of data
 */
export const swrPresets = {
  // For contest data - changes infrequently
  contest: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  },
  
  // For participants data - changes more frequently
  participants: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  },
  
  // For user profiles - changes moderately
  profile: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 8 * 60 * 1000, // 8 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  },
  
  // For real-time data - changes very frequently
  realtime: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    refetchIntervalInBackground: false,
  },
  
  // For static data - rarely changes
  static: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  },
} as const;

/**
 * Helper function to get SWR configuration for a specific data type
 */
export function getSWRConfig(type: keyof typeof swrPresets) {
  return swrPresets[type];
}

/**
 * Helper function to create a custom SWR configuration
 */
export function createCustomSWRConfig(overrides: Partial<typeof swrPresets.contest>) {
  return {
    ...swrPresets.contest,
    ...overrides,
  };
}
