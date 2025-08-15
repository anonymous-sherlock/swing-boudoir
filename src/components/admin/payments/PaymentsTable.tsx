"use client";

// ** Import Date Table
import { DataTable } from "@/components/data-table/data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

// ** Import API
import { usePaymentsCamelCaseData } from "./utils/data-fetching";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

// ** Import Types
import { PaymentCamelCase } from "./schema";

/**
 * PaymentCamelCaseTable Component
 * 
 * A data table component that demonstrates camelCase field support for payments.
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
export function PaymentsTable() {
  function fetchPaymentsByIds(ids: string[] | number[]): Promise<PaymentCamelCase[]> {
    throw new Error("Function not implemented.");
  }

  return (
    <DataTable<PaymentCamelCase , unknown>
      getColumns={getColumns}
      exportConfig={useExportConfig()}
      fetchDataFn={usePaymentsCamelCaseData}
      fetchByIdsFn={fetchPaymentsByIds}
      idField="id"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({ selectedRows, allSelectedIds, totalSelectedCount, resetSelection }) => (
        <ToolbarOptions
          selectedPayments={selectedRows.map(row => ({
            id: row.id,
            amount: row.amount,
          }))}
          allSelectedPaymentIds={allSelectedIds.map(id => String(id))}
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
        size: "default",
        columnResizingTableId: "payment-camel-case-table",
        searchPlaceholder: "Search payments"
      }}
    />
  );
}
