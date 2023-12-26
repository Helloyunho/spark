export interface ResponsePayload<T> {
  code: number
  message: string | null
  content: T
}

export interface AccessTokenPayload {
  accessToken: string
  temporaryRestrict: {
    temporaryRestrict: boolean
    times: number
    duration: number | null
    createdTime: number | null // number ig
  }
  extraToken: string
}
