// ** Import Date Table
import { DataTable } from "@/components/data-table/data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

// ** Import API
import { useVotesData, fetchVotes } from "./utils/data-fetching";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

// ** Import Types
import { VoteData } from "./schema";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";

// ** Import Auth Context
import { useAuth } from "@/contexts/AuthContext";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

/**
 * VotesTable Component
 *
 * A data table component for managing votes in the admin panel.
 * This table displays all votes with filtering, sorting, and export capabilities.
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

type VoteFilterType = "all" | "FREE" | "PAID";

export default function VotesTable() {
  const { user } = useAuth();
  const [type, setType] = useQueryState<VoteFilterType>("type", parseAsStringLiteral(["all", "FREE", "PAID"]).withDefault("all"));

  // Create a wrapper function that includes the current user ID
  const getColumnsWithUser = useCallback((handleRowDeselection: ((rowId: string) => void) | null | undefined) => {
    return getColumns(handleRowDeselection, user?.id);
  }, [user?.id]);

  // Create a custom hook function that handles vote type filtering
  const useFilteredVotesData = (
    page: number,
    pageSize: number,
    search: string,
    dateRange: { from_date: string; to_date: string },
    sortBy: string,
    sortOrder: string,
    caseConfig?: CaseFormatConfig
  ) => {
    // Only pass the type filter if it's not "all"
    const typeFilter = type === "all" ? "" : type;
    return useVotesData(page, pageSize, search, dateRange, sortBy, sortOrder, caseConfig, typeFilter);
  };

  // Set the isQueryHook property so DataTable knows this is a React Query hook
  useFilteredVotesData.isQueryHook = true;

  // Memoize the fetchAllData function to prevent recreation
  const fetchAllData = useCallback(async (params: {
    search: string;
    from_date: string;
    to_date: string;
    sort_by: string;
    sort_order: string;
  }) => {
    try {
      const allVotes: VoteData[] = [];
      const chunkSize = 100; // Fetch 100 votes at a time
      let currentPage = 1;
      let hasMoreData = true;
      
      // Fetch data in chunks until we have all votes
      while (hasMoreData) {
        const result = await fetchVotes({
          page: currentPage,
          limit: chunkSize,
          search: params.search,
          fromDate: params.from_date,
          toDate: params.to_date,
          sortBy: params.sort_by,
          sortOrder: params.sort_order,
          type: type === "all" ? "" : type // include current type filter
        });
        
        if (result.data && result.data.length > 0) {
          allVotes.push(...result.data);
          
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
      
      return allVotes;
    } catch (error) {
      console.error("Error fetching all votes for export:", error);
      throw new Error("Failed to fetch all votes for export");
    }
  }, [type]);

  // Get export config
  const exportConfig = useExportConfig();

  return (
    <DataTable<VoteData, unknown>
      getColumns={getColumnsWithUser}
      exportConfig={exportConfig}
      fetchDataFn={useFilteredVotesData}
      fetchAllDataFn={fetchAllData}
      idField="id"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({ selectedRows, allSelectedIds, totalSelectedCount, resetSelection }) => (
        <ToolbarOptions
          selectedVotes={selectedRows.map((row) => ({
            id: row.id,
            voterName: row.voter.name,
            voteeName: row.votee.name,
          }))}
          allSelectedVoteIds={allSelectedIds.map((id) => String(id))}
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
        columnResizingTableId: "votes-list-table",
        searchPlaceholder: "Search votes",
        enableExport: true,
      }}
    />
  );
}
