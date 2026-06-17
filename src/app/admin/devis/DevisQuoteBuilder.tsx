"use client"
import { useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { computeInvoiceTotals, INVOICE_VAT_RATE, type InvoiceLineItem } from '@/lib/invoice'
import { X, Plus, Trash2, Save, Loader2 } from 'lucide-react'

export interface DevisRow {
    id: string
    devis_number: string
    demande_devis_id: string | null
    company_name: string
    email: string
    billing_address: string | null
    issue_date: string
    valid_until: string
    line_items: InvoiceLineItem[]
    notes: string | null
    subtotal: number
    vat_rate: number
    vat_amount: number
    total: number
    status: string
    sent_at: string | null
    converted_facture_id: string | null
    created_at: string
}

interface DevisQuoteBuilderProps {
    demandeDevisId?: string
    initial?: DevisRow | null
    defaultCompanyName?: string
    defaultEmail?: string
    defaultLineItems?: InvoiceLineItem[]
    onSaved: (devis: DevisRow) => void
    onClose: () => void
}

function toInputDate(date = new Date()) {
    return date.toISOString().slice(0, 10)
}

async function nextDevisNumber() {
    const year = new Date().getFullYear()
    const prefix = `DEV-${year}-`
    const { data } = await supabase
        .from('devis')
        .select('devis_number')
        .like('devis_number', `${prefix}%`)
        .order('devis_number', { ascending: false })
        .limit(1)
    const current = (data?.[0]?.devis_number as string | undefined) ?? `${prefix}0000`
    const last = Number(current.split('-').at(-1) ?? '0')
    return `${prefix}${String(last + 1).padStart(4, '0')}`
}

export function DevisQuoteBuilder({
    demandeDevisId,
    initial,
    defaultCompanyName,
    defaultEmail,
    defaultLineItems,
    onSaved,
    onClose,
}: DevisQuoteBuilderProps) {
    const isEdit = !!initial
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        companyName: initial?.company_name ?? defaultCompanyName ?? '',
        email: initial?.email ?? defaultEmail ?? '',
        billingAddress: initial?.billing_address ?? '',
        issueDate: initial?.issue_date?.slice(0, 10) ?? toInputDate(),
        validUntil: initial?.valid_until?.slice(0, 10) ?? toInputDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
        notes: initial?.notes ?? '',
        lineItems: (initial?.line_items?.length ? initial.line_items : defaultLineItems?.length ? defaultLineItems : [{ description: '', quantity: 1, unitPrice: 0 }]) as InvoiceLineItem[],
    })

    const totals = useMemo(() => computeInvoiceTotals(form.lineItems), [form.lineItems])

    const updateLine = (index: number, patch: Partial<InvoiceLineItem>) => {
        setForm((p) => ({
            ...p,
            lineItems: p.lineItems.map((li, i) => (i === index ? { ...li, ...patch } : li)),
        }))
    }

    const handleSave = async () => {
        setError(null)
        if (!form.companyName || !form.email || form.lineItems.length === 0) {
            setError('Entreprise, email et au moins une ligne sont requis.')
            return
        }

        setSaving(true)
        try {
            const { subtotal, vatAmount, total } = totals
            const basePayload = {
                company_name: form.companyName,
                email: form.email,
                billing_address: form.billingAddress || null,
                issue_date: form.issueDate,
                valid_until: form.validUntil,
                line_items: form.lineItems,
                notes: form.notes || null,
                subtotal,
                vat_rate: INVOICE_VAT_RATE,
                vat_amount: vatAmount,
                total,
            }

            if (isEdit && initial) {
                const { data, error: updateError } = await supabase
                    .from('devis')
                    .update(basePayload)
                    .eq('id', initial.id)
                    .select()
                    .single()
                if (updateError) throw updateError
                onSaved(data as DevisRow)
            } else {
                const devisNumber = await nextDevisNumber()
                const { data, error: insertError } = await supabase
                    .from('devis')
                    .insert([
                        {
                            devis_number: devisNumber,
                            demande_devis_id: demandeDevisId ?? null,
                            status: 'draft',
                            ...basePayload,
                        },
                    ])
                    .select()
                    .single()
                if (insertError) throw insertError
                onSaved(data as DevisRow)
            }
        } catch (err) {
            const e = err as Error
            setError(e.message || "Échec de l'enregistrement du devis")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full overflow-y-auto animate-in slide-in-from-right duration-300">
                <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex justify-between items-center z-10">
                    <h2 className="font-heading text-2xl font-bold text-charcoal">
                        {isEdit ? `Modifier le devis ${initial?.devis_number}` : 'Nouveau devis'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-sans text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-3">
                        <input
                            className="border border-border rounded-xl p-2"
                            placeholder="Entreprise"
                            value={form.companyName}
                            onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                        />
                        <input
                            className="border border-border rounded-xl p-2"
                            placeholder="Email client"
                            value={form.email}
                            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        />
                        <div className="space-y-1">
                            <label className="text-xs text-muted font-sans">Date d&apos;émission</label>
                            <input
                                type="date"
                                className="border border-border rounded-xl p-2 w-full"
                                value={form.issueDate}
                                onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-muted font-sans">Validité jusqu&apos;au</label>
                            <input
                                type="date"
                                className="border border-border rounded-xl p-2 w-full"
                                value={form.validUntil}
                                onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))}
                            />
                        </div>
                    </div>

                    <textarea
                        className="border border-border rounded-xl p-2 w-full min-h-20"
                        placeholder="Adresse de facturation (requise pour convertir en facture)"
                        value={form.billingAddress}
                        onChange={(e) => setForm((p) => ({ ...p, billingAddress: e.target.value }))}
                    />

                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Lignes</h3>
                        {form.lineItems.map((line, index) => (
                            <div key={index} className="grid md:grid-cols-[1fr_90px_110px_40px] gap-2">
                                <input
                                    className="border border-border rounded-xl p-2"
                                    placeholder="Description"
                                    value={line.description}
                                    onChange={(e) => updateLine(index, { description: e.target.value })}
                                />
                                <input
                                    type="number"
                                    className="border border-border rounded-xl p-2"
                                    value={line.quantity}
                                    onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    className="border border-border rounded-xl p-2"
                                    value={line.unitPrice}
                                    onChange={(e) => updateLine(index, { unitPrice: Number(e.target.value) })}
                                />
                                <button
                                    className="rounded-xl border border-border hover:bg-gray-50"
                                    onClick={() =>
                                        setForm((p) => ({ ...p, lineItems: p.lineItems.filter((_, i) => i !== index) }))
                                    }
                                >
                                    <Trash2 className="w-4 h-4 mx-auto" />
                                </button>
                            </div>
                        ))}
                        <button
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm"
                            onClick={() =>
                                setForm((p) => ({
                                    ...p,
                                    lineItems: [...p.lineItems, { description: '', quantity: 1, unitPrice: 0 }],
                                }))
                            }
                        >
                            <Plus className="w-4 h-4" /> Ajouter ligne
                        </button>
                    </div>

                    <textarea
                        className="border border-border rounded-xl p-2 w-full min-h-16"
                        placeholder="Notes"
                        value={form.notes}
                        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                    />

                    <div className="font-sans text-sm text-charcoal">
                        Sous-total: CHF {totals.subtotal.toFixed(2)} | TVA{' '}
                        {(INVOICE_VAT_RATE * 100).toFixed(1).replace('.', ',')} %: CHF {totals.vatAmount.toFixed(2)} | Total
                        TTC: CHF {totals.total.toFixed(2)}
                    </div>

                    <button
                        disabled={saving}
                        onClick={() => void handleSave()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-kraft text-white hover:bg-[#b09268] disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isEdit ? 'Enregistrer' : 'Créer le devis'}
                    </button>
                </div>
            </div>
        </div>
    )
}
