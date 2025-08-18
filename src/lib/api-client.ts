import { API_CONFIG } from "./config";
import { createApiClient } from "./validations/api-helper";

export const hc = createApiClient(API_CONFIG.API_BASE_HOST)