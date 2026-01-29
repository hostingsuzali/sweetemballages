import { motion } from 'motion/react'
import { Package, Tag, Palette, Boxes } from 'lucide-react'

const reasons = [
  {
    icon: Package,
    title: 'Fournisseur spécialisé',
    description:
      'Expert en emballage alimentaire depuis des années. Nous connaissons vos besoins et vos contraintes métier.',
  },
  {
    icon: Tag,
    title: 'Tarifs professionnels',
    description:
      'Prix dégressifs selon les quantités. Plus vous commandez, plus vous économisez sur vos emballages.',
  },
  {
    icon: Palette,
    title: 'Personnalisation logo',
    description:
      'Imprimez votre logo sur vos emballages. Boîtes pizza, sacs et gobelets aux couleurs de votre établissement.',
  },
  {
    icon: Boxes,
    title: 'Quantités adaptées',
    description:
      'Du petit commerce au grand restaurant, nous proposons des conditionnements adaptés à votre volume.',
  },
]

export function WhyUs() {
  return (
    <section className="bg-white py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-kraft/5 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-sans text-sm font-semibold text-kraft uppercase tracking-wider">
              Pourquoi nous choisir
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mt-3 mb-6 leading-tight">
              Votre partenaire emballage de confiance
            </h2>
            <p className="font-sans text-lg text-muted leading-relaxed mb-8">
              SWEET EMBALLAGES accompagne les professionnels de l'alimentation
              en Suisse avec un service fiable, des prix transparents et une
              gamme complète d'emballages alimentaires de qualité.
            </p>
            <div className="grid grid-cols-3 gap-6 p-6 bg-background rounded-2xl border border-border-neutral">
              <div className="text-center">
                <p className="font-heading text-3xl lg:text-4xl font-bold text-kraft">
                  500+
                </p>
                <p className="font-sans text-sm text-muted mt-1">Références</p>
              </div>
              <div className="text-center border-x border-border-neutral">
                <p className="font-heading text-3xl lg:text-4xl font-bold text-kraft">
                  24h
                </p>
                <p className="font-sans text-sm text-muted mt-1">Expédition</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-3xl lg:text-4xl font-bold text-kraft">
                  100%
                </p>
                <p className="font-sans text-sm text-muted mt-1">Suisse</p>
              </div>
            </div>
          </motion.div>
          <div className="grid sm:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background rounded-xl p-6 border border-border-neutral hover:border-kraft transition-colors"
              >
                <div className="w-12 h-12 bg-kraft/10 rounded-lg flex items-center justify-center mb-4">
                  <reason.icon className="w-6 h-6 text-kraft" />
                </div>
                <h3 className="font-heading text-lg font-bold text-charcoal mb-2">
                  {reason.title}
                </h3>
                <p className="font-sans text-sm text-muted leading-relaxed">
                  {reason.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
