import { useMemo } from "react";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";
import { DataTransformFunction } from "@/components/data-table/utils/export-utils";
import { formatTimestampToReadable } from "@/utils/format";
import type { RankData } from "../schema";

/**
 * Export configuration for the ranks data table
 */
export function useExportConfig() {
  // Column mapping for export
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      rank: "Rank",
      profileName: "Model Name",
      profileUsername: "Username",
      profileBio: "Bio",
      totalVotes: "Total Votes",
      freeVotes: "Free Votes",
      paidVotes: "Paid Votes",
      createdAt: "Created At",
      updatedAt: "Updated At",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 8 },  // Rank
      { wch: 20 }, // Model Name
      { wch: 20 }, // Username
      { wch: 30 }, // Bio
      { wch: 12 }, // Total Votes
      { wch: 12 }, // Free Votes
      { wch: 12 }, // Paid Votes
      { wch: 20 }, // Created At
      { wch: 20 }, // Updated At
    ];
  }, []);

  // Headers for CSV export
  const headers = useMemo(() => {
    return [
      "id",
      "rank",
      "profileName",
      "profileUsername",
      "profileBio",
      "totalVotes",
      "freeVotes",
      "paidVotes",
      "createdAt",
      "updatedAt",
    ];
  }, []);

  // Case formatting configuration
  const caseConfig: CaseFormatConfig = useMemo(() => ({
    urlFormat: 'camelCase',
    apiFormat: 'camelCase',
  }), []);

  // Transformation function for export data
  const transformFunction: DataTransformFunction<RankData> = useMemo(() => (row: RankData) => {
    return {
      id: row.id,
      rank: row.rank === "N/A" ? "N/A" : `#${row.rank}`,
      profileName: row.profile.name,
      profileUsername: row.profile.username,
      profileBio: row.profile.bio,
      totalVotes: row.stats.freeVotes + row.stats.paidVotes,
      freeVotes: row.stats.freeVotes,
      paidVotes: row.stats.paidVotes,
      createdAt: formatTimestampToReadable(row.createdAt),
      updatedAt: formatTimestampToReadable(row.updatedAt),
    };
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "model-ranks",
    caseConfig,
    transformFunction
  };
}
