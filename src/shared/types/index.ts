export type ApiResponse<T = unknown> = {
  data: T
  message?: string
  success: boolean
}

export type PaginatedResponse<T = unknown> = {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}