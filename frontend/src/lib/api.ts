// Same origin in every environment: the Vite dev proxy locally, a Render rewrite in
// production. That keeps the auth session cookie first-party.
const API_BASE = '/api'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new ApiError(response.status, `GET ${path} failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}
