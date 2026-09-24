const API_BASE = `${import.meta.env.VITE_API_URL ?? ''}/api`

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
