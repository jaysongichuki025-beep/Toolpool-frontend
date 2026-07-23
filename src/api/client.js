/**
 * ═══════════════════════════════════════════════════════════════════════════
 * src/api/client.js — Shared Axios instance with JWT interceptor
 * ═══════════════════════════════════════════════════════════════════════════
 * WHY Axios?
 *   Cleaner than fetch for attaching headers + handling 401 refresh.
 *
 * Flow:
 *   1. Every request gets Authorization: Bearer <access_token>
 *   2. If API returns 401, try refresh token once, then retry
 *   3. If refresh fails, clear tokens and send user to /login
 */

import axios from 'axios'

// VITE_API_URL comes from .env (e.g. http://localhost:8000/api)
// import.meta.env is Vite's way to read env vars that start with VITE_
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const client = axios.create({
  baseURL: API_BASE,
  // Do NOT set Content-Type globally — FormData uploads need multipart boundary
})

// ── REQUEST INTERCEPTOR ──────────────────────────────────────────────────
// Runs BEFORE every request leaves the browser
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    // JWT standard header format
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────
// Runs AFTER every response — catches expired access tokens
let isRefreshing = false
let pendingQueue = []

function processQueue(error, token = null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  pendingQueue = []
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only try refresh once per request, and only on 401
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Wait for the in-flight refresh to finish
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return client(original)
        })
      }

      original._retry = true
      isRefreshing = true
      const refresh = localStorage.getItem('refresh_token')

      if (!refresh) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Call refresh endpoint WITHOUT going through this interceptor loop
        const { data } = await axios.post(`${API_BASE}/auth/refresh/`, {
          refresh,
        })
        localStorage.setItem('access_token', data.access)
        processQueue(null, data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return client(original)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default client
