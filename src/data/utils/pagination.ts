import type { GetListResponse, Pagination } from '../types'

interface HandlePaginationParamsProps {
    hasPagination?: boolean
    pagination?: Pagination
}

export function handlePaginationParams({ hasPagination, pagination }: HandlePaginationParamsProps = {}): Required<Pagination> {
    const hasPaginationString = hasPagination === false ? 'off' : 'server'
    const mode = pagination?.mode ?? hasPaginationString

    const current = pagination?.current ?? 1

    const pageSize = pagination?.pageSize ?? 10

    return {
        current,
        pageSize,
        mode,
    }
}

export function getNextPageParam(lastPage: GetListResponse) {
    const { pagination, cursor } = lastPage

    // cursor pagination
    if (cursor?.next) {
        return cursor.next
    }

    const current = pagination?.current || 1

    const pageSize = pagination?.pageSize || 10
    const totalPages = Math.ceil((lastPage.total || 0) / pageSize)

    return current < totalPages ? Number(current) + 1 : undefined
}

export function getPreviousPageParam(lastPage: GetListResponse) {
    const { pagination, cursor } = lastPage

    // cursor pagination
    if (cursor?.prev) {
        return cursor.prev
    }

    const current = pagination?.current || 1

    return current === 1 ? undefined : current - 1
}
