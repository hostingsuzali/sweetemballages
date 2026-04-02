"use client"
import { useEffect, useState, useCallback, Fragment } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Loader2, Tags, X, ChevronRight, ChevronDown, ExternalLink } from 'lucide-react'

interface Category {
    id: string
    label: string
}

interface ProductRef {
    id: string
    name: string
}

export default function CategoriesAdminPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [newLabel, setNewLabel] = useState('')
    const [saving, setSaving] = useState(false)
    const [deleteModal, setDeleteModal] = useState<{ categoryId: string; categoryLabel: string; productCount: number } | null>(null)
    const [deleteMode, setDeleteMode] = useState<'reassign' | 'delete_all'>('reassign')
    const [reassignToId, setReassignToId] = useState('')
    const [deleting, setDeleting] = useState(false)
    const [productsByCategory, setProductsByCategory] = useState<Record<string, ProductRef[]>>({})
    const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)

    const toSlug = (value: string) =>
        value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

    const getUniqueCategoryId = async (label: string) => {
        const baseSlug = toSlug(label) || `categorie-${Date.now()}`
        let candidate = baseSlug
        let counter = 2

        while (true) {
            const { data, error } = await supabase
                .from('categories')
                .select('id')
                .eq('id', candidate)
                .maybeSingle()

            if (error) throw error
            if (!data) return candidate

            candidate = `${baseSlug}-${counter}`
            counter += 1
        }
    }

    const loadCategories = useCallback(async () => {
        const [{ data, error }, { data: prodRows, error: prodErr }] = await Promise.all([
            supabase.from('categories').select('*').order('label'),
            supabase.from('produits').select('id, name, category_id').order('name'),
        ])

        if (!error && data) {
            setCategories(data)
        }

        if (!prodErr && prodRows) {
            const map: Record<string, ProductRef[]> = {}
            for (const row of prodRows as { id: string; name: string; category_id: string | null }[]) {
                const key = row.category_id ?? ''
                if (!map[key]) map[key] = []
                map[key].push({ id: row.id, name: row.name })
            }
            setProductsByCategory(map)
        } else {
            setProductsByCategory({})
        }

        setLoading(false)
    }, [])

    useEffect(() => {
        const init = async () => {
            await loadCategories()
        }
        init()
    }, [loadCategories])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newLabel.trim()) return

        setSaving(true)
        const categoryId = await getUniqueCategoryId(newLabel.trim())
        const { error } = await supabase
            .from('categories')
            .insert([{ id: categoryId, label: newLabel.trim() }])

        if (error) {
            alert(`Erreur: ${error.message}`)
        } else {
            setNewLabel('')
            loadCategories()
        }
        setSaving(false)
    }

    const handleDeleteClick = async (cat: Category) => {
        const { count, error: countError } = await supabase
            .from('produits')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', cat.id)

        if (countError) {
            alert(`Erreur: ${countError.message}`)
            return
        }

        const productCount = count ?? 0
        if (productCount === 0) {
            if (!window.confirm(`Supprimer la catégorie « ${cat.label } » ?`)) return
            const { error } = await supabase.from('categories').delete().eq('id', cat.id)
            if (error) alert(`Erreur: ${error.message}`)
            else loadCategories()
            return
        }

        setDeleteModal({ categoryId: cat.id, categoryLabel: cat.label, productCount })
        setReassignToId(categories.filter(c => c.id !== cat.id)[0]?.id ?? '')
        setDeleteMode('reassign')
    }

    const handleReassignAndDelete = async () => {
        if (!deleteModal || !reassignToId) return
        setDeleting(true)
        try {
            const { error: updateError } = await supabase
                .from('produits')
                .update({ category_id: reassignToId })
                .eq('category_id', deleteModal.categoryId)
            if (updateError) throw updateError

            const { error: deleteError } = await supabase
                .from('categories')
                .delete()
                .eq('id', deleteModal.categoryId)
            if (deleteError) throw deleteError

            setDeleteModal(null)
            loadCategories()
        } catch (err) {
            const e = err as Error
            alert(`Erreur: ${e.message}`)
        } finally {
            setDeleting(false)
        }
    }

    const handleDeleteCategoryAndProducts = async () => {
        if (!deleteModal) return
        if (!window.confirm(`Supprimer la catégorie « ${deleteModal.categoryLabel} » et les ${deleteModal.productCount} produit(s) associé(s) ? Cette action est irréversible.`)) return
        setDeleting(true)
        try {
            const { data: products } = await supabase
                .from('produits')
                .select('id, image_url')
                .eq('category_id', deleteModal.categoryId)
            const ids = (products ?? []).map(p => p.id)
            const imagePaths = (products ?? []).map(p => p.image_url).filter((url): url is string => !!url)

            for (const url of imagePaths) {
                const pathParts = url.split('/')
                const fileName = pathParts[pathParts.length - 1]
                await supabase.storage.from('sweetemballage').remove([fileName])
            }
            if (ids.length > 0) {
                await supabase.from('_ProductUsages').delete().in('A', ids)
                const { error: prodErr } = await supabase.from('produits').delete().eq('category_id', deleteModal.categoryId)
                if (prodErr) throw prodErr
            }
            const { error: catErr } = await supabase.from('categories').delete().eq('id', deleteModal.categoryId)
            if (catErr) throw catErr

            setDeleteModal(null)
            loadCategories()
        } catch (err) {
            const e = err as Error
            alert(`Erreur: ${e.message}`)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-charcoal flex items-center gap-3">
                    <Tags className="w-8 h-8 text-kraft" /> Catégories
                </h1>
                <p className="font-sans text-muted mt-1">Gérez les catégories de produits</p>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-6 mb-8">
                <h2 className="font-heading text-xl font-bold text-charcoal mb-4">Ajouter une catégorie</h2>
                <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-charcoal mb-2 font-sans">
                            Label (ex: Emballages Pizza)
                        </label>
                        <input
                            type="text"
                            value={newLabel}
                            onChange={(e) => setNewLabel(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none transition-all text-sm font-sans"
                            placeholder="Nom affiché"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 h-[42px] bg-kraft hover:bg-kraft-hover text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                        <span>Ajouter</span>
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-kraft" />
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-border text-sm font-semibold text-muted font-sans">
                                <th className="p-4 pl-6">Label</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {categories.map((cat) => {
                                const products = productsByCategory[cat.id] ?? []
                                const count = products.length
                                const isOpen = expandedCategoryId === cat.id

                                return (
                                    <Fragment key={cat.id}>
                                        <tr className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 pl-6 font-heading font-medium text-charcoal">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedCategoryId(isOpen ? null : cat.id)}
                                                        className="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-gray-100 transition-colors"
                                                        aria-expanded={isOpen}
                                                        title={count ? 'Afficher les produits' : 'Aucun produit'}
                                                    >
                                                        {count > 0 ? (
                                                            isOpen ? (
                                                                <ChevronDown className="w-5 h-5" />
                                                            ) : (
                                                                <ChevronRight className="w-5 h-5" />
                                                            )
                                                        ) : (
                                                            <span className="inline-block w-5 h-5" />
                                                        )}
                                                    </button>
                                                    <span>{cat.label}</span>
                                                    <span className="font-sans text-xs font-semibold text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {count} produit{count === 1 ? '' : 's'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteClick(cat)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                        {isOpen && count > 0 && (
                                            <tr className="bg-gray-50/80">
                                                <td colSpan={2} className="px-4 py-3 pl-14 pr-6 border-t border-border/60">
                                                    <ul className="space-y-2 font-sans text-sm text-charcoal">
                                                        {products.map((p) => (
                                                            <li
                                                                key={p.id}
                                                                className="flex items-center justify-between gap-3 py-1 border-b border-border/40 last:border-0"
                                                            >
                                                                <span className="truncate">{p.name}</span>
                                                                <Link
                                                                    href={`/produits/${p.id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-kraft hover:text-charcoal"
                                                                >
                                                                    Voir
                                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <p className="mt-3 text-xs text-muted font-sans">
                                                        Gérez les fiches depuis la page{' '}
                                                        <Link href="/admin" className="text-kraft font-semibold hover:underline">
                                                            Produits
                                                        </Link>
                                                        .
                                                    </p>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal : réassigner les produits ou tout supprimer */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-heading text-xl font-bold text-charcoal">Catégorie utilisée par des produits</h3>
                            <button onClick={() => setDeleteModal(null)} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="font-sans text-muted mb-4">
                            <strong>{deleteModal.productCount}</strong> produit(s) utilisent la catégorie « {deleteModal.categoryLabel} ». Que souhaitez-vous faire ?
                        </p>

                        <div className="space-y-3 mb-6">
                            <label className="flex items-start gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-gray-50/50 has-[:checked]:border-kraft has-[:checked]:bg-kraft/5">
                                <input type="radio" name="deleteMode" value="reassign" checked={deleteMode === 'reassign'} onChange={() => setDeleteMode('reassign')} className="mt-1 text-kraft focus:ring-kraft" />
                                <span className="font-sans text-sm text-charcoal">Réassigner les produits vers une autre catégorie, puis supprimer la catégorie</span>
                            </label>
                            <label className="flex items-start gap-3 p-3 border border-border rounded-xl cursor-pointer hover:bg-gray-50/50 has-[:checked]:border-kraft has-[:checked]:bg-kraft/5">
                                <input type="radio" name="deleteMode" value="delete_all" checked={deleteMode === 'delete_all'} onChange={() => setDeleteMode('delete_all')} className="mt-1 text-kraft focus:ring-kraft" />
                                <span className="font-sans text-sm text-charcoal">Supprimer la catégorie et tous les produits associés (irréversible)</span>
                            </label>
                        </div>

                        {deleteMode === 'reassign' && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-charcoal mb-2 font-sans">Réassigner vers</label>
                                <select
                                    value={reassignToId}
                                    onChange={(e) => setReassignToId(e.target.value)}
                                    className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none text-sm font-sans"
                                >
                                    {categories.filter(c => c.id !== deleteModal.categoryId).map((c) => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                                {categories.filter(c => c.id !== deleteModal.categoryId).length === 0 && (
                                    <p className="mt-2 text-sm text-amber-600 font-sans">Créez d’abord une autre catégorie pour pouvoir réassigner les produits.</p>
                                )}
                            </div>
                        )}

                        {deleteMode === 'delete_all' && (
                            <p className="mb-6 text-sm text-red-600 font-sans bg-red-50 border border-red-100 rounded-xl p-3">
                                Les {deleteModal.productCount} produit(s) et leurs images seront définitivement supprimés.
                            </p>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setDeleteModal(null)}
                                className="px-4 py-2 font-medium text-muted hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Annuler
                            </button>
                            {deleteMode === 'reassign' ? (
                                <button
                                    type="button"
                                    onClick={handleReassignAndDelete}
                                    disabled={deleting || !reassignToId}
                                    className="px-4 py-2 bg-kraft hover:bg-[#b09268] text-white font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                    Réassigner et supprimer
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleDeleteCategoryAndProducts}
                                    disabled={deleting}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                    Tout supprimer
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
