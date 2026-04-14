import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CategoriesPageClient } from '@/components/categories/CategoriesPageClient'

export default function CategoriesPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col pt-20">
            <Navbar />
            <CategoriesPageClient />
            <Footer />
        </main>
    )
}
