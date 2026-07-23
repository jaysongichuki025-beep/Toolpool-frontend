/** Login page */

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/browse'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Check email and password.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md animate-fade-up">
      <h1 className="font-display text-4xl text-ink">Log in</h1>
      <p className="mt-1 text-steel">Access your rentals and listings.</p>

      <form onSubmit={onSubmit} className="panel mt-6 space-y-4 p-6">
        {error && (
          <p className="border-2 border-danger bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Email
          <input
            type="email"
            required
            className="input-field mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Password
          <input
            type="password"
            required
            className="input-field mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-4 text-sm text-steel">
        New here?{' '}
        <Link to="/register" className="font-semibold text-ink underline decoration-signal decoration-2">
          Create an account
        </Link>
      </p>
    </div>
  )
}
