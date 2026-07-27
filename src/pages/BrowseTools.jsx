/** BrowseTools — search + category filter + owner actions */

import { useEffect, useState } from 'react'
import ToolCard from '../components/ToolCard'
import { fetchCategories, fetchTools, deleteTool, updateToolStatus } from '../api/tools'

export default function BrowseTools() {
  const [tools, setTools] = useState([])
  const [categories, setCategories] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        setCurrentUser(JSON.parse(userStr))
      }
    } catch {
      setCurrentUser(null)
    }

    fetchCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.results || []
        setCategories(list)
      })
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const params = {}
        if (search) params.search = search
        if (category) params.category = category
        const data = await fetchTools(params)
        const list = Array.isArray(data) ? data : data.results || []
        setTools(list)
      } catch {
        setError('Could not load tools.')
        setTools([])
      } finally {
        setLoading(false)
      }
    }

    const t = setTimeout(load, 200)
    return () => clearTimeout(t)
  }, [search, category])

  const handleDeleteTool = async (toolId) => {
    try {
      await deleteTool(toolId)
      setTools((prev) => prev.filter((tool) => tool.id !== toolId))
    } catch (err) {
      console.error('Failed to delist tool:', err)
      alert(err?.response?.data?.detail || 'Failed to delist tool.')
    }
  }

  const handleStatusChange = async (toolId, newStatus) => {
    try {
      await updateToolStatus(toolId, newStatus)
      setTools((prev) =>
        prev.map((t) => (t.id === toolId ? { ...t, status: newStatus } : t))
      )
    } catch (err) {
      console.error('Failed to update status:', err)
      alert('Could not update tool status.')
    }
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Browse tools</h1>
          <p className="mt-1 text-steel">Filter by category or search what you need today.</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-2 border-ink bg-white p-3 sm:flex-row">
        <input
          className="input-field flex-1"
          placeholder="Search drills, ladders, washers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field sm:w-56"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 text-danger">{error}</p>}
      {loading ? (
        <p className="mt-8 font-display text-2xl text-steel">Loading…</p>
      ) : tools.length === 0 ? (
        <p className="mt-8 text-steel">No tools match. Try clearing filters or list one yourself.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              currentUser={currentUser}
              onDelete={handleDeleteTool}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  )
}