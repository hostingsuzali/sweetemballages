import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

const navLinks = [
  { to: '/', label: 'Accueil' },
  { to: '/produits', label: 'Produits' },
  { to: '/personnalisation', label: 'Personnalisation' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border-neutral">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logobrownblack.png"
              alt="SWEET EMBALLAGES"
              className="h-14 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="font-sans text-sm font-medium text-muted hover:text-charcoal transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-kraft group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/contact"
              className="font-sans text-sm font-medium text-charcoal hover:text-kraft transition-colors"
            >
              Demander un devis
            </Link>
            <Link
              to="/produits"
              className="font-sans text-sm font-semibold bg-charcoal text-white px-5 py-2.5 rounded-lg hover:bg-charcoal/90 transition-colors"
            >
              Voir les produits
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-charcoal"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border-neutral overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-sans text-base font-medium text-muted hover:text-charcoal py-2"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border-neutral space-y-3">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-sans text-sm font-medium text-charcoal py-2"
                >
                  Demander un devis
                </Link>
                <Link
                  to="/produits"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-sans text-sm font-semibold bg-charcoal text-white px-5 py-3 rounded-lg text-center"
                >
                  Voir les produits
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
