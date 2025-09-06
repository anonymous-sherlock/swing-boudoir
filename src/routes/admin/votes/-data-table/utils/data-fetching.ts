import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ** Import Utils
import { preprocessSearch } from "@/components/data-table/utils";
import { CaseFormatConfig, DEFAULT_CASE_CONFIG } from "@/components/data-table/utils/case-utils";

// ** Import API
// Define the fetch function locally since it doesn't exist in the API module
export async function fetchVotes(params: {
    page: number;
    limit: number;
    search: string;
    fromDate: string;
    toDate: string;
    sortBy: string;
    sortOrder: string;
    type: string;
    contestId?: string | null;
}) {

    // Create search params, only include type if it's not empty
    const searchParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        search: params.search,
        startDate: params.fromDate,
        endDate: params.toDate,
        sortBy: params.sortBy, // Pass sortBy directly like users table
        sortOrder: params.sortOrder,
    });

    // Only add type parameter if it's not empty
    if (params.type) {
        searchParams.append('type', params.type);
    }

    if (params.contestId) {
        searchParams.append('contestId', params.contestId);
    }

    console.log('🌐 API Request URL:', `/api/v1/admin/votes?${searchParams.toString()}`);

    const response = await api.get(`/api/v1/admin/votes?${searchParams}`);

    if (!response.success) {
        throw new Error('Failed to fetch votes');
    }

    // Debug: Check if the response data is actually sorted
    // console.log('📊 API Response Debug:', {
    //     totalVotes: response.data.data?.length || 0,
    //     firstFewVotes: response.data.data?.slice(0, 3).map(vote => ({
    //         id: vote.id,
    //         count: vote.count,
    //         createdAt: vote.createdAt
    //     })) || [],
    //     sortBy: params.sortBy,
    //     sortOrder: params.sortOrder,
    //     pagination: response.data.pagination
    // });

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
            // Include the original pagination properties for export
            hasNextPage: response.data.pagination?.hasNextPage || false,
            hasPreviousPage: response.data.pagination?.hasPreviousPage || false,
            nextPage: response.data.pagination?.nextPage || null,
            previousPage: response.data.pagination?.previousPage || null,
        }
    };
}

/**
 * Hook to fetch votes with camelCase format
 */
export function useVotesData(
    page: number,
    pageSize: number,
    search: string,
    dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string,
    caseConfig: CaseFormatConfig = DEFAULT_CASE_CONFIG,
    type: "all" | "FREE" | "PAID" | "",
    contestId?: string | null,
) {
    // Debug logging for the hook
    // console.log('🎣 useVotesData Hook Debug:', {
    //     page,
    //     pageSize,
    //     search,
    //     dateRange,
    //     sortBy,
    //     sortOrder,
    //     type
    // });

    return useQuery({
        queryKey: [
            "votes-admin-list",
            page,
            pageSize,
            preprocessSearch(search),
            dateRange,
            sortBy,
            sortOrder,
            caseConfig,
            type,
            contestId,
        ],
        queryFn: async () => {
            const result = await fetchVotes({
                page,
                limit: pageSize,
                search: preprocessSearch(search),
                fromDate: dateRange.from_date,
                toDate: dateRange.to_date,
                sortBy: sortBy,
                sortOrder: sortOrder,
                type: type,
                contestId: contestId,
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
useVotesData.isQueryHook = true;
