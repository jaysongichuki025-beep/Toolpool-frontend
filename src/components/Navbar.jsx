/** Navbar — dark bar with yellow brand mark */

import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b-4 border-signal bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="font-display text-2xl tracking-widest text-signal">
          TOOLPOOL
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/browse" className="nav-link">
            Browse
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" className="nav-link">
                My Rentals
              </NavLink>
              <NavLink to="/lender" className="nav-link">
                Lend
              </NavLink>
              <NavLink to="/tools/new" className="nav-link">
                List a Tool
              </NavLink>
              {isAdmin && (
                <NavLink to="/admin/categories" className="nav-link">
                  Admin
                </NavLink>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-xs text-paper/70 sm:inline">
                {user?.profile?.full_name || user?.email}
              </span>
              <button type="button" onClick={logout} className="btn-ghost !border-paper/40 !px-3 !py-1.5 !text-xs !text-paper hover:!bg-signal hover:!text-ink">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-3 !py-1.5 !text-xs">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
