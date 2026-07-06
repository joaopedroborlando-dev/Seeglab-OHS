export interface PaginationOptions {
    page: number;
    limit: number;
    search?: string;
    filter?: any;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}