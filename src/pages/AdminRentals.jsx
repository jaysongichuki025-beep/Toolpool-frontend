/** AdminRentals — transaction monitoring + disputes */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { fetchAdminRentals, fetchDisputes } from '../api/rentals'
import { formatDate, formatPrice } from '../utils/formatters'

export default function AdminRentals() {
  const [rentals, setRentals] = useState([])
  const [disputes, setDisputes] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([fetchAdminRentals(), fetchDisputes()])
      .then(([r, d]) => {
        setRentals(r.results || r)
        setDisputes(d.results || d)
      })
      .catch(() => setError('Admin access required.'))
  }, [])

  return (
    <div className="animate-fade-up space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Transactions</h1>
          <p className="mt-1 text-steel">All rentals and flagged disputes.</p>
        </div>
        <Link to="/admin/categories" className="btn-ghost !text-xs">
          ← Categories
        </Link>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <section>
        <h2 className="font-display text-2xl">Rental log</h2>
        <div className="mt-3 overflow-x-auto border-2 border-ink">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink text-paper">
              <tr>
                <th className="px-3 py-2 font-display tracking-wide">ID</th>
                <th className="px-3 py-2 font-display tracking-wide">Tool</th>
                <th className="px-3 py-2 font-display tracking-wide">Borrower</th>
                <th className="px-3 py-2 font-display tracking-wide">Dates</th>
                <th className="px-3 py-2 font-display tracking-wide">Fee</th>
                <th className="px-3 py-2 font-display tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map((r) => (
                <tr key={r.id} className="border-t border-ink/20 bg-white">
                  <td className="px-3 py-2">#{r.id}</td>
                  <td className="px-3 py-2">{r.tool_title}</td>
                  <td className="px-3 py-2">{r.borrower_email}</td>
                  <td className="px-3 py-2">
                    {formatDate(r.start_date)} → {formatDate(r.end_date)}
                  </td>
                  <td className="px-3 py-2">{formatPrice(r.total_fee).replace('/day', '')}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Disputes</h2>
        <div className="mt-3 space-y-2">
          {disputes.length === 0 && <p className="text-steel">No disputes flagged.</p>}
          {disputes.map((d) => (
            <article key={d.id} className="panel p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-display text-lg">{d.rental_tool || `Rental #${d.rental}`}</p>
                <StatusBadge status={d.status} />
              </div>
              <p className="mt-1 text-sm text-steel">{d.reason}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
