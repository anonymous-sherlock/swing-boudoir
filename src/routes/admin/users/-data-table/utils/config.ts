import { useMemo } from "react";
import { CaseFormatConfig } from "@/components/data-table/utils/case-utils";
import { DataTransformFunction } from "@/components/data-table/utils/export-utils";
import { formatTimestampToReadable, formatCurrency } from "@/utils/format";
import type { UserCamelCase } from "../schema";
import { getSocialMediaUrl } from "@/utils/social-media";

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
      type: "User Type",
      role: "Role",
      emailVerified: "Email Verified",
      hasProfile: "Onboarding Status",
      createdAt: "Joined Date",
      gender: "Gender",
      address: "Address",
      city: "City",
      country: "Country",
      postalCode: "Postal Code",
      dateOfBirth: "Date of Birth",
      totalContestsWon: "Contests Won",
      totalContestsParticipated: "Contests Participated",
      instagram: "Instagram",
      tiktok: "TikTok",
      youtube: "YouTube",
      twitter: "Twitter",
      facebook: "Facebook",
      linkedin: "LinkedIn",
      website: "Website",
      other: "Other Social",
    };
  }, []);

  // Column widths for Excel export
  const columnWidths = useMemo(() => {
    return [
      { wch: 10 }, // ID
      { wch: 20 }, // Name
      { wch: 20 }, // Username
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 20 }, // Image
      { wch: 12 }, // Type
      { wch: 12 }, // Role
      { wch: 15 }, // Email Verified
      { wch: 18 }, // Onboarding Status
      { wch: 20 }, // Created At
      { wch: 12 }, // Gender
      { wch: 25 }, // Address
      { wch: 15 }, // City
      { wch: 15 }, // Country
      { wch: 12 }, // Postal Code
      { wch: 15 }, // Date of Birth
      { wch: 15 }, // Contests Won
      { wch: 20 }, // Contests Participated
      { wch: 15 }, // Instagram
      { wch: 15 }, // TikTok
      { wch: 15 }, // YouTube
      { wch: 15 }, // Twitter
      { wch: 15 }, // Facebook
      { wch: 15 }, // LinkedIn
      { wch: 20 }, // Website
      { wch: 15 }, // Other Social
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
      "type",
      "role",
      "emailVerified",
      "hasProfile",
      "createdAt",
      "gender",
      "address",
      "city",
      "country",
      "postalCode",
      "dateOfBirth",
      "totalContestsWon",
      "totalContestsParticipated",
      "instagram",
      "tiktok",
      "youtube",
      "twitter",
      "facebook",
      "linkedin",
      "website",
      "other",
    ];
  }, []);

  // Case formatting configuration for camelCase table
  const caseConfig: CaseFormatConfig = useMemo(() => ({

    urlFormat: 'camelCase', // URL parameters use snake_case
    apiFormat: 'camelCase', // API parameters also use camelCase
  }), []);

  // Example transformation function showcasing different formatting options
  const transformFunction: DataTransformFunction<UserCamelCase> = useMemo(() => (row: UserCamelCase) => {
    return {
      id: row.id,
      name: row.name,
      username: row.username,
      email: row.email,
      phone: row.phone,
      image: row.image,
      type: row.type === "MODEL" ? "Model" : "Voter",
      role: row.role,
      emailVerified: row.emailVerified ? "Verified" : "Pending",
      hasProfile: row.hasProfile ? "Completed" : "Pending",
      createdAt: formatTimestampToReadable(row.createdAt),
      gender: row.gender || "",
      address: row.address || "",
      city: row.city || "",
      country: row.country || "",
      postalCode: row.postalCode || "",
      dateOfBirth: row.dateOfBirth || "",
      totalContestsWon: row.totalContestsWon || 0,
      totalContestsParticipated: row.totalContestsParticipated || 0,
      instagram: getSocialMediaUrl("instagram", row.profile.socialMedia.instagram),
      tiktok: getSocialMediaUrl("tiktok", row.profile.socialMedia.tiktok),
      youtube: getSocialMediaUrl("youtube", row.profile.socialMedia.youtube),
      twitter: getSocialMediaUrl("twitter", row.profile.socialMedia.twitter),
      facebook: getSocialMediaUrl("facebook", row.profile.socialMedia.facebook),
      linkedin: getSocialMediaUrl("linkedin", row.profile.socialMedia.linkedin),
      website: getSocialMediaUrl("website", row.profile.socialMedia.website),
      other: row.profile.socialMedia.other
    };
  }, []);

  return {
    columnMapping,
    columnWidths,
    headers,
    entityName: "users",
    caseConfig,
    transformFunction
  };
}