import { useMemo } from "react";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";
import { DataTransformFunction } from "@/components/data-table/utils/export-utils";
import { formatTimestampToReadable } from "@/utils/format";
import type { PaymentData } from "../schema";

/**
 * Export configuration for the payments data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "Payment ID",
      payerName: "Payer Name",
      payerId: "Payer ID",
      modelName: "Model Name",
      modelUsername: "Model Username",
      amount: "Amount",
      status: "Status",
      contestName: "Contest Name",
      voteCount: "Vote Count",
      comment: "Comment",
      stripeSessionId: "Stripe Session ID",
      createdAt: "Payment Date",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 15 }, // Payment ID
      { wch: 20 }, // Payer Name
      { wch: 15 }, // Payer ID
      { wch: 20 }, // Model Name
      { wch: 15 }, // Model Username
      { wch: 12 }, // Amount
      { wch: 12 }, // Status
      { wch: 25 }, // Contest Name
      { wch: 12 }, // Vote Count
      { wch: 30 }, // Comment
      { wch: 20 }, // Stripe Session ID
      { wch: 20 }, // Payment Date
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "payer Name",
      "payer Id",
      "model Name",
      "model Username",
      "amount",
      "status",
      "contest Name",
      "vote Count",
      "comment",
      "stripe Session Id",
      "created At",
    ];
  }, []);

  // Case formatting configuration
  const caseConfig: CaseFormatConfig = useMemo(() => ({
    urlFormat: 'camelCase',
    apiFormat: 'camelCase',
  }), []);

  // Transformation function for export data
  const transformFunction: DataTransformFunction<PaymentData> = useMemo(() => (row: PaymentData) => {
    return {
      id: row.id,
      "payer Name": row.payer.user.name || "Unknown",
      "payer Id": row.payer.id,
      "model Name": row.model.user.name || "Unknown",
      "model Username": row.model.user.username || "",
      amount: `$${row.amount.toFixed(2)}`,
      status: row.status,
      "contest Name": row.contest?.name || "No contest",
      "vote Count": row.voteCount || 0,
      "comment": row.comment || "",
      "stripe Session Id": row.stripeSessionId,
      "created At": formatTimestampToReadable(row.createdAt),
    };
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "payments",
    caseConfig,
    transformFunction
  };
}
