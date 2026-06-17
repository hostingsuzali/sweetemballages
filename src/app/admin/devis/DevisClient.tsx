"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import {
    FileText, Mail, Phone, Building2, Clock, CheckCheck, Trash2, Eye, RefreshCw,
    Package, FilePlus, Send, ArrowRightCircle, Loader2,
} from 'lucide-react'
import { DevisQuoteBuilder, type DevisRow } from './DevisQuoteBuilder'
import type { InvoiceLineItem } from '@/lib/invoice'

interface RequestedItem {
    productId: string
    name: string
    quantity: number
    unitPriceSnapshot: number
}

interface DemandeDevisRow {
    id: string
    company_name: string
    email: string
    phone: string | null
    message: string | null
    items: RequestedItem[] | null
    is_read: boolean
    created_at: string
}

interface DevisClientProps {
    devis: DemandeDevisRow[]
    devisQuotes: DevisRow[]
    error?: string
}

function formatDate(dateStr: string) {
    return new Intl.DateTimeFormat('fr-CH', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateStr))
}

const STATUS_LABEL: Record<string, string> = {
    draft: 'Brouillon',
    sent: 'Envoyé',
    accepted: 'Accepté',
    declined: 'Refusé',
    converted: 'Converti en facture',
}

const STATUS_STYLE: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
    sent: 'bg-blue-100 text-blue-700 border-blue-200',
    accepted: 'bg-green-100 text-green-700 border-green-200',
    declined: 'bg-red-100 text-red-700 border-red-200',
    converted: 'bg-kraft/10 text-kraft border-kraft/30',
}

