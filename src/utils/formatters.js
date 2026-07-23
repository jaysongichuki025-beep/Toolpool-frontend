/**
 * formatters + constants — small helpers used across pages
 */

export function formatPrice(fee) {
  const n = Number(fee)
  if (!n) return 'Free'
  return `$${n.toFixed(2)}/day`
}

export function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const STATUS_LABELS = {
  available: 'Available',
  in_use: 'In Use',
  maintenance: 'Maintenance',
  pending: 'Pending',
  approved: 'Approved',
  declined: 'Declined',
  active: 'Active',
  returned: 'Returned',
  cancelled: 'Cancelled',
  open: 'Open',
  resolved: 'Resolved',
}
