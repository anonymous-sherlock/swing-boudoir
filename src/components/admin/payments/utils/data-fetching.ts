import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";

// ** Import Utils
import { preprocessSearch } from "@/components/data-table/utils";
import { CaseFormatConfig, DEFAULT_CASE_CONFIG } from "@/components/data-table/utils/case-utils";
import type { PaymentCamelCase } from "../schema";

/**
 * Hook to fetch payments with camelCase format
 */
export function usePaymentsCamelCaseData(
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
      "payments-camel-case",
      page,
      pageSize,
      preprocessSearch(search),
      dateRange,
      sortBy,
      sortOrder,
      caseConfig,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        search: preprocessSearch(search),
        from_date: dateRange.from_date,
        to_date: dateRange.to_date,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      const response = await api.get(`/api/v1/payments?${params}`);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch payments');
      }

      return response.data;
    },
    placeholderData: keepPreviousData,
  });
}

// Add a property to the function so we can use it with the DataTable component
usePaymentsCamelCaseData.isQueryHook = true;
