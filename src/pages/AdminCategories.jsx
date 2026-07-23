/** AdminCategories — add/edit/remove categories */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '../api/tools'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const load = () =>
    fetchCategories()
      .then((data) => setCategories(data.results || data))
      .catch(() => setError('Failed to load categories (admin only).'))

  useEffect(() => {
    load()
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      await createCategory({ name, slug, description, is_active: true })
      setName('')
      setDescription('')
      load()
    } catch (err) {
      setError(err.response?.data?.slug?.[0] || err.response?.data?.name?.[0] || 'Create failed.')
    }
  }

  const toggleActive = async (cat) => {
    await updateCategory(cat.slug, { is_active: !cat.is_active })
    load()
  }

  const remove = async (slug) => {
    if (!confirm('Delete this category? Tools using it are protected.')) return
    try {
      await deleteCategory(slug)
      load()
    } catch {
      setError('Cannot delete — tools may still use this category.')
    }
  }

  return (
    <div className="animate-fade-up">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Categories</h1>
          <p className="mt-1 text-steel">Admin — shape the browse filters.</p>
        </div>
        <Link to="/admin/rentals" className="btn-ghost !text-xs">
          Transaction log →
        </Link>
      </div>

      {error && <p className="mt-3 text-danger">{error}</p>}

      <form onSubmit={onCreate} className="panel mt-6 grid gap-3 p-4 sm:grid-cols-3">
        <input className="input-field" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="input-field" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit" className="btn-primary">Add category</button>
      </form>

      <ul className="mt-6 space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="panel flex flex-wrap items-center justify-between gap-2 p-3">
            <div>
              <p className="font-display text-lg">{c.name}</p>
              <p className="text-xs text-steel">{c.slug} · {c.is_active ? 'active' : 'inactive'}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost !px-3 !py-1 !text-xs" onClick={() => toggleActive(c)}>
                {c.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button type="button" className="btn-danger !text-xs" onClick={() => remove(c.slug)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
