import { Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function RootLayout() {
  return (
    <>
      <a
        href="#main"
        className="block absolute left-[-9999px] top-4 z-[100] px-4 py-2 bg-kraft text-white rounded-lg font-sans font-medium focus:left-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-kraft"
      >
        Aller au contenu principal
      </a>
      <Navbar />
      <main id="main" className="min-h-screen pt-16 lg:pt-20" role="main">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" richColors />
    </>
  )
}
