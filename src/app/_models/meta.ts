export interface IMeta {
    total?: number;
    from?: number | null;
    to?: number | null;
    perPage: number;
    lastPage?: number | null;
    pages?: number;
    count?: number;
    limit?: number;
    currentPage?: number;
}
