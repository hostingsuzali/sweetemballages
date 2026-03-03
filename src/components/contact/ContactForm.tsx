"use client"
import { useState } from 'react'
import { Send, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'

interface ContactFormProps {
    /** 'contact' → /api/contact  |  'devis' → /api/devis */
    type?: 'contact' | 'devis'
}

export function ContactForm({ type = 'contact' }: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        phone: '',
        message: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const endpoint = type === 'devis' ? '/api/devis' : '/api/contact'
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Erreur lors de l\'envoi')
            }

            toast.success(
                type === 'devis' ? 'Demande de devis envoyée !' : 'Message envoyé !',
                { description: 'Nous vous répondrons dans les plus brefs délais.' }
            )

            setSubmitted(true)
            setFormData({ companyName: '', email: '', phone: '', message: '' })
        } catch (err) {
            const error = err as Error
            toast.error('Échec de l\'envoi', { description: error.message })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
        if (submitted) setSubmitted(false)
    }

    return (
        <div className="relative bg-white rounded-3xl border border-border shadow-sm shadow-kraft/5 overflow-hidden">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-kraft/60 via-kraft to-kraft/60" />

            <div className="p-6 lg:p-8 xl:p-10">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="font-heading text-2xl font-bold text-charcoal">
                        {type === 'devis' ? 'Demander un devis' : 'Envoyez-nous un message'}
                    </h2>
                    <p className="font-sans text-sm text-muted mt-1.5">
                        {type === 'devis'
                            ? 'Décrivez vos besoins et nous vous contacterons avec une offre personnalisée.'
                            : 'Remplissez le formulaire et nous vous répondrons sous 24h ouvrées.'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {submitted ? (
                        /* ── Success state ── */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -12 }}
                            transition={{ duration: 0.35 }}
                            className="flex flex-col items-center text-center py-12 px-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mb-5">
                                <CheckCircle2 className="w-8 h-8 text-green" />
                            </div>
                            <h3 className="font-heading text-xl font-bold text-charcoal mb-2">
                                {type === 'devis' ? 'Demande envoyée !' : 'Message envoyé !'}
                            </h3>
                            <p className="font-sans text-sm text-muted max-w-xs leading-relaxed mb-6">
                                Merci pour votre message. Notre équipe vous répondra dans les 24h ouvrées.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="font-sans text-sm font-semibold text-kraft hover:text-charcoal transition-colors underline underline-offset-2"
                            >
                                Envoyer un autre message
                            </button>
                        </motion.div>
                    ) : (
                        /* ── Form ── */
                        <motion.form
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="space-y-5">
                                {/* Row: Company + Email */}
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5 text-left">
                                        <Label htmlFor="companyName">
                                            Nom de l&apos;entreprise <span className="text-kraft">*</span>
                                        </Label>
                                        <Input
                                            id="companyName"
                                            name="companyName"
                                            type="text"
                                            required
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            placeholder="Restaurant Le Gourmet"
                                        />
                                    </div>

                                    <div className="space-y-1.5 text-left">
                                        <Label htmlFor="email">
                                            Email <span className="text-kraft">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="contact@votreentreprise.ch"
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="space-y-1.5 text-left">
                                    <Label htmlFor="phone">
                                        Téléphone{' '}
                                        <span className="font-normal text-muted/70 text-xs">(optionnel)</span>
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+41 00 000 00 00"
                                    />
                                </div>

                                {/* Message */}
                                <div className="space-y-1.5 text-left">
                                    <Label htmlFor="message">
                                        {type === 'devis' ? 'Décrivez votre besoin' : 'Message'}{' '}
                                        <span className="text-kraft">*</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder={
                                            type === 'devis'
                                                ? 'Type de produit, quantité estimée, personnalisation logo, délai souhaité…'
                                                : 'Comment pouvons-nous vous aider ?'
                                        }
                                        rows={5}
                                    />
                                </div>

                                {/* Professional note */}
                                <div className="flex items-center gap-2.5 p-3.5 bg-background rounded-xl border border-border">
                                    <span className="w-2 h-2 bg-green rounded-full flex-shrink-0" />
                                    <p className="font-sans text-xs text-muted">
                                        Service exclusivement réservé aux{' '}
                                        <span className="font-semibold text-charcoal">
                                            professionnels des métiers de bouche
                                        </span>{' '}
                                        (restaurants, pizzerias, boucheries, traiteurs…)
                                    </p>
                                </div>

                                {/* Submit */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full font-semibold py-6 text-base rounded-xl"
                                    size="lg"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Envoi en cours…
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            {type === 'devis' ? 'Envoyer ma demande de devis' : 'Envoyer le message'}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
