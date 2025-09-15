/**
 * Common types used across the application
 */

/**
 * Generic pagination interface that can be extended
 */
export interface Pagination {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
}

/**
 * Generic API response with pagination
 */
export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}

/**
 * Search parameters
 */
export interface SearchParams {
    page?: number;
    limit?: number;
    query?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}