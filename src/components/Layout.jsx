/** Layout — navbar + page content + footer */

import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t-2 border-ink bg-ink px-4 py-6 text-center text-xs uppercase tracking-widest text-paper/60">
        ToolPool — borrow from your block, not the big box store
      </footer>
    </div>
  )
}
