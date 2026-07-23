/**
 * Home — brand-first full-bleed hero (black + yellow workshop energy)
 * First viewport: brand, one headline, one sentence, one CTA group.
 */

import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <section className="-mx-4 -mt-8">
      {/* Full-bleed hero plane */}
      <div className="relative min-h-[78vh] overflow-hidden bg-ink text-paper">
        {/* Diagonal yellow stripe — hardware-aisle signal, not a purple gradient */}
        <div
          className="pointer-events-none absolute -right-16 top-0 h-full w-1/3 origin-top-right skew-x-[-12deg] bg-signal"
          aria-hidden
        />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-center gap-6 px-4 py-20 md:py-28">
          <p className="font-display text-5xl leading-none tracking-[0.2em] text-signal md:text-7xl animate-fade-up">
            TOOLPOOL
          </p>
          <h1 className="max-w-xl font-display text-3xl leading-tight text-paper md:text-5xl animate-fade-up [animation-delay:80ms]">
            Borrow the drill. Skip the big-box receipt.
          </h1>
          <p className="max-w-md text-base text-paper/75 animate-fade-up [animation-delay:140ms]">
            Neighbors list garage tools for a small fee — or free. Search your block, request dates, pick up local.
          </p>
          <div className="flex flex-wrap gap-3 pt-2 animate-fade-up [animation-delay:200ms]">
            <Link to="/browse" className="btn-primary">
              Find tools
            </Link>
            {isAuthenticated ? (
              <Link to="/tools/new" className="btn-ghost !border-paper !text-paper hover:!bg-signal hover:!text-ink">
                List yours
              </Link>
            ) : (
              <Link to="/register" className="btn-ghost !border-paper !text-paper hover:!bg-signal hover:!text-ink">
                Join your block
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Single-purpose section below the fold */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl text-ink">How it works</h2>
        <p className="mt-2 max-w-lg text-steel">
          Three steps. No subscriptions. No warehouse markups.
        </p>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ['01', 'Search nearby', 'Filter by gardening, power tools, ladders, and more.'],
            ['02', 'Request dates', 'Pick a window on the calendar and message the owner.'],
            ['03', 'Pick up & return', 'Follow pickup notes. Mark returned when you are done.'],
          ].map(([n, title, body]) => (
            <li key={n} className="panel border-l-4 border-l-signal p-5">
              <span className="font-display text-2xl text-signal">{n}</span>
              <h3 className="mt-2 font-display text-xl">{title}</h3>
              <p className="mt-1 text-sm text-steel">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
