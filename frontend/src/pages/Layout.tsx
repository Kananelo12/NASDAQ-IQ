import { NavLink, Outlet } from 'react-router'

export function Layout() {
  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">NASDAQ Macro Intelligence</span>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
        </nav>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
