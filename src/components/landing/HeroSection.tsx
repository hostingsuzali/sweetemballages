import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Box, Truck, BadgeCheck } from 'lucide-react'
import { FadeIn, ScaleIn, SpringScale, FadeInRight } from '@/components/ui/Animations'

export function HeroSection() {
    return (
        <section className="relative min-h-[64vh] bg-background pt-4 sm:pt-6 lg:pt-8 overflow-hidden pb-12 lg:pb-0">
            {/* Subtle kraft texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Geometric accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-kraft/5 to-transparent z-0" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-6 lg:py-10 z-10">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Visual - Moves to top on mobile */}
                    <ScaleIn delay={0.2} className="relative order-first lg:order-last lg:col-span-5 w-full mx-auto">
                        {/* Main image container */}
                        <div className="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/5] rounded-[2.5rem] lg:rounded-2xl overflow-hidden shadow-2xl bg-white border border-white/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-kraft/10 to-transparent z-10" />
                            <Image
                                src="/fourgonandhanger.png"
                                alt="Flotte Sweet Emballages"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover relative z-0"
                                priority
                            />

                            {/* Eco badge */}
                            <SpringScale delay={0.8} className="absolute top-4 right-4 lg:w-20 lg:h-20 w-16 h-16 bg-green rounded-full flex items-center justify-center shadow-lg border-4 border-background z-20">
                                <span className="font-heading text-white text-[10px] lg:text-xs font-bold text-center leading-tight">
                                    ECO
                                    <br />
                                    FRIENDLY
                                </span>
                            </SpringScale>
                        </div>

                        {/* Floating card - Only on Desktop */}
                        <FadeInRight delay={0.7} className="hidden lg:flex absolute -left-8 bottom-8 bg-white rounded-xl shadow-xl p-4 border border-border items-center gap-3 z-30">
                            <div className="w-12 h-12 bg-kraft rounded-lg flex items-center justify-center">
                                <span className="font-heading text-white font-bold text-lg">
                                    CHF
                                </span>
                            </div>
                            <div>
                                <p className="font-sans text-xs text-muted">
                                    Prix clairs
                                </p>
                                <p className="font-heading font-bold text-charcoal">
                                    HT affichés
                                </p>
                            </div>
                        </FadeInRight>
                    </ScaleIn>

                    {/* Content */}
                    <FadeIn className="order-last lg:order-first lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left space-y-6 lg:space-y-8 z-20 relative">

                        {/* Overlapping Badge on Mobile */}
                        <div className="relative -mt-14 lg:mt-0 inline-flex items-center gap-2 bg-white/95 backdrop-blur lg:bg-green/10 text-kraft font-black lg:font-medium lg:text-green px-6 py-2.5 lg:px-4 lg:py-2 rounded-full shadow-lg lg:shadow-none border border-border lg:border-none z-30 uppercase tracking-[0.15em] lg:tracking-normal lg:normal-case text-[11px] lg:text-sm">
                            <BadgeCheck className="w-4 h-4 hidden lg:block" />
                            <span className="opacity-80 lg:opacity-100">
                                100% Professionnels
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal leading-[1.1] tracking-tight">
                            Emballages alimentaires{' '}
                            <span className="text-kraft block lg:inline">professionnels</span> pour les
                            métiers de bouche
                        </h1>

                        {/* Sub-headline */}
                        <p className="font-sans text-[17px] sm:text-xl text-muted leading-relaxed max-w-[300px] sm:max-w-xl mx-auto lg:mx-0">
                            Boîtes, sacs et consommables pour restaurants, pizzerias et commerces alimentaires. Prix clairs en CHF HT, livraison rapide.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
                            <Link
                                href="/produits"
                                className="inline-flex items-center justify-center gap-2 font-sans text-sm sm:text-base font-bold uppercase tracking-wider bg-kraft lg:bg-charcoal lg:normal-case lg:tracking-normal text-white px-8 py-4 lg:rounded-lg rounded-full hover:bg-kraft/90 lg:hover:bg-[#3D3D3D] transition-all hover:gap-3 group shadow-xl shadow-kraft/25 lg:shadow-none lg:w-auto w-full"
                            >
                                Catalogue
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/devis"
                                className="inline-flex items-center justify-center gap-2 font-sans text-sm sm:text-base font-bold uppercase tracking-wider bg-white lg:bg-transparent lg:normal-case lg:tracking-normal text-charcoal lg:text-charcoal px-8 py-4 lg:rounded-lg rounded-full border border-border lg:border-2 lg:border-charcoal hover:bg-gray-50 lg:hover:bg-charcoal lg:hover:text-white transition-colors shadow-sm lg:shadow-none lg:w-auto w-full"
                            >
                                Nous contacter
                            </Link>
                        </div>

                        {/* Quick stats - Desktop only */}
                        <div className="hidden lg:flex flex-wrap gap-8 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-kraft/10 rounded-lg flex items-center justify-center">
                                    <Box className="w-5 h-5 text-kraft" />
                                </div>
                                <div>
                                    <p className="font-heading font-bold text-charcoal">
                                        500+
                                    </p>
                                    <p className="font-sans text-sm text-muted">
                                        Produits
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-kraft/10 rounded-lg flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-kraft" />
                                </div>
                                <div>
                                    <p className="font-heading font-bold text-charcoal">
                                        24-48h
                                    </p>
                                    <p className="font-sans text-sm text-muted">
                                        Livraison
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}
