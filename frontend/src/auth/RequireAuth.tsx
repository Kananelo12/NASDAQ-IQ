import { Navigate, Outlet } from 'react-router'
import { useMe, useSignOut } from './session.ts'

export function RequireAuth() {
  const me = useMe()
  const signOut = useSignOut()

  if (me.isPending) {
    return <div className="center-page muted">Loading…</div>
  }

  if (me.error?.status === 401) {
    return <Navigate to="/sign-in" replace />
  }

  if (me.error?.status === 403) {
    return (
      <div className="center-page">
        <div className="panel">
          <h1>Access denied</h1>
          <p className="muted">
            This Google account isn't allowed to use the app. Ask the owner to
            add your email, or sign in with a different account.
          </p>
          <button className="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (me.isError) {
    return (
      <div className="center-page">
        <div className="panel">
          <h1>Can't reach the server</h1>
          <button className="button" onClick={() => me.refetch()}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <Outlet />
}
