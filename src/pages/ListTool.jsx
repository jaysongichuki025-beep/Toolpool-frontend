/** ListTool — lender creates a listing with optional photo */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTool, fetchCategories } from '../api/tools'

export default function ListTool() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'good',
    daily_fee: '0',
    pickup_instructions: '',
    neighborhood: '',
  })
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetchCategories()
      .then((data) => {
        const list = data.results || data
        setCategories(list)
        if (list[0]) setForm((f) => ({ ...f, category: String(list[0].id) }))
      })
      .catch(() => setError('Could not load categories.'))
  }, [])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('primary_image', image)
      const tool = await createTool(fd)
      navigate(`/tools/${tool.id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create listing.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl animate-fade-up">
      <h1 className="font-display text-4xl">List a tool</h1>
      <p className="mt-1 text-steel">Photos help. Clear pickup notes save texts later.</p>

      <form onSubmit={onSubmit} className="panel mt-6 space-y-4 p-6">
        {error && <p className="text-sm text-danger">{error}</p>}

        <label className="block text-sm font-semibold uppercase tracking-wide">
          Title
          <input required className="input-field mt-1" value={form.title} onChange={set('title')} />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Description
          <textarea required className="input-field mt-1 min-h-[100px]" value={form.description} onChange={set('description')} />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Category
          <select required className="input-field mt-1" value={form.category} onChange={set('category')}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold uppercase tracking-wide">
            Condition
            <select className="input-field mt-1" value={form.condition} onChange={set('condition')}>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="worn">Worn</option>
            </select>
          </label>
          <label className="block text-sm font-semibold uppercase tracking-wide">
            Daily fee (0 = free)
            <input type="number" min="0" step="0.01" className="input-field mt-1" value={form.daily_fee} onChange={set('daily_fee')} />
          </label>
        </div>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Neighborhood
          <input className="input-field mt-1" value={form.neighborhood} onChange={set('neighborhood')} />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Pickup instructions
          <textarea className="input-field mt-1" value={form.pickup_instructions} onChange={set('pickup_instructions')} />
        </label>
        <label className="block text-sm font-semibold uppercase tracking-wide">
          Photo
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </label>
        <button type="submit" className="btn-primary" disabled={busy}>
          {busy ? 'Publishing…' : 'Publish listing'}
        </button>
      </form>
    </div>
  )
}
