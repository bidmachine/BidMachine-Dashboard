export interface Paginator<T> {
    page: number
    pageSize: number
    count: number
    items: T[]
}
