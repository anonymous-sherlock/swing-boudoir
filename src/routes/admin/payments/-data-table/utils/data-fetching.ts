import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ** Import Utils
import { preprocessSearch } from "@/components/data-table/utils";
import { CaseFormatConfig, DEFAULT_CASE_CONFIG } from "@/components/data-table/utils/case-utils";

// ** Import API
// Define the fetch function locally since it doesn't exist in the API module
export async function fetchPayments(params: {
    page: number;
    limit: number;
    search: string;
    fromDate: string;
    toDate: string;
    sortBy: string;
    sortOrder: string;
    status: string;
}) {

    // Create search params, only include status if it's not empty
    const searchParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        search: params.search,
        fromDate: params.fromDate,
        toDate: params.toDate,
        sortBy: params.sortBy,
        sortOrder: params.sortOrder,
    });

    // Always add status parameter (including "all")
    searchParams.append('status', params.status);

    console.log('🌐 API Request URL:', `/api/v1/payments?${searchParams.toString()}`);

    const response = await api.get(`/api/v1/payments?${searchParams}`);

    if (!response.success) {
        throw new Error('Failed to fetch payments');
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
            // Include the original pagination properties for export
            hasNextPage: response.data.pagination?.hasNextPage || false,
            hasPreviousPage: response.data.pagination?.hasPreviousPage || false,
            nextPage: response.data.pagination?.nextPage || null,
            previousPage: response.data.pagination?.previousPage || null,
        }
    };
}

/**
 * Hook to fetch payments with camelCase format
 */
export function usePaymentsData(
    page: number,
    pageSize: number,
    search: string,
    dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string,
    caseConfig: CaseFormatConfig = DEFAULT_CASE_CONFIG,
    status: "all" | "COMPLETED" | "PENDING" | "FAILED" | "",
) {
    // Debug logging for the hook
    // console.log('🎣 usePaymentsData Hook Debug:', {
    //     page,
    //     pageSize,
    //     search,
    //     dateRange,
    //     sortBy,
    //     sortOrder,
    //     status
    // });

    return useQuery({
        queryKey: [
            "payments-admin-list",
            page,
            pageSize,
            preprocessSearch(search),
            dateRange,
            sortBy,
            sortOrder,
            caseConfig,
            status,
        ],
        queryFn: async () => {
            const result = await fetchPayments({
                page,
                limit: pageSize,
                search: preprocessSearch(search),
                fromDate: dateRange.from_date,
                toDate: dateRange.to_date,
                sortBy: sortBy,
                sortOrder: sortOrder,
                status: status,
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
usePaymentsData.isQueryHook = true;
