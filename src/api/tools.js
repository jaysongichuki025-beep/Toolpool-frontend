/** Tools API — browse, create, status, availability */

import client from './client'

export async function fetchTools(params = {}) {
  // params become query string: ?search=drill&category=1
  const { data } = await client.get('/tools/', { params })
  // DRF pagination returns { count, next, previous, results }
  return data
}

export async function fetchTool(id) {
  const { data } = await client.get(`/tools/${id}/`)
  return data
}

export async function createTool(formData) {
  // formData = FormData with optional primary_image file
  const { data } = await client.post('/tools/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateTool(id, formData) {
  const { data } = await client.patch(`/tools/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateToolStatus(id, status) {
  const { data } = await client.patch(`/tools/${id}/status/`, { status })
  return data
}

export async function fetchAvailability(id) {
  const { data } = await client.get(`/tools/${id}/availability/`)
  return data
}

export async function fetchCategories() {
  const { data } = await client.get('/categories/')
  return data
}

export async function createCategory(payload) {
  const { data } = await client.post('/categories/', payload)
  return data
}

export async function updateCategory(slug, payload) {
  const { data } = await client.patch(`/categories/${slug}/`, payload)
  return data
}

export async function deleteCategory(slug) {
  await client.delete(`/categories/${slug}/`)
}
