"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, Phone, Mail, MapPin, Save } from 'lucide-react'
import type { ContactInfoData } from '@/lib/contact-info'

const defaultForm: ContactInfoData = {
  phone: '076 504 10 69',
  phoneHours: 'Lun–ven, 8h–18h',
  email: 'contact@sweetemballages.ch',
  emailResponseTime: 'Réponse sous 24h ouvrées',
  addressLine1: 'Route de la Venoge 2',
  addressLine2: '1302 Vufflens-la-Ville',
  addressCountry: 'Suisse',
}

export default function AdminContactPage() {
  const [form, setForm] = useState<ContactInfoData>(defaultForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    const fetchContact = async () => {
      const { data } = await supabase
        .from('contact_info')
        .select('phone, phone_hours, email, email_response_time, address_line1, address_line2, address_country')
        .eq('id', 'default')
        .maybeSingle()

      if (data) {
        setForm({
          phone: data.phone ?? defaultForm.phone,
          phoneHours: data.phone_hours ?? defaultForm.phoneHours,
          email: data.email ?? defaultForm.email,
          emailResponseTime: data.email_response_time ?? defaultForm.emailResponseTime,
          addressLine1: data.address_line1 ?? defaultForm.addressLine1,
          addressLine2: data.address_line2 ?? defaultForm.addressLine2,
          addressCountry: data.address_country ?? defaultForm.addressCountry,
        })
      }
      setLoading(false)
    }
    fetchContact()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    const { error } = await supabase
      .from('contact_info')
      .upsert(
        {
          id: 'default',
          phone: form.phone || null,
          phone_hours: form.phoneHours || null,
          email: form.email || null,
          email_response_time: form.emailResponseTime || null,
          address_line1: form.addressLine1 || null,
          address_line2: form.addressLine2 || null,
          address_country: form.addressCountry || null,
        },
        { onConflict: 'id' }
      )

    setSaving(false)
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Informations de contact enregistrées.' })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-kraft" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-heading text-3xl font-bold text-charcoal flex items-center gap-3">
          <Phone className="w-8 h-8 text-kraft" /> Infos contact
        </h1>
        <p className="font-sans text-muted mt-1">
          Ces informations sont affichées sur la page Contact et dans le pied de page du site.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-xl px-4 py-3 font-sans text-sm ${
            message.type === 'success' ? 'bg-green/10 text-green' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2 font-sans">Téléphone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none font-sans"
              placeholder="076 504 10 69"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2 font-sans">Horaires (téléphone)</label>
            <input
              type="text"
              value={form.phoneHours}
              onChange={(e) => setForm((f) => ({ ...f, phoneHours: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none font-sans"
              placeholder="Lun–ven, 8h–18h"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2 font-sans">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none font-sans"
              placeholder="contact@sweetemballages.ch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2 font-sans">Délai de réponse (email)</label>
            <input
              type="text"
              value={form.emailResponseTime}
              onChange={(e) => setForm((f) => ({ ...f, emailResponseTime: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none font-sans"
              placeholder="Réponse sous 24h ouvrées"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2 font-sans">Adresse (ligne 1)</label>
            <input
              type="text"
              value={form.addressLine1}
              onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none font-sans"
              placeholder="Route de la Venoge 2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2 font-sans">Adresse (ligne 2)</label>
            <input
              type="text"
              value={form.addressLine2}
              onChange={(e) => setForm((f) => ({ ...f, addressLine2: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none font-sans"
              placeholder="1302 Vufflens-la-Ville"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2 font-sans">Pays / région</label>
            <input
              type="text"
              value={form.addressCountry}
              onChange={(e) => setForm((f) => ({ ...f, addressCountry: e.target.value }))}
              className="w-full px-4 py-2 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent outline-none font-sans"
              placeholder="Suisse"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-kraft hover:bg-kraft-hover text-white rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Enregistrer
        </button>
      </form>
    </div>
  )
}
