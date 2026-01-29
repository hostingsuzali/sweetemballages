import { motion } from 'motion/react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CATEGORIES, USAGES } from '@/data/products'

interface ProductFiltersProps {
  selectedCategory: string
  selectedUsage: string
  onCategoryChange: (category: string) => void
  onUsageChange: (usage: string) => void
}

export function ProductFilters({
  selectedCategory,
  selectedUsage,
  onCategoryChange,
  onUsageChange,
}: ProductFiltersProps) {
  const hasActiveFilters = selectedCategory !== 'all' || selectedUsage !== 'all'

  const clearFilters = () => {
    onCategoryChange('all')
    onUsageChange('all')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-border-neutral p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-kraft" />
          <h3 className="font-heading text-lg font-bold text-charcoal">
            Filtres
          </h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted hover:text-charcoal"
          >
            <X className="w-4 h-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>
      <div className="mb-6">
        <label className="font-sans text-sm font-medium text-muted mb-3 block">
          Catégorie
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`font-sans text-sm px-4 py-2 rounded-lg border transition-all ${
                selectedCategory === cat.id
                  ? 'bg-charcoal text-white border-charcoal'
                  : 'bg-white text-muted border-border-neutral hover:border-kraft'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="font-sans text-sm font-medium text-muted mb-3 block">
          Usage
        </label>
        <div className="flex flex-wrap gap-2">
          {USAGES.map((usage) => (
            <button
              key={usage.id}
              type="button"
              onClick={() => onUsageChange(usage.id)}
              className={`font-sans text-sm px-4 py-2 rounded-lg border transition-all ${
                selectedUsage === usage.id
                  ? 'bg-kraft text-white border-kraft'
                  : 'bg-white text-muted border-border-neutral hover:border-kraft'
              }`}
            >
              {usage.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
