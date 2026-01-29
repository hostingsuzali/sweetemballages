import { ContactForm } from '@/components/contact/ContactForm'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Contact() {
  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mb-12">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-charcoal mb-2">
            Contact
          </h1>
          <p className="font-sans text-muted">
            Demandez un devis ou posez-nous vos questions. Service réservé aux
            professionnels.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="font-heading text-xl font-bold text-charcoal mb-6">
              Nos coordonnées
            </h2>
            <div className="space-y-6 font-sans text-muted">
              <a
                href="tel:+41000000000"
                className="flex items-center gap-3 text-charcoal hover:text-kraft transition-colors"
              >
                <Phone className="w-5 h-5 text-kraft flex-shrink-0" />
                <span>+41 00 000 00 00</span>
              </a>
              <a
                href="mailto:contact@sweetemballages.ch"
                className="flex items-center gap-3 text-charcoal hover:text-kraft transition-colors"
              >
                <Mail className="w-5 h-5 text-kraft flex-shrink-0" />
                <span>contact@sweetemballages.ch</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-kraft mt-0.5 flex-shrink-0" />
                <span>
                  Rue de l'Industrie 1<br />
                  1000 Lausanne, Suisse
                </span>
              </div>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
