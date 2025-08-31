import { useMemo } from "react";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";
import { DataTransformFunction } from "@/components/data-table/utils/export-utils";
import { formatTimestampToReadable } from "@/utils/format";
import type { VoteData } from "../schema";

/**
 * Export configuration for the votes data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      voterName: "Voter Name",
      voterUsername: "Voter Username",
      voteeName: "Votee Name",
      voteeUsername: "Votee Username",
      contestName: "Contest Name",
      type: "Vote Type",
      count: "Vote Count",
      paymentAmount: "Payment Amount",
      paymentStatus: "Payment Status",
      comment: "Comment",
      createdAt: "Vote Date",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 20 }, // Voter Name
      { wch: 20 }, // Voter Username
      { wch: 20 }, // Votee Name
      { wch: 20 }, // Votee Username
      { wch: 25 }, // Contest Name
      { wch: 15 }, // Vote Type
      { wch: 12 }, // Vote Count
      { wch: 15 }, // Payment Amount
      { wch: 15 }, // Payment Status
      { wch: 30 }, // Comment
      { wch: 20 }, // Vote Date
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "voterName",
      "voterUsername",
      "voteeName",
      "voteeUsername",
      "contestName",
      "type",
      "count",
      "paymentAmount",
      "paymentStatus",
      "comment",
      "createdAt",
    ];
  }, []);

  // Case formatting configuration
  const caseConfig: CaseFormatConfig = useMemo(() => ({
    urlFormat: 'camelCase',
    apiFormat: 'camelCase',
  }), []);

  // Transformation function for export data
  const transformFunction: DataTransformFunction<VoteData> = useMemo(() => (row: VoteData) => {
    return {
      id: row.id,
      voterName: row.voter.name,
      voterUsername: row.voter.username,
      voteeName: row.votee.name,
      voteeUsername: row.votee.username,
      contestName: row.contest.name,
      type: row.type === "PAID" ? "Paid Vote" : "Free Vote",
      count: row.count,
      paymentAmount: row.payment ? `$${row.payment.amount}` : "N/A",
      paymentStatus: row.payment ? row.payment.status : "N/A",
      comment: row.comment || "",
      createdAt: formatTimestampToReadable(row.createdAt),
    };
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "votes",
    caseConfig,
    transformFunction
  };
}
