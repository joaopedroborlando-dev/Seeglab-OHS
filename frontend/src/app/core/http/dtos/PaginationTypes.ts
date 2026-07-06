interface IPaginationOptions {
  page: number;
  limit: number;
  search?: string;
}

interface IPaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
}

interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type {
  IPaginationOptions,
  IPaginatedResponse
};
