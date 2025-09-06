import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ** Import Utils
import { preprocessSearch } from "@/components/data-table/utils";
import { CaseFormatConfig, DEFAULT_CASE_CONFIG } from "@/components/data-table/utils/case-utils";

// ** Import API
// Define the fetch function locally since it doesn't exist in the API module
export async function fetchRanks(params: {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: string;
}) {

    // Create search params
    const searchParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        search: params.search,
    });

    console.log('🌐 API Request URL:', `/api/v1/ranks?${searchParams.toString()}`);

    const response = await api.get(`/api/v1/ranks?${searchParams}`);

    if (!response.success) {
        throw new Error('Failed to fetch ranks');
    }

    // Return the data in the format expected by DataTable
    return {
        success: true,
        data: response.data.data || [],
        pagination: {
            page: params.page,
            limit: params.limit,
            totalPages: response.data.pagination?.totalPages || 1,
            total: response.data.pagination?.total || 0,
            hasNextPage: response.data.pagination?.hasNextPage || false,
            hasPreviousPage: response.data.pagination?.hasPreviousPage || false,
            nextPage: response.data.pagination?.nextPage || null,
            previousPage: response.data.pagination?.previousPage || null,
        }
    };
}

/**
 * Hook to fetch ranks with camelCase format
 */
export function useRanksData(
    page: number,
    pageSize: number,
    search: string,
    sortBy: string,
    sortOrder: string,
    caseConfig: CaseFormatConfig = DEFAULT_CASE_CONFIG,
) {
    return useQuery({
        queryKey: [
            "model-ranks",
            { page, limit: pageSize },
            preprocessSearch(search),
            sortBy,
            sortOrder,
            caseConfig,
        ],
        queryFn: async () => {
            const result = await fetchRanks({
                page,
                limit: pageSize,
                search: preprocessSearch(search),
                sortBy: sortBy,
                sortOrder: sortOrder,
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
useRanksData.isQueryHook = true;
