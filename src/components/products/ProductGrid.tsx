"use client"
import { ProductCard, type Product } from './ProductCard'
import { Package } from 'lucide-react'
import { FadeIn } from '@/components/ui/Animations'

interface ProductGridProps {
    products: Product[]
    /** Slightly denser grid for category sub-sections */
    variant?: 'default' | 'nested'
}

export function ProductGrid({ products, variant = 'default' }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <FadeIn className="text-center py-16">
                <div className="w-16 h-16 bg-border rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-muted" />
                </div>
                <h3 className="font-heading text-xl font-bold text-charcoal mb-2">
                    Aucun produit trouvé
                </h3>
                <p className="font-sans text-muted">
                    Essayez de modifier vos filtres pour voir plus de résultats.
                </p>
            </FadeIn>
        )
    }

    const gridClass =
        variant === 'nested'
            ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch'
            : 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch'

    return (
        <div className={gridClass}>
            {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
            ))}
        </div>
    )
}
