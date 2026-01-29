import { motion } from 'motion/react'
import { Package, Upload, FileCheck, Factory } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Package,
    title: 'Choisissez votre produit',
    description:
      'Sélectionnez parmi notre gamme de boîtes pizza, sacs kraft, gobelets et autres emballages personnalisables.',
  },
  {
    number: '02',
    icon: Upload,
    title: 'Envoyez votre logo',
    description:
      'Transmettez-nous votre logo en haute résolution (PDF, AI, EPS ou PNG 300dpi minimum).',
  },
  {
    number: '03',
    icon: FileCheck,
    title: 'Validez le BAT',
    description:
      'Nous vous envoyons un bon à tirer pour validation. Vérifiez les couleurs et le positionnement.',
  },
  {
    number: '04',
    icon: Factory,
    title: 'Production & livraison',
    description:
      'Après validation, production sous 2-3 semaines. Livraison directe à votre établissement.',
  },
]

export function BrandingSteps() {
  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal mb-4">
            Comment ça marche ?
          </h2>
          <p className="font-sans text-muted max-w-xl mx-auto">
            Un processus simple en 4 étapes pour personnaliser vos emballages
            aux couleurs de votre établissement.
          </p>
        </motion.div>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex gap-6 items-start bg-white rounded-xl border border-border-neutral p-6 hover:border-kraft transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-kraft rounded-xl flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <span className="font-heading text-sm font-bold text-kraft">
                  ÉTAPE {step.number}
                </span>
                <h3 className="font-heading text-xl font-bold text-charcoal mt-2 mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
