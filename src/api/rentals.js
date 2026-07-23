/** Rentals + disputes API */

import client from './client'

export async function fetchRentals(params = {}) {
  const { data } = await client.get('/rentals/', { params })
  return data
}

export async function createRental(payload) {
  const { data } = await client.post('/rentals/', payload)
  return data
}

export async function respondRental(id, action) {
  // action = 'approve' | 'decline'
  const { data } = await client.patch(`/rentals/${id}/respond/`, { action })
  return data
}

export async function markReturned(id) {
  const { data } = await client.patch(`/rentals/${id}/mark-returned/`)
  return data
}

export async function cancelRental(id) {
  const { data } = await client.delete(`/rentals/${id}/`)
  return data
}

export async function fetchAdminRentals(params = {}) {
  const { data } = await client.get('/admin/rentals/', { params })
  return data
}

export async function fetchDisputes(params = {}) {
  const { data } = await client.get('/disputes/', { params })
  return data
}

export async function createDispute(payload) {
  const { data } = await client.post('/disputes/', payload)
  return data
}
