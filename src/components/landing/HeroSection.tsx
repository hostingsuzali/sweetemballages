import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { ArrowRight, Box, Truck, BadgeCheck } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] bg-background pt-12 lg:pt-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kraft/5 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-green-accent/10 text-green-accent px-4 py-2 rounded-full">
              <BadgeCheck className="w-4 h-4" />
              <span className="font-sans text-sm font-medium">
                Service réservé aux professionnels
              </span>
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-tight tracking-tight">
              Emballages alimentaires{' '}
              <span className="text-kraft">professionnels</span> pour les
              métiers de bouche
            </h1>
            <p className="font-sans text-lg sm:text-xl text-muted leading-relaxed max-w-xl">
              Boîtes, sacs et consommables pour restaurants, pizzerias et
              commerces alimentaires. Prix clairs en CHF HT, livraison rapide en
              Suisse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/produits"
                className="inline-flex items-center justify-center gap-2 font-sans text-base font-semibold bg-charcoal text-white px-8 py-4 rounded-lg hover:bg-charcoal/90 transition-all hover:gap-3 group"
              >
                Voir les produits
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 font-sans text-base font-semibold bg-transparent text-charcoal px-8 py-4 rounded-lg border-2 border-charcoal hover:bg-charcoal hover:text-white transition-colors"
              >
                Demander un devis
              </Link>
            </div>
            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-kraft/10 rounded-lg flex items-center justify-center">
                  <Box className="w-5 h-5 text-kraft" />
                </div>
                <div>
                  <p className="font-heading font-bold text-charcoal">500+</p>
                  <p className="font-sans text-sm text-muted">Produits</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-kraft/10 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-kraft" />
                </div>
                <div>
                  <p className="font-heading font-bold text-charcoal">24-48h</p>
                  <p className="font-sans text-sm text-muted">Livraison</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-kraft/20 to-border-neutral">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-3/4 h-3/4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="absolute bottom-0 left-0 w-48 h-48 bg-kraft rounded-lg shadow-2xl transform -rotate-6"
                  />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute bottom-8 left-16 w-44 h-44 bg-kraft/90 rounded-lg shadow-xl transform rotate-3"
                  />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="absolute bottom-16 left-32 w-40 h-40 bg-kraft/70 rounded-lg shadow-lg transform -rotate-2"
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                    className="absolute top-4 right-4 w-20 h-20 bg-green-accent rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="font-heading text-white text-xs font-bold text-center leading-tight">
                      ECO
                      <br />
                      FRIENDLY
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute -left-4 lg:-left-8 bottom-8 bg-white rounded-xl shadow-xl p-4 border border-border-neutral"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-kraft rounded-lg flex items-center justify-center">
                  <span className="font-heading text-white font-bold text-lg">
                    CHF
                  </span>
                </div>
                <div>
                  <p className="font-sans text-xs text-muted">Prix clairs</p>
                  <p className="font-heading font-bold text-charcoal">
                    HT affichés
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
