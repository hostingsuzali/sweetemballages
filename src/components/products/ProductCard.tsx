import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Badge } from '@/components/ui/Badge'
import type { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
  index?: number
}

const categoryLabels: Record<string, string> = {
  pizza: 'Boîtes à pizza',
  sacs: 'Sacs alimentaires',
  gobelets: 'Gobelets & vaisselle',
  papier: 'Papier & aluminium',
  repas: 'Boîtes repas & salades',
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const categoryLabel = categoryLabels[product.category] ?? product.category
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to="/produits/$productId"
        params={{ productId: product.id }}
        className="group block bg-white rounded-xl border border-border-neutral hover:border-kraft hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-kraft/10 to-border-neutral relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-kraft/20 rounded-lg transform group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.customizable && (
              <Badge variant="green" className="font-sans text-xs">
                Personnalisable
              </Badge>
            )}
          </div>
        </div>
        <div className="p-5">
          <span className="font-sans text-xs font-medium text-kraft uppercase tracking-wider">
            {categoryLabel}
          </span>
          <h3 className="font-heading text-lg font-bold text-charcoal mt-1 mb-3 group-hover:text-kraft transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center py-1.5 border-b border-border-neutral">
              <span className="font-sans text-sm text-muted">Dimensions</span>
              <span className="font-sans text-sm font-medium text-charcoal">
                {product.dimensions}
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-border-neutral">
              <span className="font-sans text-sm text-muted">
                Conditionnement
              </span>
              <span className="font-sans text-sm font-medium text-charcoal">
                {product.packaging}
              </span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="font-heading text-2xl font-bold text-charcoal">
                CHF {product.price.toFixed(2)}
              </span>
              <span className="font-sans text-sm text-muted ml-1">
                {product.priceUnit}
              </span>
            </div>
            <span className="font-sans text-xs text-muted">HT</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
