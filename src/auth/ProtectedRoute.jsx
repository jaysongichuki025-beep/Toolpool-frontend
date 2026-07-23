/**
 * ProtectedRoute — wraps private pages.
 * WHY: If not logged in, redirect to /login and remember where they wanted to go.
 */

import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export default function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="font-display text-2xl text-steel">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // state.from lets Login redirect back after success
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/browse" replace />
  }

  // Outlet = render the nested child route (Dashboard, ListTool, etc.)
  return <Outlet />
}
