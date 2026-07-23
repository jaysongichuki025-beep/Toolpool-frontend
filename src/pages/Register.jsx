/** Register page */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    neighborhood: '',
    role: 'borrower',
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await register(form)
      navigate('/browse')
    } catch (err) {
      const data = err.response?.data
      const msg =
        data?.email?.[0] ||
        data?.password?.[0] ||
        data?.detail ||
        'Registration failed. Try a stronger password.'
      setError(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md animate-fade-up">
      <h1 className="font-display text-4xl">Join ToolPool</h1>
      <p className="mt-1 text-steel">One account to borrow and lend on your block.</p>

      <form onSubmit={onSubmit} className="panel mt-6 space-y-4 p-6">
        {error && (
          <p className="border-2 border-danger bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Full name
          <input className="input-field mt-1" value={form.full_name} onChange={set('full_name')} />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Email
          <input type="email" required className="input-field mt-1" value={form.email} onChange={set('email')} />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Password (min 8)
          <input type="password" required minLength={8} className="input-field mt-1" value={form.password} onChange={set('password')} />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Neighborhood
          <input className="input-field mt-1" placeholder="e.g. Westlands" value={form.neighborhood} onChange={set('neighborhood')} />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          I mostly want to
          <select className="input-field mt-1" value={form.role} onChange={set('role')}>
            <option value="borrower">Borrow tools</option>
            <option value="lender">Lend my tools</option>
          </select>
        </label>
        <button type="submit" className="btn-primary w-full" disabled={busy}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-sm text-steel">
        Already joined?{' '}
        <Link to="/login" className="font-semibold text-ink underline decoration-signal decoration-2">
          Log in
        </Link>
      </p>
    </div>
  )
}
