import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getApiUrl } from "@/lib/config";
import { AUTH_TOKEN_KEY } from "@/lib/auth";
import { toast } from "sonner";

/**
 * Download file from blob
 */
function downloadFile(blob: Blob, filename: string) {
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export models API function - directly downloads file from backend
 */
export const exportModelsApi = async (options: {
  format?: 'excel' | 'csv';
  includeInactive?: boolean;
  contestId?: string;
} = {}): Promise<void> => {
  const { format = 'excel', includeInactive = false, contestId } = options;
  
  // Build query parameters
  const params = new URLSearchParams({
    format,
    includeInactive: includeInactive.toString(),
  });
  
  if (contestId) {
    params.append('contestId', contestId);
  }

  // Use API helper's authentication but handle binary response manually
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const url = getApiUrl(`/api/v1/export/models?${params.toString()}`);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': format === 'excel' 
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        : 'text/csv',
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed: ${response.status} ${response.statusText}`);
  }

  // Get the filename from the Content-Disposition header or use a default
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `models-export-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`;
  
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '');
    }
  }

  // Create blob and download directly
  const blob = await response.blob();
  downloadFile(blob, filename);
};

/**
 * Hook for exporting models
 */
export const useExportModels = () => {
  return useMutation({
    mutationFn: exportModelsApi,
    onSuccess: (_, variables) => {
      const format = variables?.format || 'excel';
      toast.success(`Models exported successfully as ${format.toUpperCase()}!`);
    },
    onError: (error: Error) => {
      toast.error(`Export failed: ${error.message}`);
    },
  });
};
