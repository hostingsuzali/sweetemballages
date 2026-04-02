"use client"

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, LayoutGrid } from 'lucide-react'
import { ProductGrid } from '@/components/products/ProductGrid'
import type { Product } from '@/components/products/ProductCard'
import { supabase } from '@/lib/supabase'
import { normalizeId } from '@/lib/catalogIds'
import { FadeIn } from '@/components/ui/Animations'

export function CategoriesPageClient() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<{ id: string; label: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('produits')
                .select('*, categories(label), _ProductUsages(usages(id))')
                .order('created_at', { ascending: false })

            if (!error && data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formatted: Product[] = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    category: item.categories?.label || item.category_id,
                    categoryId: normalizeId(item.category_id),
                    dimensions: item.dimensions,
                    packaging: item.packaging,
                    price: item.price,
                    priceUnit: item.price_unit,
                    customizable: item.customizable,
                    usage: item._ProductUsages?.map((u: { usages: { id: string } }) => u.usages.id) || [],
                    description: item.description,
                    image_url: item.image_url,
                }))
                setProducts(formatted)
            }

            const { data: catData } = await supabase.from('categories').select('*').order('label')
            if (catData) {
                setCategories(
                    catData.map((cat: { id: string; label: string }) => ({
                        ...cat,
                        id: normalizeId(cat.id),
                    })),
                )
            }

            setLoading(false)
        }

        fetchData()
    }, [])

    const productsByCategory = useMemo(() => {
        const map = new Map<string, Product[]>()
        for (const p of products) {
            const key = p.categoryId || 'other'
            const list = map.get(key) ?? []
            list.push(p)
            map.set(key, list)
        }
        return map
    }, [products])

    return (
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
                <div>
                    <span className="font-sans text-sm font-semibold text-kraft uppercase tracking-wider block mb-2">
                        Parcourir par univers
                    </span>
                    <h1 className="font-heading text-4xl sm:text-5xl font-bold text-charcoal leading-tight mb-4">
                        Nos catégories
                    </h1>
                    <p className="font-sans text-muted max-w-2xl leading-relaxed">
                        Chaque famille de produits regroupe nos références. Utilisez les raccourcis ci-dessous pour
                        aller directement à une section, ou ouvrez le catalogue complet pour filtrer par usage.
                    </p>
                </div>
                <Link
                    href="/produits"
                    className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-charcoal bg-white border border-border px-5 py-3 rounded-xl hover:border-kraft hover:text-kraft transition-colors shrink-0"
                >
                    <LayoutGrid className="w-4 h-4" />
                    Catalogue produits (filtres)
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kraft" />
                </div>
            ) : (
                <>
                    <FadeIn className="mb-14">
                        <p className="font-sans text-xs font-semibold text-muted uppercase tracking-wider mb-4">
                            Accès rapide
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((cat) => (
                                <a
                                    key={cat.id}
                                    href={`#cat-${cat.id}`}
                                    className="font-sans text-sm px-4 py-2 rounded-full border border-border bg-white text-charcoal hover:border-kraft hover:bg-kraft/5 transition-colors"
                                >
                                    {cat.label}
                                </a>
                            ))}
                        </div>
                    </FadeIn>

                    <div className="space-y-20 lg:space-y-24">
                        {categories.map((cat) => {
                            const sectionProducts = productsByCategory.get(cat.id) ?? []
                            const anchor = `cat-${cat.id}`

                            return (
                                <section
                                    key={cat.id}
                                    id={anchor}
                                    className="scroll-mt-28 border-t border-border pt-12 first:border-t-0 first:pt-0"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                                        <div>
                                            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal mb-2">
                                                {cat.label}
                                            </h2>
                                            <p className="font-sans text-sm text-muted">
                                                {sectionProducts.length}{' '}
                                                {sectionProducts.length === 1 ? 'référence' : 'références'}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/produits?category=${encodeURIComponent(cat.id)}`}
                                            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-kraft hover:text-charcoal transition-colors"
                                        >
                                            Voir uniquement cette catégorie
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    {sectionProducts.length === 0 ? (
                                        <p className="font-sans text-muted text-sm py-8 px-4 rounded-xl bg-white border border-border border-dashed">
                                            Aucun produit dans cette catégorie pour le moment.
                                        </p>
                                    ) : (
                                        <div className="rounded-2xl border border-border/80 bg-white/60 p-4 sm:p-6">
                                            <ProductGrid products={sectionProducts} variant="nested" />
                                        </div>
                                    )}
                                </section>
                            )
                        })}
                    </div>

                    {categories.length === 0 && !loading && (
                        <p className="font-sans text-muted text-center py-16">
                            Aucune catégorie configurée. Ajoutez-en depuis l&apos;administration.
                        </p>
                    )}
                </>
            )}
        </div>
    )
}
