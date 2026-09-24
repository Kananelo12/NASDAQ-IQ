import { NavLink, Outlet } from 'react-router'
import { useMe, useSignOut } from '../auth/session.ts'

export function Layout() {
  const { data: me } = useMe()
  const signOut = useSignOut()

  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">NASDAQ Macro Intelligence</span>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
        </nav>
        <div className="account">
          <span className="muted">{me?.email}</span>
          <button className="button button-subtle" onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
