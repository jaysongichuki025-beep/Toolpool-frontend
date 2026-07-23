/** ToolDetail — calendar + borrow request form */

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import AvailabilityCalendar from '../components/AvailabilityCalendar'
import StatusBadge from '../components/StatusBadge'
import { createRental } from '../api/rentals'
import { fetchAvailability, fetchTool } from '../api/tools'
import { useAuth } from '../auth/AuthContext'
import { formatPrice } from '../utils/formatters'

export default function ToolDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [tool, setTool] = useState(null)
  const [blocked, setBlocked] = useState([])
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    Promise.all([fetchTool(id), fetchAvailability(id)])
      .then(([t, avail]) => {
        setTool(t)
        setBlocked(avail.blocked_ranges || [])
      })
      .catch(() => setError('Tool not found.'))
  }, [id])

  const onSelectDay = (day) => {
    if (!start || (start && end)) {
      setStart(day)
      setEnd(null)
      return
    }
    if (day < start) {
      setStart(day)
      setEnd(null)
      return
    }
    setEnd(day)
  }

  const submitRequest = async (e) => {
    e.preventDefault()
    if (!start || !end) {
      setError('Select a start and end date on the calendar.')
      return
    }
    setBusy(true)
    setError('')
    setSuccess('')
    try {
      await createRental({
        tool: Number(id),
        start_date: format(start, 'yyyy-MM-dd'),
        end_date: format(end, 'yyyy-MM-dd'),
        message,
      })
      setSuccess('Request sent. Watch your dashboard for approval.')
      setMessage('')
      setStart(null)
      setEnd(null)
      const avail = await fetchAvailability(id)
      setBlocked(avail.blocked_ranges || [])
    } catch (err) {
      const data = err.response?.data
      setError(
        data?.start_date?.[0] ||
          data?.tool?.[0] ||
          data?.detail ||
          'Could not send request.'
      )
    } finally {
      setBusy(false)
    }
  }

  if (!tool && !error) {
    return <p className="font-display text-2xl text-steel">Loading…</p>
  }
  if (error && !tool) return <p className="text-danger">{error}</p>

  const isOwner = user?.id === tool.owner
  const image =
    tool.images?.find((i) => i.is_primary)?.image ||
    tool.images?.[0]?.image

  return (
    <div className="animate-fade-up grid gap-8 lg:grid-cols-2">
      <div>
        <div className="aspect-[4/3] border-2 border-ink bg-ink">
          {image ? (
            <img src={image} alt={tool.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-5xl text-signal">
              TOOL
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={tool.status} />
          <span className="text-sm text-steel">{tool.category_name}</span>
        </div>
        <h1 className="mt-2 font-display text-4xl">{tool.title}</h1>
        <p className="mt-1 text-xl font-semibold">{formatPrice(tool.daily_fee)}</p>
        <p className="mt-4 whitespace-pre-wrap text-steel">{tool.description}</p>
        {tool.pickup_instructions && (
          <div className="panel mt-4 border-l-4 border-l-signal p-4">
            <p className="text-xs font-semibold uppercase tracking-wide">Pickup</p>
            <p className="mt-1 text-sm">{tool.pickup_instructions}</p>
          </div>
        )}
        <p className="mt-3 text-sm text-steel">
          Owner: {tool.owner_email} · {tool.neighborhood || 'Neighborhood TBD'}
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl">Availability</h2>
        <AvailabilityCalendar
          blockedRanges={blocked}
          selectedStart={start}
          selectedEnd={end}
          onSelectDay={onSelectDay}
        />

        {isOwner ? (
          <p className="mt-4 text-steel">
            This is your listing.{' '}
            <Link to="/lender" className="underline decoration-signal">
              Manage on lender dashboard
            </Link>
          </p>
        ) : (
          <form onSubmit={submitRequest} className="panel mt-4 space-y-3 p-4">
            <h3 className="font-display text-xl">Request this tool</h3>
            <p className="text-sm text-steel">
              Selected:{' '}
              {start && end
                ? `${format(start, 'MMM d')} → ${format(end, 'MMM d')}`
                : start
                  ? `${format(start, 'MMM d')} → pick end date`
                  : 'Pick dates on the calendar'}
            </p>
            <textarea
              className="input-field min-h-[80px]"
              placeholder="Optional message to the owner"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            {success && <p className="text-sm text-ok">{success}</p>}
            <button type="submit" className="btn-primary" disabled={busy}>
              {busy ? 'Sending…' : 'Send borrow request'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
