import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductsPageClient } from '@/components/products/ProductsPageClient'

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>
}) {
    const params = await searchParams
    return (
        <main className="min-h-screen bg-background flex flex-col pt-20">
            <Navbar />

            <ProductsPageClient initialCategory={params.category} />

            <Footer />
        </main>
    )
}
