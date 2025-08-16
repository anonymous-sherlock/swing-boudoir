import { generateReactHelpers } from "@uploadthing/react";
import { API_CONFIG } from "./config";
import type { OurFileRouter } from "./uploadthingtypes";

export const { useUploadThing, uploadFiles } =
generateReactHelpers<OurFileRouter>({
  url: API_CONFIG.UPLOAD_URL
});