export interface Pagination {
  total: number;
  page: number;
  limit: number;
  next?: number;
  prev?: number;
}
