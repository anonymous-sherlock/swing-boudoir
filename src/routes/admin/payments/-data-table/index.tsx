// ** Import Date Table
import { DataTable } from "@/components/data-table/data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

// ** Import API
import { fetchPayments, usePaymentsData } from "./utils/data-fetching";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

// ** Import Types
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";
import { PaymentData } from "./schema";

// ** Import Auth Context
import { useAuth } from "@/contexts/AuthContext";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useCallback } from "react";

/**
 * PaymentsTable Component
 *
 * A data table component for managing payments in the admin panel.
 * This table displays all payments with filtering, sorting, and export capabilities.
 *
 * Features:
 * - Row selection with bulk operations
 * - Search and date filtering
 * - Column sorting and resizing
 * - Data export functionality
 * - URL state persistence
 *
 * @returns JSX.Element
 */

type PaymentFilterType = "all" | "COMPLETED" | "PENDING" | "FAILED";

export default function PaymentsTable() {
  const { user } = useAuth();
  const [status, setStatus] = useQueryState<PaymentFilterType>("status", parseAsStringLiteral(["all", "COMPLETED", "PENDING", "FAILED"]).withDefault("all"));

  // Create a wrapper function that includes the current user ID
  const getColumnsWithUser = useCallback(
    (handleRowDeselection: ((rowId: string) => void) | null | undefined) => {
      return getColumns(handleRowDeselection, user?.id);
    },
    [user?.id]
  );

  // Create a custom hook function that handles payment status filtering
  const useFilteredPaymentsData = (
    page: number,
    pageSize: number,
    search: string,
    dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string,
    caseConfig?: CaseFormatConfig,
  ) => {
    // Pass the status filter (including "all")
    return usePaymentsData(page, pageSize, search, dateRange, sortBy, sortOrder, caseConfig, status);
  };

  // Set the isQueryHook property so DataTable knows this is a React Query hook
  useFilteredPaymentsData.isQueryHook = true;

  // Memoize the fetchAllData function to prevent recreation
  const fetchAllData = useCallback(
    async (params: { search: string; from_date: string; to_date: string; sort_by: string; sort_order: string }) => {
      try {
        const allPayments: PaymentData[] = [];
        const chunkSize = 100; // Fetch 100 payments at a time
        let currentPage = 1;
        let hasMoreData = true;

        // Fetch data in chunks until we have all payments
        while (hasMoreData) {
          const result = await fetchPayments({
            page: currentPage,
            limit: chunkSize,
            search: params.search,
            fromDate: params.from_date,
            toDate: params.to_date,
            sortBy: params.sort_by,
            sortOrder: params.sort_order,
            status: status, // include current status filter
          });

          if (result.data && result.data.length > 0) {
            allPayments.push(...result.data);

            // Use the API's hasNextPage property for cleaner logic
            // This matches your API response structure: { hasNextPage: boolean }
            if (result.pagination?.hasNextPage) {
              currentPage++;
            } else {
              hasMoreData = false;
            }
          } else {
            hasMoreData = false;
          }
        }

        return allPayments;
      } catch (error) {
        console.error("Error fetching all payments for export:", error);
        throw new Error("Failed to fetch all payments for export");
      }
    },
    [status]
  );

  // Get export config
  const exportConfig = useExportConfig();

  return (
    <DataTable<PaymentData, unknown>
      getColumns={getColumnsWithUser}
      exportConfig={exportConfig}
      fetchDataFn={useFilteredPaymentsData}
      fetchAllDataFn={fetchAllData}
      idField="id"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({ selectedRows, allSelectedIds, totalSelectedCount, resetSelection }) => (
        <ToolbarOptions
          selectedPayments={selectedRows.map((row) => ({
            id: row.id,
            payerName: row.payer.user.name || "Unknown",
            amount: row.amount,
          }))}
          allSelectedPaymentIds={allSelectedIds.map((id) => String(id))}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: false,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableUrlState: true,
        size: "xs",
        columnResizingTableId: "payments-list-table",
        searchPlaceholder: "Search payments",
        enableExport: true,
      }}
    />
  );
}
