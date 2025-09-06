// ** Import Date Table
import { DataTable } from "@/components/data-table/data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

// ** Import API
import { useRanksData, fetchRanks } from "./utils/data-fetching";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

// ** Import Types
import { RankData } from "./schema";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";

// ** Import Auth Context
import { useAuth } from "@/contexts/AuthContext";
import { useCallback, useMemo } from "react";

/**
 * RanksTable Component
 *
 * A data table component for managing model rankings in the admin panel.
 * This table displays all model rankings with filtering, sorting, and export capabilities.
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

export default function RanksTable() {
  const { user } = useAuth();

  // Create a wrapper function that includes the current user ID
  const getColumnsWithUser = useCallback((handleRowDeselection: ((rowId: string) => void) | null | undefined) => {
    return getColumns(handleRowDeselection, user?.id);
  }, [user?.id]);

  // Create a custom hook function for ranks data
  const useFilteredRanksData = (
    page: number,
    pageSize: number,
    search: string,
    dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string,
    caseConfig?: CaseFormatConfig
  ) => {
    return useRanksData(page, pageSize, search, sortBy, sortOrder, caseConfig);
  };

  // Set the isQueryHook property so DataTable knows this is a React Query hook
  useFilteredRanksData.isQueryHook = true;

  // Memoize the fetchAllData function to prevent recreation
  const fetchAllData = useCallback(async (params: {
    search: string;
    sort_by: string;
    sort_order: string;
  }) => {
    try {
      const allRanks: RankData[] = [];
      const chunkSize = 100; // Fetch 100 ranks at a time
      let currentPage = 1;
      let hasMoreData = true;
      
      // Fetch data in chunks until we have all ranks
      while (hasMoreData) {
        const result = await fetchRanks({
          page: currentPage,
          limit: chunkSize,
          search: params.search,
          sortBy: params.sort_by,
          sortOrder: params.sort_order,
        });
        
        if (result.data && result.data.length > 0) {
          allRanks.push(...result.data);
          
          // Use the API's hasNextPage property for cleaner logic
          if (result.pagination?.hasNextPage) {
            currentPage++;
          } else {
            hasMoreData = false;
          }
        } else {
          hasMoreData = false;
        }
      }
      
      return allRanks;
    } catch (error) {
      console.error("Error fetching all ranks for export:", error);
      throw new Error("Failed to fetch all ranks for export");
    }
  }, []);

  // Get export config
  const exportConfig = useExportConfig();

  return (
    <DataTable<RankData, unknown>
      getColumns={getColumnsWithUser}
      exportConfig={exportConfig}
      fetchDataFn={useFilteredRanksData}
      fetchAllDataFn={fetchAllData}
      idField="id"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({ selectedRows, allSelectedIds, totalSelectedCount, resetSelection }) => (
        <ToolbarOptions
          selectedRanks={selectedRows.map((row) => ({
            id: row.id,
            modelName: row.profile.name,
            username: row.profile.username,
          }))}
          allSelectedRankIds={allSelectedIds.map((id) => String(id))}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: false,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true, // Disable search since API doesn't support it
        enableDateFilter: false, // Disable date filter since API doesn't support it
        enableColumnVisibility: true,
        enableUrlState: true,
        size: "xs",
        columnResizingTableId: "ranks-list-table",
        searchPlaceholder: "Search models",
        enableExport: true,
      }}
    />
  );
}
