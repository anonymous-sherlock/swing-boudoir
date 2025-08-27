import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ** Import API
// Define the fetch function locally since it doesn't exist in the API module
async function fetchUsersCamelCase(params: {
  page: number;
  limit: number;
  search: string;
  fromDate: string;
  toDate: string;
  sortBy: string;
  sortOrder: string;
  type: string;
}) {
  // TODO: Implement actual API call
  // This is a placeholder - replace with your actual API endpoint
  
  // Create search params, only include type if it's not empty
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search,
    fromDate: params.fromDate,
    toDate: params.toDate,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
  
  // Only add type parameter if it's not empty
  if (params.type) {
    searchParams.append('type', params.type);
  }

  const response = await api.get(`/api/v1/search/users?${searchParams}`);

  if (!response.success) {
    throw new Error('Failed to fetch users');
  }

  // Return the data in the format expected by DataTable
  // The API should return data with pagination info
  return {
    success: true,
    data: response.data.data || [],
    pagination: {
      page: params.page,
      limit: params.limit,
      total_pages: response.data.pagination?.totalPages || 1,
      total_items: response.data.pagination?.total || 0,
    }
  };
}

// ** Import Utils
import { preprocessSearch } from "@/components/data-table/utils";
import { CaseFormatConfig, DEFAULT_CASE_CONFIG } from "@/components/data-table/utils/case-utils";

/**
 * Hook to fetch users with camelCase format
 */
export function useUsersCamelCaseData(
  page: number,
  pageSize: number,
  search: string,
  dateRange: { from_date: string; to_date: string },
  sortBy: string,
  sortOrder: string,
  caseConfig: CaseFormatConfig = DEFAULT_CASE_CONFIG,
  type: "all" | "model" | "voter" | "",
) {
  return useQuery({
    queryKey: [
      "users-admin-list",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
      caseConfig,
      type,
    ],
    queryFn: async () => {
      const result = await fetchUsersCamelCase({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        fromDate: dateRange.from_date,
        toDate: dateRange.to_date,
        sortBy: sortBy,
        sortOrder: sortOrder,
        type: type
      });
      
      // Return in the format expected by DataTable
      return {
        data: result.data,
        pagination: result.pagination
      };
    },
    placeholderData: keepPreviousData,
  });
}

// Add a property to the function so we can use it with the DataTable component
useUsersCamelCaseData.isQueryHook = true;