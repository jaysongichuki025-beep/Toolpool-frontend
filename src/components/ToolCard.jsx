/** ToolCard — dense browse grid item (no soft floating card look) */

import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatters'
import StatusBadge from './StatusBadge'

export default function ToolCard({ tool }) {
  return (
    <Link
      to={`/tools/${tool.id}`}
      className="panel group flex flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 animate-fade-up"
    >
      <div className="relative aspect-[4/3] bg-ink">
        {tool.primary_image_url ? (
          <img
            src={tool.primary_image_url}
            alt={tool.title}
            className="h-full w-full object-cover opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-3xl text-signal">
            TOOL
          </div>
        )}
        <div className="absolute left-2 top-2">
          <StatusBadge status={tool.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs uppercase tracking-wider text-steel">
          {tool.category_name || 'Uncategorized'}
        </p>
        <h3 className="font-display text-xl leading-tight">{tool.title}</h3>
        <div className="mt-auto flex items-end justify-between pt-2">
          <span className="font-semibold text-ink">{formatPrice(tool.daily_fee)}</span>
          <span className="text-xs text-steel">{tool.neighborhood || 'Nearby'}</span>
        </div>
      </div>
    </Link>
  )
}
