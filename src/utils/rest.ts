export class RESTClient {
  auth?: string
  session?: string
  constructor({ auth, session }: { auth?: string; session?: string } = {}) {
    if (
      (auth !== undefined && session === undefined) ||
      (auth === undefined && session !== undefined)
    ) {
      throw new Error('Both auth and session must be provided.')
    }
    this.auth = auth
    this.session = session
  }

  async request<R>({
    method = 'GET',
    url,
    headers = {},
    body,
    query = {}
  }: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
    url: string
    headers?: Record<string, string>
    body?: Record<string, unknown> | FormData | string
    query?: Record<string, string | undefined>
  }): Promise<R> {
    if (this.auth !== undefined && this.session !== undefined) {
      const cookies = headers.Cookie.split(';')
      cookies.push(`NID_AUT=${this.auth}`)
      cookies.push(`NID_SES=${this.session}`)
      headers.Cookie = cookies.join('; ')
    }
    if (typeof body === 'object' && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
      body = JSON.stringify(body)
    }

    const urlParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(query).filter(([_, v]) => v !== undefined)
      ) as Record<string, string>
    )
    url = `${url}?${urlParams.toString()}`

    const resp = await fetch(url, {
      headers,
      method,
      body
    })

    if (!resp.ok) {
      // TODO: Better error handling
      throw new Error(`${resp.status} ${resp.statusText}`)
    }

    const json = await resp.json()

    return json as R
  }
}
