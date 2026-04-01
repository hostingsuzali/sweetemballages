"use client"
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Loader2, Workflow } from 'lucide-react'

interface Usage {
    id: string;
    label: string;
}

export default function UsagesAdminPage() {
    const [usages, setUsages] = useState<Usage[]>([])
    const [loading, setLoading] = useState(true)
    const [newLabel, setNewLabel] = useState('')
    const [saving, setSaving] = useState(false)

    const toSlug = (value: string) =>
        value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

    const getUniqueUsageId = async (label: string) => {
        const baseSlug = toSlug(label) || `usage-${Date.now()}`
        let candidate = baseSlug
        let counter = 2

        while (true) {
            const { data, error } = await supabase
                .from('usages')
                .select('id')
                .eq('id', candidate)
                .maybeSingle()

            if (error) throw error
            if (!data) return candidate

            candidate = `${baseSlug}-${counter}`
            counter += 1
        }
    }

    const loadUsages = useCallback(async () => {
        const { data, error } = await supabase
            .from('usages')
            .select('*')
            .order('label')

        if (!error && data) {
            setUsages(data)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        const init = async () => {
            await loadUsages()
        }
        init()
    }, [loadUsages])

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newLabel.trim()) return

        setSaving(true)
        try {
            const usageId = await getUniqueUsageId(newLabel.trim())
            const { error } = await supabase
                .from('usages')
                .insert([{ id: usageId, label: newLabel.trim() }])

            if (error) {
                alert(`Erreur: ${error.message}`)
            } else {
                setNewLabel('')
                loadUsages()
            }
        } catch (err) {
            const e = err as Error
            alert(`Erreur: ${e.message}`)
        }
        setSaving(false)
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet usage ?')) return

        const { error } = await supabase
            .from('usages')
            .delete()
            .eq('id', id)

        if (error) {
            alert(`Erreur: ${error.message} (Assurez-vous qu'aucun produit n'est lié à cet usage)`)
        } else {
            loadUsages()
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-3xl font-bold text-charcoal flex items-center gap-3">
                    <Workflow className="w-8 h-8 text-kraft" /> Usages
                </h1>
                <p className="font-sans text-muted mt-1">Gérez les usages associés aux produits</p>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-6 mb-8">
                <h2 className="font-heading text-xl font-bold text-charcoal mb-4">Ajouter un usage</h2>
                <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-charcoal mb-2 font-sans">
                            Label (ex: Fruits & légumes)
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
                            {usages.map((usage) => (
                                <tr key={usage.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6 font-heading font-medium text-charcoal">
                                        {usage.label}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <button
                                            onClick={() => handleDelete(usage.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                            title="Supprimer"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
