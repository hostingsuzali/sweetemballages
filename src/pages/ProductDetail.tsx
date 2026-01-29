import { Link, useParams } from '@tanstack/react-router'
import { getProductById } from '@/data/products'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const categoryLabels: Record<string, string> = {
  'pizza-snacking': 'Emballages Pizza & Snacking',
  'barquettes-plats': 'Barquettes & Plats à Emporter',
  'sacherie-transport': 'Sacherie & Transport',
  'boucherie-conservation': 'Boucherie & Conservation',
  'boissons-consommables': 'Boissons & Consommables',
}

export function ProductDetail() {
  const { productId } = useParams({ strict: false })
  const product = productId ? getProductById(productId) : undefined

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold text-charcoal mb-4">
          Produit introuvable
        </h1>
        <Link to="/produits">
          <Button variant="primary">Retour au catalogue</Button>
        </Link>
      </div>
    )
  }

  const categoryLabel = categoryLabels[product.category] ?? product.category

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Visual */}
          <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-kraft/10 to-border-neutral flex items-center justify-center">
            <div className="w-32 h-32 bg-kraft/20 rounded-xl" />
          </div>

          {/* Content */}
          <div>
            <span className="font-sans text-sm font-medium text-kraft uppercase tracking-wider">
              {categoryLabel}
            </span>
            {product.customizable && (
              <Badge variant="green" className="ml-2 font-sans text-xs">
                Personnalisable
              </Badge>
            )}
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mt-2 mb-6">
              {product.name}
            </h1>

            {/* Specs */}
            <div className="bg-white rounded-xl border border-border-neutral p-6 mb-6">
              <h2 className="font-heading text-lg font-bold text-charcoal mb-4">
                Caractéristiques
              </h2>
              <table className="w-full font-sans text-sm">
                <tbody>
                  <tr className="border-b border-border-neutral">
                    <td className="py-3 text-muted">Dimensions</td>
                    <td className="py-3 font-medium text-charcoal text-right">
                      {product.dimensions}
                    </td>
                  </tr>
                  <tr className="border-b border-border-neutral">
                    <td className="py-3 text-muted">Conditionnement</td>
                    <td className="py-3 font-medium text-charcoal text-right">
                      {product.packaging}
                    </td>
                  </tr>
                  {product.minOrderQty != null && (
                    <tr>
                      <td className="py-3 text-muted">Quantité minimum</td>
                      <td className="py-3 font-medium text-charcoal text-right">
                        {product.minOrderQty} pièces
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-border-neutral p-6 mb-6">
              <h2 className="font-heading text-lg font-bold text-charcoal mb-4">
                Tarif
              </h2>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-heading text-3xl font-bold text-charcoal">
                  CHF {product.price.toFixed(2)}
                </span>
                <span className="font-sans text-muted">
                  {product.priceUnit} HT
                </span>
              </div>
              {product.customizable && (
                <p className="font-sans text-sm text-muted">
                  Avec logo : +30%
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button variant="primary" size="default" className="w-full sm:w-auto">
                  Demander un devis
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" size="default" className="w-full sm:w-auto">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
