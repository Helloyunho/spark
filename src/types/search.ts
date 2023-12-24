export interface SearchResultPayload<T> {
  size: number
  page: {
    next: {
      offset: number
    }
  } | null
  data: T[]
}

export interface SearchResultCleaned<T> {
  size: number
  nextOffset?: number
  result: T[]
}
