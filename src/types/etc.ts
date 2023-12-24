export interface ResponsePayload<T> {
  code: number
  message: string | null
  content: T
}
