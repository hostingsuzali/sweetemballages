"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit2, Trash2, Search, Loader2 } from 'lucide-react'
import { ProductForm, ProductFormData } from '@/components/admin/ProductForm'
import { getProductImageUrl } from '@/lib/storage'

export default function AdminDashboard() {
    const [products, setProducts] = useState<ProductFormData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null)

    const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('produits')
            .select('*, categories(label), _ProductUsages(usages(id))')
            .order('created_at', { ascending: false })

        if (!error && data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedProducts: ProductFormData[] = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                category: item.categories?.label || item.category_id,
                dimensions: item.dimensions,
                packaging: item.packaging,
                price: item.price,
                price_unit: item.price_unit,
                customizable: item.customizable,
                usage: item._ProductUsages?.map((u: { usages: { id: string } }) => u.usages.id) || [],
                description: item.description,
                image_url: item.image_url,
                category_id: item.category_id
            }))
            setProducts(formattedProducts)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleDelete = async (id: string, imageUrl: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

        try {
            // If there's an image, attempt to delete it
            if (imageUrl) {
                const pathParts = imageUrl.split('/')
                const fileName = pathParts[pathParts.length - 1]
                await supabase.storage.from('sweetemballage').remove([fileName])
            }

            const { error } = await supabase
                .from('produits')
                .delete()
                .eq('id', id)

            if (error) throw error

            fetchProducts()
        } catch (error) {
            const err = error as Error
            alert(`Erreur: ${err.message}`)
        }
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-charcoal">Catalogue Produits</h1>
                    <p className="font-sans text-muted mt-1">Gérez l&apos;inventaire et les fiches produits</p>
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setIsFormOpen(true) }}
                    className="flex items-center space-x-2 px-6 py-3 bg-kraft hover:bg-[#b09268] text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un produit</span>
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex items-center bg-gray-50/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom ou catégorie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none transition-all text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-kraft" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-border text-sm font-medium text-muted font-sans font-semibold">
                                    <th className="p-4 pl-6">Produit</th>
                                    <th className="p-4">Catégorie</th>
                                    <th className="p-4">Prix</th>
                                    <th className="p-4">Statut</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 border border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                    {product.image_url ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={getProductImageUrl(product.image_url)} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-gray-400 text-xs text-center font-medium">No<br />Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-heading font-medium text-charcoal line-clamp-1 group-hover:text-kraft transition-colors">
                                                        {product.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-sans text-sm text-muted">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full">{product.category}</span>
                                        </td>
                                        <td className="p-4 font-sans font-medium text-charcoal">
                                            CHF {Number(product.price).toFixed(2)}
                                            <span className="text-xs text-muted ml-1 font-normal">{product.price_unit}</span>
                                        </td>
                                        <td className="p-4">
                                            {product.customizable ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    Personnalisable
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                    Standard
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 pr-6 text-right space-x-2">
                                            <button
                                                onClick={() => { setEditingProduct(product); setIsFormOpen(true) }}
                                                className="p-2 text-gray-400 hover:text-kraft hover:bg-kraft/10 rounded-lg transition-colors inline-block"
                                                title="Modifier"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id, product.image_url)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                                title="Supprimer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            Aucun produit trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isFormOpen && (
                <ProductForm
                    initialData={editingProduct}
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={() => {
                        setIsFormOpen(false)
                        fetchProducts()
                    }}
                />
            )}
        </div>
    )
}
