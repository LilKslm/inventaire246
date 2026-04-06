import { useState } from 'react'
import AppShell from './components/layout/AppShell.jsx'
import UpdateNotification from './components/layout/UpdateNotification.jsx'
import UpdateBanner from './components/layout/UpdateBanner.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import ReturnPage from './pages/ReturnPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

const PAGES = { CHECKOUT: 'checkout', RETURN: 'return', ADMIN: 'admin' }

export default function App() {
  const [activePage, setActivePage] = useState(PAGES.CHECKOUT)

  return (
    <div className="min-h-screen bg-apple-gray font-sans flex flex-col">
      <AppShell activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 pb-16 sm:pb-0">
        {activePage === PAGES.CHECKOUT && <CheckoutPage />}
        {activePage === PAGES.RETURN   && <ReturnPage />}
        {activePage === PAGES.ADMIN    && <AdminPage />}
      </main>
      <footer className="text-center pt-8 pb-20 sm:pb-6 text-xs italic text-gray-400">
        Fait par Chef Khalil 2026
      </footer>
      <UpdateNotification />
      <UpdateBanner />
    </div>
  )
}
