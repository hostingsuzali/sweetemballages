"use client"
import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductGrid } from '@/components/products/ProductGrid'
import type { Product } from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [selectedUsage, setSelectedUsage] = useState('all')
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<{ id: string, label: string }[]>([{ id: 'all', label: 'Tous les produits' }])
    const [usages, setUsages] = useState<{ id: string, label: string }[]>([{ id: 'all', label: 'Tous usages' }])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase
                .from('produits')
                .select('*, categories(label), _ProductUsages(usages(id))')
                .order('created_at', { ascending: false })

            if (!error && data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedProducts: Product[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: item.categories?.label || item.category_id,
                    categoryId: item.category_id,
                    dimensions: item.dimensions,
                    packaging: item.packaging,
                    price: item.price,
                    priceUnit: item.price_unit,
                    customizable: item.customizable,
                    usage: item._ProductUsages?.map((u: { usages: { id: string } }) => u.usages.id) || [],
                    description: item.description,
                    image_url: item.image_url
                }))
                setProducts(formattedProducts)
            }

            // Fetch categories
            const { data: catData } = await supabase.from('categories').select('*').order('label')
            if (catData) setCategories([{ id: 'all', label: 'Tous les produits' }, ...catData])

            // Fetch usages
            const { data: usageData } = await supabase.from('usages').select('*').order('label')
            if (usageData) setUsages([{ id: 'all', label: 'Tous usages' }, ...usageData])

            setLoading(false)
        }

        fetchProducts()
    }, [])

    const filteredProducts = products.filter(product => {
        if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) return false;
        if (selectedUsage !== 'all' && !product.usage.includes(selectedUsage)) return false;
        return true
    })

    return (
        <main className="min-h-screen bg-background flex flex-col pt-20">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
                <span className="font-sans text-sm font-semibold text-kraft uppercase tracking-wider block mb-2">
                    Le Catalogue Complet
                </span>
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-charcoal leading-tight mb-8">
                    Notre Gamme de Produits
                </h1>

                <ProductFilters
                    categories={categories}
                    usages={usages}
                    selectedCategory={selectedCategory}
                    selectedUsage={selectedUsage}
                    onCategoryChange={setSelectedCategory}
                    onUsageChange={setSelectedUsage}
                />

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kraft"></div>
                    </div>
                ) : (
                    <ProductGrid products={filteredProducts} />
                )}
            </div>

            <Footer />
        </main>
    )
}
