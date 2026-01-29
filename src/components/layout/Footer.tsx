import { Link } from '@tanstack/react-router'
import { Phone, Mail, MapPin } from 'lucide-react'

const footerLinks = {
  produits: [
    { label: 'Pizza & Snacking', to: '/produits?category=pizza-snacking' },
    { label: 'Barquettes & Plats', to: '/produits?category=barquettes-plats' },
    { label: 'Sacherie & Transport', to: '/produits?category=sacherie-transport' },
    { label: 'Boucherie & Conservation', to: '/produits?category=boucherie-conservation' },
    { label: 'Boissons & Consommables', to: '/produits?category=boissons-consommables' },
  ],
  services: [
    { label: 'Personnalisation logo', to: '/personnalisation' },
    { label: 'Demander un devis', to: '/contact' },
    { label: 'Catalogue complet', to: '/produits' },
  ],
  entreprise: [
    { label: 'À propos', to: '/contact' },
    { label: 'Contact', to: '/contact' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img
                src="/logobrownwhite.png"
                alt="SWEET EMBALLAGES"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="font-sans text-footer-muted leading-relaxed mb-6 max-w-sm">
              Votre fournisseur d'emballages alimentaires professionnels en
              Suisse. Service réservé aux professionnels des métiers de bouche.
            </p>
            <div className="space-y-3">
              <a
                href="tel:+41765041069"
                className="flex items-center gap-3 text-footer-muted hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-kraft" />
                <span className="font-sans text-sm">076 504 10 69</span>
              </a>
              <a
                href="mailto:contact@sweetemballages.ch"
                className="flex items-center gap-3 text-footer-muted hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-kraft" />
                <span className="font-sans text-sm">
                  contact@sweetemballages.ch
                </span>
              </a>
              <div className="flex items-start gap-3 text-footer-muted">
                <MapPin className="w-4 h-4 text-kraft mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm">
                  Route de la Venoge 2<br />
                  1302 Vufflens-la-Ville
                </span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-heading font-bold text-white mb-4">
              Produits
            </h4>
            <ul className="space-y-3">
              {footerLinks.produits.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-footer-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-white mb-4">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-footer-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-white mb-4">
              Entreprise
            </h4>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="font-sans text-sm text-footer-muted hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-footer-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-sans text-sm text-footer-muted">
              © {new Date().getFullYear()} SWEET EMBALLAGES. Tous droits
              réservés.
            </p>
            <div className="flex items-center gap-2">
              <span className="font-sans text-xs text-muted">
                Service réservé aux professionnels
              </span>
              <span className="w-2 h-2 bg-green-accent rounded-full" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
