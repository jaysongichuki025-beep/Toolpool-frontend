/** ToolCard — dense browse grid item (no soft floating card look) */

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatters'
import StatusBadge from './StatusBadge'

export default function ToolCard({ tool, currentUser, onDelete, onStatusChange }) {
  const [isDeleting, setIsDeleting] = useState(false)

  // Determine if the currently logged-in user owns this tool
  const currentUserId = currentUser?.id || currentUser?.pk
  const toolOwnerId = typeof tool.owner === 'object' ? tool.owner?.id : tool.owner
  const isOwner = Boolean(currentUserId && toolOwnerId && currentUserId === toolOwnerId)

  // Handle Delist / Delete
  const handleDelete = async (e) => {
    e.preventDefault() // Prevents clicking the Link
    e.stopPropagation()

    const confirmDelete = window.confirm(
      `Are you sure you want to delist "${tool.title}"? This cannot be undone.`
    )
    if (!confirmDelete) return

    setIsDeleting(true)
    try {
      if (onDelete) {
        await onDelete(tool.id)
      }
    } catch (err) {
      console.error('Failed to delist tool:', err)
      alert(err?.response?.data?.detail || 'Failed to delist tool.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle Quick Status Update (Optional)
  const handleToggleStatus = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const nextStatus = tool.status === 'available' ? 'maintenance' : 'available'
    if (onStatusChange) {
      onStatusChange(tool.id, nextStatus)
    }
  }

  return (
    <div className="panel group relative flex flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 animate-fade-up">
      {/* Clickable Card Link */}
      <Link to={`/tools/${tool.id}`} className="flex flex-1 flex-col">
        {/* Image / Thumbnail Section */}
        <div className="relative aspect-[4/3] bg-ink">
          {tool.primary_image_url || tool.photo_url || tool.photo ? (
            <img
              src={tool.primary_image_url || tool.photo_url || tool.photo}
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

        {/* Content Section */}
        <div className="flex flex-1 flex-col gap-1 p-3">
          <p className="text-xs uppercase tracking-wider text-steel">
            {tool.category_name || tool.category?.name || 'Uncategorized'}
          </p>
          <h3 className="font-display text-xl leading-tight text-ink">{tool.title}</h3>
          
          <div className="mt-auto flex items-end justify-between pt-2">
            <span className="font-semibold text-ink">{formatPrice(tool.daily_fee)}/day</span>
            <span className="text-xs text-steel">{tool.neighborhood || 'Nearby'}</span>
          </div>
        </div>
      </Link>

      {/* Owner Actions Toolbar (Renders only if user owns the tool) */}
      {isOwner && (
        <div className="flex items-center justify-between border-t border-steel/20 bg-canvas/50 px-3 py-2 text-xs">
          {onStatusChange && (
            <button
              onClick={handleToggleStatus}
              type="button"
              className="font-medium text-steel hover:text-ink"
            >
              Set {tool.status === 'available' ? 'Maintenance' : 'Available'}
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            type="button"
            className="ml-auto font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-50"
          >
            {isDeleting ? 'Delisting...' : 'Delist Tool'}
          </button>
        </div>
      )}
    </div>
  )
}