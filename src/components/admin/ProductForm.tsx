"use client"
import { useState, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Upload, Loader2, Save } from 'lucide-react'
import { getProductImageUrl } from '@/lib/storage'

interface CategoryOption {
    id: string
    label: string
}

interface UsageOption {
    id: string
    label: string
}

export interface ProductFormData {
    id: string
    name: string
    category: string
    dimensions: string
    packaging: string
    price: number
    price_unit: string
    customizable: boolean
    usage: string[]
    description: string
    image_url: string
    category_id?: string
}

interface ProductFormProps {
    initialData?: ProductFormData | null
    onClose: () => void
    onSuccess: () => void
}

export function ProductForm({ initialData, onClose, onSuccess }: ProductFormProps) {
    const isEdit = !!initialData

    const toSlug = (value: string) =>
        value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

    const getUniqueProductId = async (baseValue: string) => {
        const baseSlug = toSlug(baseValue) || `produit-${Date.now()}`
        let candidate = baseSlug
        let counter = 2

        while (true) {
            const { data, error } = await supabase
                .from('produits')
                .select('id')
                .eq('id', candidate)
                .maybeSingle()

            if (error) throw error
            if (!data) return candidate

            candidate = `${baseSlug}-${counter}`
            counter += 1
        }
    }

    const [formData, setFormData] = useState<ProductFormData>(initialData || {
        id: '',
        name: '',
        category: '',
        dimensions: '',
        packaging: '',
        price: 0,
        price_unit: '',
        customizable: false,
        usage: [],
        description: '',
        image_url: '',
        category_id: ''
    })

    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [categories, setCategories] = useState<CategoryOption[]>([])
    const [usageOptions, setUsageOptions] = useState<UsageOption[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const loadLookups = async () => {
            const [catRes, usageRes] = await Promise.all([
                supabase.from('categories').select('id, label').order('label'),
                supabase.from('usages').select('id, label').order('label'),
            ])
            if (!catRes.error && catRes.data) setCategories(catRes.data)
            if (!usageRes.error && usageRes.data) setUsageOptions(usageRes.data)
        }
        loadLookups()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        const { name, value, type } = target
        let parsedValue: string | number | boolean = value

        if (type === 'number') {
            parsedValue = value === '' ? '' : parseFloat(value)
        }

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else {
            setFormData(prev => ({ ...prev, [name]: parsedValue }))
        }
    }

    const toggleUsage = (usageId: string) => {
        setFormData(prev => ({
            ...prev,
            usage: prev.usage.includes(usageId)
                ? prev.usage.filter(id => id !== usageId)
                : [...prev.usage, usageId],
        }))
    }

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            setError(null)

            if (!event.target.files || event.target.files.length === 0) {
                return
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()

            // Use product ID as filename (with fallback to timestamp for new products without ID yet).
            // upsert: true means re-uploading for the same product will OVERWRITE the existing file
            // instead of creating a duplicate.
            const baseId = formData.id || `new-${Date.now()}`
            const filePath = `${baseId}.${fileExt}`

            // If there's an existing image that has a different filename (e.g. old random name),
            // delete the old file first to avoid orphaned files.
            if (formData.image_url && formData.image_url !== filePath) {
                const oldPath = formData.image_url
                if (!oldPath.startsWith('http') && !oldPath.startsWith('/')) {
                    await supabase.storage.from('sweetemballage').remove([oldPath])
                }
            }

            const { error: uploadError } = await supabase.storage
                .from('sweetemballage')
                .upload(filePath, file, { upsert: true })

            if (uploadError) {
                throw uploadError
            }

            setFormData(prev => ({ ...prev, image_url: filePath }))
        } catch (error) {
            const err = error as Error
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            const productId = isEdit
                ? formData.id
                : await getUniqueProductId(formData.name.trim())

            if (!productId) {
                throw new Error('Veuillez renseigner un ID produit valide.')
            }

            const produitPayload = {
                id: productId,
                name: formData.name,
                category_id: formData.category_id || formData.category,
                dimensions: formData.dimensions,
                packaging: formData.packaging,
                price: formData.price,
                price_unit: formData.price_unit,
                customizable: formData.customizable,
                description: formData.description,
                image_url: formData.image_url
            }

            if (isEdit) {
                const { error: updateError } = await supabase
                    .from('produits')
                    .update(produitPayload)
                    .eq('id', formData.id)

                if (updateError) throw updateError
            } else {
                const { error: insertError } = await supabase
                    .from('produits')
                    .insert([produitPayload])

                if (insertError) throw insertError
            }

            // Sync usages relations
            await supabase.from('_ProductUsages').delete().eq('A', productId)

            if (formData.usage && formData.usage.length > 0) {
                const validIds = new Set(usageOptions.map(u => u.id))
                const usageIds =
                    usageOptions.length > 0
                        ? formData.usage.filter(id => validIds.has(id))
                        : formData.usage
                const usagesData = usageIds.map(uId => ({ A: productId, B: uId }))
                const { error: usageError } = await supabase.from('_ProductUsages').insert(usagesData)
                if (usageError) throw usageError
            }

            onSuccess()
        } catch (err) {
            const error = err as Error
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="font-heading text-2xl font-bold text-charcoal">
                        {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                            {formData.image_url ? (
                                <div className="relative w-full max-w-xs aspect-4/3">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={getProductImageUrl(formData.image_url)} alt="Product" className="w-full h-full object-cover rounded-xl" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center w-full">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-kraft hover:text-kraft-hover px-3 py-2 border border-border">
                                            <span>Télécharger une image</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={uploadImage} disabled={uploading} ref={fileInputRef} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        PNG, JPG jusqu&apos;à 5MB
                                    </p>
                                    {uploading && <p className="text-sm mt-3 animate-pulse text-kraft">Téléchargement en cours...</p>}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-charcoal mb-2">Nom du produit</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none" />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-charcoal mb-2">Catégorie</label>
                                <select
                                    name="category_id"
                                    value={formData.category_id || formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none transition-all text-sm bg-white font-sans text-charcoal appearance-none"
                                    required
                                >
                                    <option value="" disabled>Sélectionner une catégorie</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-charcoal mb-2">Dimensions</label>
                                <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none" />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-charcoal mb-2">Conditionnement</label>
                                <input type="text" name="packaging" value={formData.packaging} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none" placeholder="Lot de 50.." />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-charcoal mb-2">Prix (HT)</label>
                                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none" />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-charcoal mb-2">Unité de Prix</label>
                                <input type="text" name="price_unit" value={formData.price_unit} onChange={handleChange} required className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none" placeholder="/ carton" />
                            </div>

                            <div className="col-span-2">
                                <span className="block text-sm font-medium text-charcoal mb-2">Usages</span>
                                {usageOptions.length === 0 ? (
                                    <p className="text-sm text-muted">Aucun usage en base. Créez-en dans Administration → Usages.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-3">
                                        {usageOptions.map((u) => (
                                            <label key={u.id} className="inline-flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.usage.includes(u.id)}
                                                    onChange={() => toggleUsage(u.id)}
                                                    className="w-4 h-4 text-kraft border-border rounded focus:ring-kraft bg-white cursor-pointer"
                                                />
                                                <span>{u.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label className="flex items-center space-x-3 text-sm font-medium text-charcoal mb-2">
                                    <input type="checkbox" name="customizable" checked={formData.customizable} onChange={handleChange} className="w-5 h-5 text-kraft border-border rounded focus:ring-kraft bg-white cursor-pointer" />
                                    <span>Produit Personnalisable</span>
                                </label>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-charcoal mb-2">Description / Détails</label>
                                <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={4} className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none resize-none"></textarea>
                            </div>

                        </div>

                        <div className="pt-6 border-t border-border flex justify-end space-x-4">
                            <button type="button" onClick={onClose} className="px-6 py-3 font-medium text-muted hover:bg-gray-100 rounded-xl transition-colors">
                                Annuler
                            </button>
                            <button type="submit" disabled={saving || uploading} className="px-6 py-3 bg-kraft hover:bg-kraft-hover text-white rounded-xl font-medium transition-colors flex items-center space-x-2 disabled:opacity-50">
                                {saving ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /><span>Enregistrement...</span></>
                                ) : (
                                    <><Save className="w-5 h-5" /><span>Enregistrer</span></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
