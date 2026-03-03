"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MessageSquare, Mail, Phone, Building2, Clock, CheckCheck, Trash2, Eye, RefreshCw } from 'lucide-react'

interface Message {
    id: string
    company_name: string
    email: string
    phone: string | null
    message: string
    is_read: boolean
    created_at: string
}

interface MessagesClientProps {
    messages: Message[]
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

export function MessagesClient({ messages: initial, error }: MessagesClientProps) {
    const [messages, setMessages] = useState<Message[]>(initial)
    const [selected, setSelected] = useState<Message | null>(null)
    const [loading, setLoading] = useState(false)

    const unreadCount = messages.filter((m) => !m.is_read).length

    const markAsRead = async (id: string) => {
        await supabase
            .from('contact_messages')
            .update({ is_read: true })
            .eq('id', id)
        setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
        )
        if (selected?.id === id) setSelected((s) => s ? { ...s, is_read: true } : s)
    }

    const handleDelete = async (id: string) => {
        if (!window.confirm('Supprimer ce message ?')) return
        await supabase.from('contact_messages').delete().eq('id', id)
        setMessages((prev) => prev.filter((m) => m.id !== id))
        if (selected?.id === id) setSelected(null)
    }

    const handleOpen = async (msg: Message) => {
        setSelected(msg)
        if (!msg.is_read) await markAsRead(msg.id)
    }

    const refresh = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false })
        if (data) setMessages(data)
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-heading text-3xl font-bold text-charcoal flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-kraft" />
                        Messages Contact
                    </h1>
                    <p className="font-sans text-muted mt-1">
                        {unreadCount > 0 ? (
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block" />
                                <strong className="text-charcoal">{unreadCount}</strong> non lu{unreadCount > 1 ? 's' : ''}
                            </span>
                        ) : (
                            'Tous les messages lus'
                        )}
                    </p>
                </div>
                <button
                    onClick={refresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-white hover:bg-gray-50 text-charcoal font-medium text-sm transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 font-sans text-sm">
                    ⚠️ Erreur de chargement : {error}. Vérifiez que la table <code>contact_messages</code> existe dans Supabase.
                </div>
            )}

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Message List */}
                <div className="lg:col-span-2 space-y-2">
                    {messages.length === 0 && !error ? (
                        <div className="bg-white rounded-2xl border border-border p-12 text-center text-muted font-sans">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            Aucun message reçu
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <button
                                key={msg.id}
                                onClick={() => handleOpen(msg)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === msg.id
                                    ? 'border-kraft bg-kraft/5 shadow-sm'
                                    : 'border-border bg-white hover:border-kraft/40 hover:bg-gray-50/50'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${msg.is_read ? 'bg-gray-200' : 'bg-amber-500'}`} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className={`font-heading text-sm truncate ${msg.is_read ? 'text-charcoal font-medium' : 'text-charcoal font-bold'}`}>
                                                {msg.company_name}
                                            </span>
                                            {!msg.is_read && (
                                                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                                    NOUVEAU
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted font-sans truncate mt-0.5">{msg.email}</div>
                                        <div className="text-xs text-gray-400 font-sans mt-1 line-clamp-1">{msg.message}</div>
                                        <div className="flex items-center gap-1 mt-1.5 text-[11px] text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(msg.created_at)}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Message Detail */}
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
                                                <CheckCheck className="w-3 h-3" /> Lu
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-medium">
                                                <Eye className="w-3 h-3" /> Non lu
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
                                            title="Marquer comme lu"
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

                            {/* Message Body */}
                            <div>
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Message</h3>
                                <div className="bg-gray-50 rounded-xl border border-border p-4 font-sans text-charcoal text-sm leading-relaxed whitespace-pre-wrap">
                                    {selected.message}
                                </div>
                            </div>

                            {/* Quick Reply */}
                            <a
                                href={`mailto:${selected.email}?subject=Re: Votre message - Sweet Emballages`}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-kraft hover:bg-[#b09268] text-white font-medium transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Répondre par email
                            </a>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-border p-16 text-center text-muted font-sans">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                            <p className="text-sm">Sélectionnez un message pour le lire</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
