/**
 * ═══════════════════════════════════════════════════════════════════════════
 * AuthContext — Global login state shared by every page
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY Context?
 *   Without it, every page would re-fetch the user or dig in localStorage.
 *   One provider wraps the app; any component can call useAuth().
 */

import { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)       // null = logged out
  const [loading, setLoading] = useState(true) // true while we check tokens on boot

  // On first load: if tokens exist, fetch /auth/me/
  useEffect(() => {
    const boot = async () => {
      const access = localStorage.getItem('access_token')
      if (!access) {
        setLoading(false)
        return
      }
      try {
        const me = await authApi.fetchMe()
        setUser(me)
      } catch {
        // Bad/expired tokens — clear them
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    boot()
  }, [])

  const login = async (email, password) => {
    const tokens = await authApi.login(email, password)
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
    const me = await authApi.fetchMe()
    setUser(me)
    return me
  }

  const register = async (payload) => {
    await authApi.register(payload)
    // Auto-login after register so UX is smooth
    return login(payload.email, payload.password)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin' || user?.is_superuser,
    login,
    register,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Hook — pages call: const { user, login } = useAuth() */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
