// ** Import Date Table
import { DataTable } from "@/components/data-table/data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

// ** Import API
import { useUsersCamelCaseData } from "./utils/data-fetching";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

// ** Import Types
import { UserCamelCase } from "./schema";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";

// ** Import Auth Context
import { useAuth } from "@/contexts/AuthContext";
import { parseAsStringLiteral, useQueryState } from "nuqs";

/**
 * UserCamelCaseTable Component
 *
 * A data table component that demonstrates camelCase field support.
 * This table uses camelCase field names for both API requests and responses.
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

type UserFilterType = "all" | "model" | "voter";

export default function UserTable() {
  const { user } = useAuth();
  const [type, setType] = useQueryState<UserFilterType>("type", parseAsStringLiteral(["all", "model", "voter"]).withDefault("all"));

  // Create a wrapper function that includes the current user ID
  const getColumnsWithUser = (handleRowDeselection: ((rowId: string) => void) | null | undefined) => {
    return getColumns(handleRowDeselection, user?.id);
  };

  // Create a custom hook function that handles userType filtering
  const useFilteredUsersData = (
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
    return useUsersCamelCaseData(page, pageSize, search, dateRange, sortBy, sortOrder, caseConfig, typeFilter);
  };

  // Set the isQueryHook property so DataTable knows this is a React Query hook
  useFilteredUsersData.isQueryHook = true;

  return (
    <DataTable<UserCamelCase, unknown>
      getColumns={getColumnsWithUser}
      exportConfig={useExportConfig()}
      fetchDataFn={useFilteredUsersData}
      idField="id"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({ selectedRows, allSelectedIds, totalSelectedCount, resetSelection }) => (
        <ToolbarOptions
          selectedUsers={selectedRows.map((row) => ({
            id: row.id,
            name: row.name,
          }))}
          allSelectedUserIds={allSelectedIds.map((id) => String(id))}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: true,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableUrlState: true,
        size: "sm",
        columnResizingTableId: "user-list-table",
        searchPlaceholder: "Search users",
      }}
    />
  );
}
