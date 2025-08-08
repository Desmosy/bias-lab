import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="container py-12 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}