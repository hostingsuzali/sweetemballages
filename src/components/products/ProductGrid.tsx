import { ProductCard } from './ProductCard'
import { motion } from 'motion/react'
import { Package } from 'lucide-react'
import type { Product } from '@/data/products'

interface ProductGridProps {
  products: Product[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16"
      >
        <div className="w-16 h-16 bg-border-neutral rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 text-muted" />
        </div>
        <h3 className="font-heading text-xl font-bold text-charcoal mb-2">
          Aucun produit trouvé
        </h3>
        <p className="font-sans text-muted">
          Essayez de modifier vos filtres pour voir plus de résultats.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
}
