import { Package, Upload, FileCheck, Factory } from 'lucide-react'
import { FadeIn, FadeInRight } from '@/components/ui/Animations'

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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn className="text-center mb-14">
                    <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal mb-4">
                        Comment ça marche ?
                    </h2>
                    <p className="font-sans text-muted max-w-xl mx-auto">
                        Un processus simple en 4 étapes pour personnaliser vos emballages
                        aux couleurs de votre établissement.
                    </p>
                </FadeIn>

                <div className="space-y-6">
                    {steps.map((step, index) => (
                        <FadeInRight
                            key={step.number}
                            delay={index * 0.1}
                            className="flex flex-col sm:flex-row gap-6 items-start bg-white rounded-xl border border-border p-6 hover:border-kraft transition-colors"
                        >
                            {/* Step Number */}
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-kraft rounded-xl flex items-center justify-center">
                                    <step.icon className="w-7 h-7 text-white" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-heading text-sm font-bold text-kraft">
                                        ÉTAPE {step.number}
                                    </span>
                                </div>
                                <h3 className="font-heading text-xl font-bold text-charcoal mb-2">
                                    {step.title}
                                </h3>
                                <p className="font-sans text-muted leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </FadeInRight>
                    ))}
                </div>
            </div>
        </section>
    )
}
