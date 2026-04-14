"use client"

import { useEffect, useState } from 'react'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductGrid } from '@/components/products/ProductGrid'
import type { Product } from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'
import { normalizeId, resolveProductCategoryNormId } from '@/lib/catalogIds'

interface ProductsPageClientProps {
    initialCategory?: string
}

export function ProductsPageClient({ initialCategory }: ProductsPageClientProps) {
    const [selectedCategory, setSelectedCategory] = useState(normalizeId(initialCategory))
    const [selectedUsage, setSelectedUsage] = useState('all')
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<{ id: string, label: string }[]>([{ id: 'all', label: 'Tous les produits' }])
    const [usages, setUsages] = useState<{ id: string, label: string }[]>([{ id: 'all', label: 'Tous usages' }])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            const [{ data, error }, { data: catData }, { data: usageData }] = await Promise.all([
                supabase
                    .from('produits')
                    .select('*, categories(id, label), _ProductUsages(usages(id))')
                    .order('created_at', { ascending: false }),
                supabase.from('categories').select('*').order('label'),
                supabase.from('usages').select('*').order('label'),
            ])

            const catRows = (catData ?? []) as { id: string; label: string }[]

            if (catRows.length) {
                setCategories([
                    { id: 'all', label: 'Tous les produits' },
                    ...catRows.map((cat) => ({
                        id: normalizeId(cat.id),
                        label: cat.label,
                    })),
                ])
            }

            if (!error && data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedProducts: Product[] = data.map((item: any) => {
                    const j = item.categories
                    const labelFromJoin = Array.isArray(j) ? j[0]?.label : j?.label
                    return {
                        id: item.id,
                        name: item.name,
                        category: labelFromJoin || item.category_id,
                        categoryId: resolveProductCategoryNormId(item.category_id, item.categories, catRows),
                        dimensions: item.dimensions,
                        packaging: item.packaging,
                        price: item.price,
                        priceUnit: item.price_unit,
                        customizable: item.customizable,
                        usage: item._ProductUsages?.map((u: { usages: { id: string } }) => u.usages.id) || [],
                        description: item.description,
                        image_url: item.image_url,
                    }
                })
                setProducts(formattedProducts)
            }

            if (usageData) setUsages([{ id: 'all', label: 'Tous usages' }, ...usageData])

            setLoading(false)
        }

        fetchProducts()
    }, [])

    const filteredProducts = products.filter((product) => {
        if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) return false
        if (selectedUsage !== 'all' && !product.usage.includes(selectedUsage)) return false
        return true
    })

    return (
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
                onCategoryChange={(category) => setSelectedCategory(normalizeId(category))}
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
    )
}
