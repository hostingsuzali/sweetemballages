import { BadgeCheck, Banknote, Truck } from 'lucide-react'
import { FadeIn } from '@/components/ui/Animations'

const signals = [
    {
        icon: BadgeCheck,
        title: 'Service réservé aux professionnels',
        description:
            'Accès exclusif pour restaurants, commerces alimentaires et métiers de bouche',
    },
    {
        icon: Banknote,
        title: 'Prix clairs – CHF HT',
        description:
            'Tarifs professionnels transparents, sans surprise ni frais cachés',
    },
    {
        icon: Truck,
        title: 'Livraison rapide en Suisse',
        description:
            'Expédition sous 24-48h pour toute la Suisse romande et alémanique',
    },
]

export function TrustSignals() {
    return (
        <section className="bg-background lg:bg-charcoal py-8 lg:py-20 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#111111] lg:bg-transparent rounded-[2rem] lg:rounded-none py-10 px-6 sm:px-10 lg:p-0 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 shadow-2xl lg:shadow-none border border-white/5 lg:border-none">
                    {signals.map((signal, index) => (
                        <FadeIn
                            key={signal.title}
                            delay={index * 0.1}
                            className="flex flex-row lg:flex-col items-center lg:items-start text-left gap-5 lg:gap-0"
                        >
                            <div className="w-16 h-16 lg:w-14 lg:h-14 bg-kraft/10 lg:bg-kraft rounded-2xl lg:rounded-xl flex items-center justify-center lg:mb-5 shrink-0">
                                <signal.icon className="w-8 h-8 lg:w-7 lg:h-7 text-kraft lg:text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-heading text-[17px] sm:text-lg lg:text-xl font-bold text-white mb-1 lg:mb-2 leading-tight">
                                    {signal.title}
                                </h3>
                                <p className="font-sans text-sm lg:text-base text-[#A0A0A0] leading-relaxed">
                                    {signal.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    )
}
