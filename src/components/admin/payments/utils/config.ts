import { useMemo } from "react";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";
import { DataTransformFunction } from "@/components/data-table/utils/export-utils";
import { formatTimestampToReadable, formatCurrency } from "@/utils/format";
import type { PaymentCamelCase } from "../schema";

/**
 * Export configuration for the camelCase payments data table
 */
export function useExportConfig() {
  // Column mapping for export (camelCase version)
  const columnMapping = useMemo(() => {
    return {
      id: "Payment ID",
      "payer.user.name": "Payer",
      amount: "Amount",
      status: "Status",
      votes: "Votes",
      createdAt: "Date",
    };
  }, []);
  
  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 15 }, // Payment ID
      { wch: 20 }, // Payer
      { wch: 12 }, // Amount
      { wch: 12 }, // Status
      { wch: 15 }, // Votes
      { wch: 20 }, // Date
    ];
  }, []);
  
  // Headers for CSV export (camelCase version)
  const headers = useMemo(() => {
    return [
      "Payment ID",
      "Payer",
      "Amount",
      "Status", 
      "Votes",
      "Date",
    ];
  }, []);

  // Case formatting configuration for camelCase table
  const caseConfig: CaseFormatConfig = useMemo(() => ({
    urlFormat: 'camelCase', // URL parameters use camelCase
    apiFormat: 'camelCase', // API parameters also use camelCase
  }), []);

  // Example transformation function showcasing different formatting options
  const transformFunction: DataTransformFunction<PaymentCamelCase> = useMemo(() => (row: PaymentCamelCase) => ({
    id: row.id,
    amount: formatCurrency(row.amount),
    status: row.status,
    stripeSessionId: row.stripeSessionId,
    createdAt: formatTimestampToReadable(row.createdAt),
    payerName: row.payer.user.name,
    totalVotes: row.votes.length,
    paidVotes: row.votes.filter(v => v.type === "PAID").length,
    contests: [...new Set(row.votes.map(v => v.contest.name))].join(", "),
  }), []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "payments-camel-case",
    caseConfig,
    transformFunction
  };
}
