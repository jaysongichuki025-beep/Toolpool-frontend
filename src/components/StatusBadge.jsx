/** StatusBadge — colored label for tool/rental status */

import { STATUS_LABELS } from '../utils/formatters'

const STYLES = {
  available: 'bg-ok text-white',
  approved: 'bg-ok text-white',
  returned: 'bg-ok text-white',
  resolved: 'bg-ok text-white',
  pending: 'bg-signal text-ink',
  active: 'bg-signal text-ink',
  in_use: 'bg-steel text-white',
  maintenance: 'bg-steel text-white',
  declined: 'bg-danger text-white',
  cancelled: 'bg-danger text-white',
  open: 'bg-danger text-white',
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-steel text-white'
  return (
    <span
      className={`inline-block border border-ink px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${style}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}
