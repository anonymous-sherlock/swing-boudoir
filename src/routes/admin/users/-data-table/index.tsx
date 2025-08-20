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

// ** Import Auth Context
import { useAuth } from "@/contexts/AuthContext";

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
export default function UserTable() {
  const { user } = useAuth();

  // Create a wrapper function that includes the current user ID
  const getColumnsWithUser = (handleRowDeselection: ((rowId: string) => void) | null | undefined) => {
    return getColumns(handleRowDeselection, user?.id);
  };

  return (
    <DataTable<UserCamelCase, unknown>
      getColumns={getColumnsWithUser}
      exportConfig={useExportConfig()}
      fetchDataFn={useUsersCamelCaseData}
      idField="id"
      pageSizeOptions={[10,30, 20, 30, 40, 50, 100, 150]}
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
        columnResizingTableId: "user-camel-case-table",
        searchPlaceholder: "Search users",
        
      }}

    />
  );
}
