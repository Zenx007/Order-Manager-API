export type List<T> = T[];

export interface PagedList<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}
