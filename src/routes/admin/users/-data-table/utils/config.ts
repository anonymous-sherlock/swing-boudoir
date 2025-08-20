import { useMemo } from "react";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";
import { DataTransformFunction } from "@/components/data-table/utils/export-utils";
import { formatTimestampToReadable, formatCurrency } from "@/utils/format";
import type { UserCamelCase } from "../schema";

/**
 * Export configuration for the camelCase users data table
 */
export function useExportConfig() {
  // Column mapping for export (camelCase version)
  const columnMapping = useMemo(() => {
    return {
      id: "ID",
      name: "Name",
      username: "Username",
      email: "Email",
      phone: "Phone",
      image: "Image",
      role: "Role",
      emailVerified: "Email Verified",
      hasProfile: "Onboarding Status",
      createdAt: "Joined Date",
    };
  }, []);
  
  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 20 }, // Image
      { wch: 20 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 12 }, // Role
      { wch: 15 }, // Email Verified
      { wch: 18 }, // Onboarding Status
      { wch: 20 }, // Created At
    ];
  }, []);
  
  // Headers for CSV export (camelCase version)
  const headers = useMemo(() => {
    return [
      "id",
      "name",
      "username",
      "email",
      "phone",
      "image",
      "role",
      "emailVerified",
      "hasProfile",
      "createdAt",
    ];
  }, []);

  // Case formatting configuration for camelCase table
  const caseConfig: CaseFormatConfig = useMemo(() => ({

    urlFormat: 'camelCase', // URL parameters use snake_case
    apiFormat: 'camelCase', // API parameters also use camelCase
  }), []);

  // Example transformation function showcasing different formatting options
  const transformFunction: DataTransformFunction<UserCamelCase> = useMemo(() => (row: UserCamelCase) => ({
    ...row,
    // Format timestamps to human-readable format
    createdAt: formatTimestampToReadable(row.createdAt),
    // Format boolean values for better readability
    emailVerified: row.emailVerified ? "Verified" : "Pending",
    hasProfile: row.hasProfile ? "Completed" : "Pending",
    // Add any other custom transformations as needed
  }), []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "users-camel-case",
    caseConfig,
    transformFunction
  };
}