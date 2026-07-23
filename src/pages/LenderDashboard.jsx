/** LenderDashboard — my tools, status toggle, approve/decline requests */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { fetchRentals, markReturned, respondRental } from '../api/rentals'
import { fetchTools, updateToolStatus } from '../api/tools'
import { formatDate } from '../utils/formatters'

export default function LenderDashboard() {
  const [tools, setTools] = useState([])
  const [incoming, setIncoming] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const [t, r] = await Promise.all([
        fetchTools({ mine: '1' }),
        fetchRentals({ as: 'owner' }),
      ])
      setTools(t.results || t)
      setIncoming(r.results || r)
    } catch {
      setError('Could not load lender data.')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const setStatus = async (id, status) => {
    await updateToolStatus(id, status)
    load()
  }

  const respond = async (id, action) => {
    await respondRental(id, action)
    load()
  }

  const returned = async (id) => {
    await markReturned(id)
    load()
  }

  return (
    <div className="animate-fade-up space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Lender desk</h1>
          <p className="mt-1 text-steel">Toggle availability and clear the request queue.</p>
        </div>
        <Link to="/tools/new" className="btn-primary">
          List a tool
        </Link>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <section>
        <h2 className="font-display text-2xl">My tools</h2>
        <div className="mt-3 space-y-3">
          {tools.length === 0 && <p className="text-steel">No listings yet.</p>}
          {tools.map((tool) => (
            <article key={tool.id} className="panel flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <Link to={`/tools/${tool.id}`} className="font-display text-xl">
                  {tool.title}
                </Link>
                <div className="mt-1">
                  <StatusBadge status={tool.status} />
                </div>
              </div>
              <select
                className="input-field w-auto"
                value={tool.status}
                onChange={(e) => setStatus(tool.id, e.target.value)}
              >
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Incoming requests</h2>
        <div className="mt-3 space-y-3">
          {incoming.length === 0 && <p className="text-steel">No requests on your tools.</p>}
          {incoming.map((r) => (
            <article key={r.id} className="panel p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl">{r.tool_title}</p>
                  <p className="text-sm text-steel">
                    {r.borrower_email} · {formatDate(r.start_date)} → {formatDate(r.end_date)}
                  </p>
                  {r.message && <p className="mt-1 text-sm italic text-steel">“{r.message}”</p>}
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.status === 'pending' && (
                  <>
                    <button type="button" className="btn-primary !py-1.5 !text-xs" onClick={() => respond(r.id, 'approve')}>
                      Accept
                    </button>
                    <button type="button" className="btn-danger !text-xs" onClick={() => respond(r.id, 'decline')}>
                      Decline
                    </button>
                  </>
                )}
                {(r.status === 'approved' || r.status === 'active') && (
                  <button type="button" className="btn-ghost !py-1.5 !text-xs" onClick={() => returned(r.id)}>
                    Mark returned
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