export function DevisClient({ devis: initial, devisQuotes: initialQuotes, error }: DevisClientProps) {
    const [devis, setDevis] = useState<DemandeDevisRow[]>(initial)
    const [devisQuotes, setDevisQuotes] = useState<DevisRow[]>(initialQuotes)
    const [selected, setSelected] = useState<DemandeDevisRow | null>(null)
    const [loading, setLoading] = useState(false)
    const [hasNewItem, setHasNewItem] = useState(false)
    const [builderOpen, setBuilderOpen] = useState(false)
    const [editingQuote, setEditingQuote] = useState<DevisRow | null>(null)
    const [sendingId, setSendingId] = useState<string | null>(null)
    const [convertingId, setConvertingId] = useState<string | null>(null)

    const unreadCount = devis.filter((d) => !d.is_read).length

    const markAsRead = async (id: string) => {
        await supabase
            .from('demandes_devis')
            .update({ is_read: true })
            .eq('id', id)
        setDevis((prev) =>
            prev.map((d) => (d.id === id ? { ...d, is_read: true } : d))
        )
        if (selected?.id === id) setSelected((s) => s ? { ...s, is_read: true } : s)
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Supprimer cette demande de devis ?')) return
        await supabase.from('demandes_devis').delete().eq('id', id)
        setDevis((prev) => prev.filter((d) => d.id !== id))
        if (selected?.id === id) setSelected(null)
    }

    const handleOpen = async (item: DemandeDevisRow) => {
        setSelected(item)
        if (!item.is_read) await markAsRead(item.id)
    }

    const refresh = async () => {
        setLoading(true)
        const [{ data }, { data: quotes }] = await Promise.all([
            supabase.from('demandes_devis').select('*').order('created_at', { ascending: false }),
            supabase.from('devis').select('*').order('created_at', { ascending: false }),
        ])
        if (data) setDevis(data)
        if (quotes) setDevisQuotes(quotes)
        setLoading(false)
    }

    useEffect(() => {
        void refresh()

        const channel = supabase
            .channel('admin-devis-live')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'demandes_devis' },
                (payload) => {
                    const newDevis = payload.new as DemandeDevisRow
                    setDevis((prev) => {
                        const withoutDuplicate = prev.filter((d) => d.id !== newDevis.id)
                        return [newDevis, ...withoutDuplicate]
                    })
                    setHasNewItem(true)
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'demandes_devis' },
                (payload) => {
                    const updated = payload.new as DemandeDevisRow
                    setDevis((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
                    setSelected((prev) => (prev?.id === updated.id ? updated : prev))
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'demandes_devis' },
                (payload) => {
                    const deletedId = String(payload.old.id)
                    setDevis((prev) => prev.filter((d) => d.id !== deletedId))
                    setSelected((prev) => (prev?.id === deletedId ? null : prev))
                }
            )
            .subscribe()

        return () => {
            void supabase.removeChannel(channel)
        }
    }, [])

    const linkedQuote = (demandeDevisId: string) =>
        devisQuotes.find((q) => q.demande_devis_id === demandeDevisId) ?? null

    const handleQuoteSaved = (quote: DevisRow) => {
        setDevisQuotes((prev) => {
            const without = prev.filter((q) => q.id !== quote.id)
            return [quote, ...without]
        })
        setBuilderOpen(false)
        setEditingQuote(null)
        toast.success(editingQuote ? 'Devis mis à jour' : 'Devis créé', {
            description: `${quote.devis_number} — CHF ${Number(quote.total).toFixed(2)}`,
        })
    }

    const handleSendQuote = async (quote: DevisRow) => {
        setSendingId(quote.id)
        try {
            const res = await fetch('/api/devis-quotes/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: quote.id,
                    devisNumber: quote.devis_number,
                    companyName: quote.company_name,
                    email: quote.email,
                    billingAddress: quote.billing_address,
                    issueDate: quote.issue_date,
                    validUntil: quote.valid_until,
                    lineItems: quote.line_items,
                    notes: quote.notes,
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || "Échec de l'envoi")
            toast.success('Devis envoyé par email')
            await refresh()
        } catch (err) {
            toast.error("Échec de l'envoi du devis", { description: (err as Error).message })
        } finally {
            setSendingId(null)
        }
    }

    const handleConvert = async (quote: DevisRow) => {
        if (!quote.billing_address || !quote.billing_address.trim()) {
            toast.error('Adresse de facturation requise', {
                description: 'Modifiez le devis pour ajouter une adresse avant de le convertir.',
            })
            return
        }
        setConvertingId(quote.id)
        try {
            const res = await fetch('/api/devis-quotes/convert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ devisId: quote.id }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Échec de la conversion')
            toast.success('Devis converti en facture', {
                description: `Facture ${data.invoiceNumber} créée en brouillon — rendez-vous dans Factures pour l'envoyer.`,
            })
            await refresh()
        } catch (err) {
            toast.error('Échec de la conversion', { description: (err as Error).message })
        } finally {
            setConvertingId(null)
        }
    }

    const openBuilderForRequest = (item: DemandeDevisRow) => {
        setEditingQuote(null)
        setBuilderOpen(true)
        setSelected(item)
    }

    const openBuilderForQuote = (quote: DevisRow) => {
        setEditingQuote(quote)
        setBuilderOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-charcoal flex items-center gap-3">
                        <FileText className="w-8 h-8 text-kraft" />
                        Demandes de Devis
                    </h1>
                    <p className="font-sans text-muted mt-1">
                        {unreadCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                                <strong className="text-charcoal">{unreadCount}</strong> non traitée{unreadCount > 1 ? 's' : ''}
                            </span>
                        ) : (
                            'Toutes les demandes traitées'
                        )}
                    </p>
                    {hasNewItem && (
                        <p className="font-sans text-xs text-amber-700 mt-1">
                            Nouvelle demande reçue
                        </p>
                    )}
                </div>
                <button
                    onClick={() => {
                        setHasNewItem(false)
                        void refresh()
                    }}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white hover:bg-gray-50 text-charcoal font-medium text-sm transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-sans text-sm">
                    ⚠️ Erreur de chargement : {error}. Vérifiez que la table <code>demandes_devis</code> existe dans Supabase.
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Devis List */}
                <div className="lg:col-span-2 space-y-2">
                    {devis.length === 0 && !error ? (
                        <div className="bg-white rounded-2xl border border-border p-12 text-center text-muted font-sans">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            Aucune demande reçue
                        </div>
                    ) : (
                        devis.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleOpen(item)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === item.id
                                    ? 'border-kraft bg-kraft/5 shadow-sm'
                                    : 'border-border bg-white hover:border-kraft/40 hover:bg-gray-50/50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.is_read ? 'bg-gray-200' : 'bg-amber-500'}`} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`font-heading text-sm truncate ${item.is_read ? 'text-charcoal font-medium' : 'text-charcoal font-bold'}`}>
                                                {item.company_name}
                                            </span>
                                            {!item.is_read && (
                                                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                                    NOUVEAU
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted font-sans truncate mt-0.5">{item.email}</div>
                                        <div className="text-xs text-gray-400 font-sans mt-1 line-clamp-1">
                                            {item.items?.length
                                                ? `${item.items.length} produit${item.items.length > 1 ? 's' : ''} demandé${item.items.length > 1 ? 's' : ''}`
                                                : (item.message ?? 'Ancienne demande sans produits sélectionnés')}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(item.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Devis Detail */}
                <div className="lg:col-span-3">
                    {selected ? (
                        <div className="bg-white rounded-2xl border border-border p-6 space-y-6 sticky top-6">
                            {/* Detail Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-heading text-xl font-bold text-charcoal">{selected.company_name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        {selected.is_read ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
                                                <CheckCheck className="w-3 h-3" /> Traité
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                                                <Eye className="w-3 h-3" /> En attente
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400 font-sans">{formatDate(selected.created_at)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!selected.is_read && (
                                        <button
                                            onClick={() => markAsRead(selected.id)}
                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Marquer comme traité"
                                        >
                                            <CheckCheck className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(selected.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid sm:grid-cols-2 gap-3">
                                <a
                                    href={`mailto:${selected.email}`}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-border hover:border-kraft/40 transition-colors group"
                                >
                                    <Mail className="w-4 h-4 text-kraft flex-shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-xs text-muted">Email</div>
                                        <div className="text-sm font-medium text-charcoal group-hover:text-kraft transition-colors truncate">{selected.email}</div>
                                    </div>
                                </a>
                                {selected.phone && (
                                    <a
                                        href={`tel:${selected.phone}`}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-border hover:border-kraft/40 transition-colors group"
                                    >
                                        <Phone className="w-4 h-4 text-kraft flex-shrink-0" />
                                        <div>
                                            <div className="text-xs text-muted">Téléphone</div>
                                            <div className="text-sm font-medium text-charcoal group-hover:text-kraft transition-colors">{selected.phone}</div>
                                        </div>
                                    </a>
                                )}
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-border">
                                    <Building2 className="w-4 h-4 text-kraft flex-shrink-0" />
                                    <div>
                                        <div className="text-xs text-muted">Entreprise</div>
                                        <div className="text-sm font-medium text-charcoal">{selected.company_name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Requested products */}
                            <div>
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                    <Package className="w-3.5 h-3.5" /> Produits demandés
                                </h3>
                                {selected.items?.length ? (
                                    <div className="bg-gray-50 rounded-xl border border-border divide-y divide-border">
                                        {selected.items.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm">
                                                <span className="text-charcoal font-medium">{item.name}</span>
                                                <span className="text-muted font-sans">
                                                    × {item.quantity} — CHF {(item.unitPriceSnapshot * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-xl border border-border p-4 font-sans text-muted text-sm">
                                        Ancienne demande sans produits sélectionnés.
                                    </div>
                                )}
                            </div>

                            {/* Notes / message */}
                            {selected.message && (
                                <div>
                                    <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Notes complémentaires</h3>
                                    <div className="bg-gray-50 rounded-xl border border-border p-4 font-sans text-charcoal text-sm leading-relaxed whitespace-pre-wrap">
                                        {selected.message}
                                    </div>
                                </div>
                            )}

                            {/* Linked Devis / actions */}
                            <div>
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Devis chiffré</h3>
                                {(() => {
                                    const quote = linkedQuote(selected.id)
                                    if (!quote) {
                                        return (
                                            <button
                                                onClick={() => openBuilderForRequest(selected)}
                                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-kraft text-white hover:bg-[#b09268] font-medium text-sm transition-colors"
                                            >
                                                <FilePlus className="w-4 h-4" /> Créer un devis
                                            </button>
                                        )
                                    }
                                    return (
                                        <div className="bg-gray-50 rounded-xl border border-border p-4 space-y-3">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div>
                                                    <span className="font-heading font-bold text-charcoal">{quote.devis_number}</span>
                                                    <span className="ml-2 text-sm text-muted">CHF {Number(quote.total).toFixed(2)}</span>
                                                </div>
                                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${STATUS_STYLE[quote.status] ?? STATUS_STYLE.draft}`}>
                                                    {STATUS_LABEL[quote.status] ?? quote.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => openBuilderForQuote(quote)}
                                                    className="px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-gray-100 text-sm font-medium"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    disabled={sendingId === quote.id}
                                                    onClick={() => void handleSendQuote(quote)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white hover:bg-gray-100 text-sm font-medium disabled:opacity-50"
                                                >
                                                    {sendingId === quote.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                                    Envoyer PDF par mail
                                                </button>
                                                {quote.status !== 'converted' && (
                                                    <button
                                                        disabled={convertingId === quote.id}
                                                        onClick={() => void handleConvert(quote)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal text-white hover:bg-charcoal/90 text-sm font-medium disabled:opacity-50"
                                                    >
                                                        {convertingId === quote.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRightCircle className="w-3.5 h-3.5" />}
                                                        Convertir en facture
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })()}
                            </div>

                            {/* Quick Reply */}
                            <a
                                href={`mailto:${selected.email}?subject=Re: Demande de devis - Sweet Emballages`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-border hover:bg-gray-50 text-charcoal font-medium transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Répondre par email
                            </a>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-border p-16 text-center text-muted font-sans">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                            <p className="text-sm">Sélectionnez une demande pour la consulter</p>
                        </div>
                    )}
                </div>
            </div>

            {builderOpen && (
                <DevisQuoteBuilder
                    demandeDevisId={editingQuote ? undefined : selected?.id}
                    initial={editingQuote}
                    defaultCompanyName={selected?.company_name}
                    defaultEmail={selected?.email}
                    defaultLineItems={
                        !editingQuote && selected?.items?.length
                            ? selected.items.map<InvoiceLineItem>((item) => ({
                                  description: item.name,
                                  quantity: item.quantity,
                                  unitPrice: item.unitPriceSnapshot,
                              }))
                            : undefined
                    }
                    onSaved={handleQuoteSaved}
                    onClose={() => {
                        setBuilderOpen(false)
                        setEditingQuote(null)
                    }}
                />
            )}
        </div>
    )
}
