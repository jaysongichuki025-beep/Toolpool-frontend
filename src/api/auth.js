/**
 * Auth API helpers — thin wrappers around the Django auth endpoints.
 * WHY separate files? Keeps pages clean: pages call login(), not raw axios.
 */

import client from './client'

export async function register(payload) {
  // payload: { email, password, role?, full_name?, neighborhood? }
  const { data } = await client.post('/auth/register/', payload)
  return data
}

export async function login(email, password) {
  // Django SimpleJWT expects the USERNAME_FIELD — ours is "email"
  const { data } = await client.post('/auth/login/', { email, password })
  // data = { access, refresh }
  return data
}

export async function fetchMe() {
  const { data } = await client.get('/auth/me/')
  return data
}

export async function updateMe(payload) {
  const { data } = await client.patch('/auth/me/', payload)
  return data
}
