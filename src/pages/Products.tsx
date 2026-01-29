import { useNavigate, useLocation } from '@tanstack/react-router'
import { useMemo, useCallback } from 'react'
import { ProductFilters } from '@/components/products/ProductFilters'
import { ProductGrid } from '@/components/products/ProductGrid'
import { filterProducts } from '@/data/products'

function parseSearch(searchStr: string): { category: string; usage: string } {
  const params = new URLSearchParams(searchStr)
  return {
    category: params.get('category') ?? 'all',
    usage: params.get('usage') ?? 'all',
  }
}

export function Products() {
  const navigate = useNavigate()
  const location = useLocation()
  const { category, usage } = useMemo(
    () => parseSearch(location.search),
    [location.search]
  )

  const products = useMemo(
    () => filterProducts(category, usage),
    [category, usage]
  )

  const setCategory = useCallback(
    (value: string) => {
      navigate({
        to: '/produits',
        search: { category: value, usage },
      })
    },
    [navigate, usage]
  )
  const setUsage = useCallback(
    (value: string) => {
      navigate({
        to: '/produits',
        search: { category, usage: value },
      })
    },
    [navigate, category]
  )

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mb-2">
            Catalogue produits
          </h1>
          <p className="font-sans text-muted">
            Emballages alimentaires professionnels. Prix en CHF HT.
          </p>
        </div>
        <ProductFilters
          selectedCategory={category}
          selectedUsage={usage}
          onCategoryChange={setCategory}
          onUsageChange={setUsage}
        />
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
