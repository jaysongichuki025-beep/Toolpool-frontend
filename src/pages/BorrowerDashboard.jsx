/** BorrowerDashboard — track my requests & return deadlines */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { cancelRental, fetchRentals } from '../api/rentals'
import { formatDate, formatPrice } from '../utils/formatters'

export default function BorrowerDashboard() {
  const [rentals, setRentals] = useState([])
  const [error, setError] = useState('')

  const load = () =>
    fetchRentals({ as: 'borrower' })
      .then((data) => setRentals(data.results || data))
      .catch(() => setError('Could not load rentals.'))

  useEffect(() => {
    load()
  }, [])

  const onCancel = async (id) => {
    try {
      await cancelRental(id)
      load()
    } catch {
      setError('Could not cancel.')
    }
  }

  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-4xl">My rentals</h1>
      <p className="mt-1 text-steel">Active requests, approvals, and return dates.</p>
      {error && <p className="mt-3 text-danger">{error}</p>}

      <div className="mt-6 space-y-3">
        {rentals.length === 0 && (
          <p className="text-steel">
            No requests yet.{' '}
            <Link to="/browse" className="underline decoration-signal">
              Browse tools
            </Link>
          </p>
        )}
        {rentals.map((r) => (
          <article key={r.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Link to={`/tools/${r.tool}`} className="font-display text-xl hover:text-signal-dark">
                {r.tool_title}
              </Link>
              <p className="text-sm text-steel">
                {formatDate(r.start_date)} → {formatDate(r.end_date)} · {formatPrice(r.total_fee).replace('/day', ' total')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={r.status} />
              {r.status === 'pending' && (
                <button type="button" className="btn-ghost !px-3 !py-1 !text-xs" onClick={() => onCancel(r.id)}>
                  Cancel
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
