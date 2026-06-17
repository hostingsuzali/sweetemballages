"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getProductImageUrl } from '@/lib/storage'
import { Search, Plus, Minus, Trash2, Loader2 } from 'lucide-react'

export interface SelectedItem {
    productId: string
    name: string
    quantity: number
    unitPriceSnapshot: number
}

interface CatalogProduct {
    id: string
    name: string
    price: number
    price_unit: string
    image_url: string | null
}

interface ProductPickerProps {
    value: SelectedItem[]
    onChange: (items: SelectedItem[]) => void
}

export function ProductPicker({ value, onChange }: ProductPickerProps) {
    const [products, setProducts] = useState<CatalogProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await supabase
                .from('produits')
                .select('id, name, price, price_unit, image_url')
                .order('name', { ascending: true })
            if (data) setProducts(data as CatalogProduct[])
            setLoading(false)
        }
        void fetchProducts()
    }, [])

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    const addProduct = (product: CatalogProduct) => {
        const existing = value.find((item) => item.productId === product.id)
        if (existing) {
            onChange(
                value.map((item) =>
                    item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                )
            )
        } else {
            onChange([
                ...value,
                {
                    productId: product.id,
                    name: product.name,
                    quantity: 1,
                    unitPriceSnapshot: product.price,
                },
            ])
        }
    }

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return
        onChange(value.map((item) => (item.productId === productId ? { ...item, quantity } : item)))
    }

    const removeItem = (productId: string) => {
        onChange(value.filter((item) => item.productId !== productId))
    }

    return (
        <div className="space-y-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher un produit…"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none transition-all"
                />
            </div>

            <div className="max-h-56 overflow-y-auto border border-border rounded-xl divide-y divide-border bg-white">
                {loading ? (
                    <div className="p-6 flex justify-center">
                        <Loader2 className="w-5 h-5 animate-spin text-kraft" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-4 text-sm text-muted font-sans text-center">Aucun produit trouvé.</div>
                ) : (
                    filtered.map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => addProduct(product)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getProductImageUrl(product.image_url)}
                                alt=""
                                className="w-9 h-9 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-charcoal truncate">{product.name}</div>
                                <div className="text-xs text-muted">
                                    CHF {Number(product.price).toFixed(2)} {product.price_unit}
                                </div>
                            </div>
                            <Plus className="w-4 h-4 text-kraft flex-shrink-0" />
                        </button>
                    ))
                )}
            </div>

            {value.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">Votre sélection</p>
                    <div className="border border-border rounded-xl divide-y divide-border bg-background">
                        {value.map((item) => (
                            <div key={item.productId} className="flex items-center gap-2 px-3 py-2">
                                <span className="text-sm text-charcoal font-medium flex-1 truncate">{item.name}</span>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                        className="p-1 rounded-md border border-border hover:bg-gray-100"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                        className="p-1 rounded-md border border-border hover:bg-gray-100"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.productId)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
