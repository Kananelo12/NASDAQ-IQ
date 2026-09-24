import { useQuery } from '@tanstack/react-query'
import { apiGet } from '../lib/api.ts'

interface HealthResponse {
  status: string
  time: string
}

export function DashboardPage() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => apiGet<HealthResponse>('/health'),
  })

  return (
    <section>
      <h1>Dashboard</h1>
      <p className="muted">
        Upcoming events, market regime and Fed watch will appear here.
      </p>

      <div className="card">
        <span className="label">API</span>
        {health.isPending && <span>Checking…</span>}
        {health.isError && (
          <span className="status status-down">Unreachable</span>
        )}
        {health.isSuccess && (
          <span className="status status-up">
            {health.data.status} · {new Date(health.data.time).toLocaleTimeString()}
          </span>
        )}
      </div>
    </section>
  )
}
