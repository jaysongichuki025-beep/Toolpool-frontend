/** AvailabilityCalendar — simple month grid showing blocked dates */

import { addDays, eachDayOfInterval, format, isWithinInterval, parseISO, startOfMonth, endOfMonth } from 'date-fns'

export default function AvailabilityCalendar({ blockedRanges = [], selectedStart, selectedEnd, onSelectDay }) {
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const isBlocked = (day) =>
    blockedRanges.some((r) => {
      const start = parseISO(r.start_date)
      const end = parseISO(r.end_date)
      return isWithinInterval(day, { start, end })
    })

  const isSelected = (day) => {
    if (!selectedStart) return false
    if (!selectedEnd) return format(day, 'yyyy-MM-dd') === format(selectedStart, 'yyyy-MM-dd')
    return isWithinInterval(day, { start: selectedStart, end: selectedEnd })
  }

  return (
    <div className="panel p-4">
      <p className="font-display text-lg">{format(today, 'MMMM yyyy')}</p>
      <p className="mb-3 text-xs text-steel">Yellow = your selection. Dark = already booked.</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-steel">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {/* Pad empty cells for first weekday */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const blocked = isBlocked(day)
          const selected = isSelected(day)
          const past = day < addDays(today, 0) && format(day, 'yyyy-MM-dd') !== format(today, 'yyyy-MM-dd')
          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={blocked || past}
              onClick={() => onSelectDay?.(day)}
              className={[
                'aspect-square border border-ink/20 text-sm',
                blocked || past ? 'cursor-not-allowed bg-ink/80 text-paper/50' : 'bg-white hover:bg-signal/40',
                selected ? 'bg-signal font-bold' : '',
              ].join(' ')}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>
    </div>
  )
}
