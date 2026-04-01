import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { getProductImageUrl } from '@/lib/storage'

const categoryLabels: Record<string, string> = {
    'snacks': 'Pizza & Snacking',
    'plats-emporter': 'Plats a Emporter & Barquettes',
    'sacs-sacherie': 'Sacs & Sacherie',
    'hygiene-emballages': 'Hygiène & Emballage',
    'gob-vais-jet': 'Gobelets & Vaisselle Jetable',
}

export default async function ProductDetail({
    params
}: {
    params: Promise<{ productId: string }>
}) {
    const resolvedParams = await params
    const { productId } = resolvedParams

    const { data: productData } = await supabase
        .from('produits')
        .select('*, categories(label)')
        .eq('id', productId)
        .single()

    const product = productData ? {
        id: productData.id,
        name: productData.name,
        category: productData.category_id,
        dimensions: productData.dimensions,
        packaging: productData.packaging,
        price: productData.price,
        priceUnit: productData.price_unit,
        customizable: productData.customizable,
        minOrderQty: productData.min_order_qty,
        image_url: productData.image_url,
    } : undefined

    if (!product) {
        return (
            <div className="min-h-screen bg-background flex flex-col pt-20">
                <Navbar />
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center flex flex-col items-center justify-center">
                    <h1 className="font-heading text-2xl font-bold text-charcoal mb-4">
                        Produit introuvable
                    </h1>
                    <Link href="/produits">
                        <Button variant="primary">Retour au catalogue</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    const categoryLabel = categoryLabels[product.category] ?? product.category

    return (
        <div className="bg-background min-h-screen flex flex-col pt-20">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Visual */}
                    <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-kraft/10 to-border flex items-center justify-center p-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={getProductImageUrl(product.image_url ?? null)}
                            alt={product.name}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <span className="font-sans text-sm font-medium text-kraft uppercase tracking-wider">
                            {categoryLabel}
                        </span>
                        {product.customizable && (
                            <Badge className="ml-2 bg-green text-white hover:bg-[#4a724a]">
                                Personnalisable
                            </Badge>
                        )}
                        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mt-2 mb-6">
                            {product.name}
                        </h1>

                        {/* Specs */}
                        <div className="bg-white rounded-xl border border-border p-6 mb-6">
                            <h2 className="font-heading text-lg font-bold text-charcoal mb-4">
                                Caractéristiques
                            </h2>
                            <table className="w-full font-sans text-sm">
                                <tbody>
                                    <tr className="border-b border-border">
                                        <td className="py-3 text-muted">Dimensions</td>
                                        <td className="py-3 font-medium text-charcoal text-right">
                                            {product.dimensions}
                                        </td>
                                    </tr>
                                    <tr className="border-b border-border">
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
                        <div className="bg-white rounded-xl border border-border p-6 mb-6">
                            <h2 className="font-heading text-lg font-bold text-charcoal mb-4">
                                Tarif
                            </h2>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-heading text-3xl font-bold text-charcoal">
                                    CHF {product.price.toFixed(2)}
                                </span>
                                <span className="font-sans text-muted">
                                    {product.priceUnit === 'pièce' ? '/ pièce' : `/ ${product.priceUnit}`} HT
                                </span>
                            </div>
                            {product.customizable && (
                                <p className="font-sans text-sm text-muted">
                                    Avec logo : sur devis
                                </p>
                            )}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/devis" className="w-full sm:w-auto">
                                <Button variant="primary" className="w-full sm:w-auto">
                                    Demander un devis
                                </Button>
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto">
                                    Nous contacter
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
