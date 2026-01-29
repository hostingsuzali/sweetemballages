import { useState } from 'react'
import { motion } from 'motion/react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { toast } from 'sonner'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success('Message envoyé !', {
      description: 'Nous vous répondrons dans les plus brefs délais.',
    })
    setFormData({
      companyName: '',
      email: '',
      phone: '',
      message: '',
    })
    setIsSubmitting(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-border-neutral p-6 lg:p-8"
    >
      <h2 className="font-heading text-2xl font-bold text-charcoal mb-6">
        Envoyez-nous un message
      </h2>
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="companyName">Nom de l'entreprise *</Label>
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
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
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
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="076 504 10 69"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Décrivez votre besoin en emballages..."
            rows={5}
          />
        </div>
        <div className="flex items-start gap-2 p-4 bg-background rounded-lg border border-border-neutral">
          <span
            className="w-2 h-2 bg-green-accent rounded-full mt-2 flex-shrink-0"
            aria-hidden
          />
          <p className="font-sans text-sm text-muted">
            Service réservé aux professionnels des métiers de bouche
            (restaurants, pizzerias, boucheries, traiteurs, etc.)
          </p>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-charcoal hover:bg-charcoal/90 text-white font-sans font-semibold py-6 text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" aria-hidden />
              Envoyer le message
            </>
          )}
        </Button>
      </div>
    </motion.form>
  )
}
