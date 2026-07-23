/**
 * ═══════════════════════════════════════════════════════════════════════════
 * App.jsx — React Router route table
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/Layout'
import AdminCategories from './pages/AdminCategories'
import AdminRentals from './pages/AdminRentals'
import BorrowerDashboard from './pages/BorrowerDashboard'
import BrowseTools from './pages/BrowseTools'
import Home from './pages/Home'
import LenderDashboard from './pages/LenderDashboard'
import ListTool from './pages/ListTool'
import Login from './pages/Login'
import Register from './pages/Register'
import ToolDetail from './pages/ToolDetail'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* Auth required — browse also needs JWT because API defaults to IsAuthenticated */}
            <Route element={<ProtectedRoute />}>
              <Route path="browse" element={<BrowseTools />} />
              <Route path="tools/:id" element={<ToolDetail />} />
              <Route path="tools/new" element={<ListTool />} />
              <Route path="dashboard" element={<BorrowerDashboard />} />
              <Route path="lender" element={<LenderDashboard />} />
            </Route>

            {/* Admin only */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="admin/categories" element={<AdminCategories />} />
              <Route path="admin/rentals" element={<AdminRentals />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
