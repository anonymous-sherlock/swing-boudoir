import { useQuery, keepPreviousData } from "@tanstack/react-query";

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
}) {
  // TODO: Implement actual API call
  // This is a placeholder - replace with your actual API endpoint
  const response = await fetch(`http://localhost:9999/api/v1/search/users?${new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search,
    from_date: params.fromDate,
    to_date: params.toDate,
    sort_by: params.sortBy,
    sort_order: params.sortOrder,
  })}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
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
  caseConfig: CaseFormatConfig = DEFAULT_CASE_CONFIG
) {
  return useQuery({
    queryKey: [
      "users-camel-case",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
      caseConfig,
    ],
    queryFn: () =>
      fetchUsersCamelCase({
        page,
        limit: pageSize,
        search: preprocessSearch(search),
        fromDate: dateRange.from_date,
        toDate: dateRange.to_date,
        sortBy: sortBy,
        sortOrder: sortOrder,
      }),
    placeholderData: keepPreviousData,
  });
}

// Add a property to the function so we can use it with the DataTable component
useUsersCamelCaseData.isQueryHook = true;