import Link from 'next/link'
import Image from 'next/image'
import {
    ArrowRight,
    Pizza,
    Salad,
    ShoppingBag,
    Beef,
    Coffee,
} from 'lucide-react'
import { FadeIn } from '@/components/ui/Animations'

const categories = [
    {
        id: 'pizza-snacking',
        name: 'Emballages Pizza & Snacking',
        description: 'Boîtes pizza classiques, distributeur, boîtes sandwich',
        icon: Pizza,
        image: '/images/categories/pizza.png',
        span: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2',
        color: 'kraft',
        products: '5 références',
    },
    {
        id: 'barquettes-plats',
        name: 'Barquettes & Plats à Emporter',
        description: 'Salades, pots avec couvercle, assiettes compartimentées',
        icon: Salad,
        image: '/images/categories/barquettes.png',
        span: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1',
        color: 'green-accent',
        products: '6 références',
    },
    {
        id: 'sacherie-transport',
        name: 'Sacherie & Transport',
        description: 'Sacs cabas, kraft, bio, eco, primeur',
        icon: ShoppingBag,
        image: '/images/categories/sacherie.png',
        span: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1',
        color: 'charcoal',
        products: '8 références',
    },
    {
        id: 'boucherie-conservation',
        name: 'Boucherie & Conservation',
        description: 'Sous-vide, papier boucherie',
        icon: Beef,
        image: '/images/categories/boucherie.png',
        span: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1',
        color: 'muted',
        products: '4 références',
    },
    {
        id: 'boissons-consommables',
        name: 'Boissons & Consommables',
        description: 'Gobelets, serviettes, papier caisse',
        icon: Coffee,
        image: '/images/categories/boissons.png',
        span: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1',
        color: 'green-accent',
        products: '5 références',
    },
]

const colorClasses: Record<string, string> = {
    kraft: 'bg-kraft/15 text-kraft',
    'green-accent': 'bg-green/15 text-green',
    charcoal: 'bg-charcoal/10 text-charcoal',
    muted: 'bg-muted/20 text-muted',
}

export function CategoryPreview() {
    return (
        <section className="bg-background py-20 lg:py-28 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <FadeIn className="text-center mb-16 lg:mb-24">
                    <span className="inline-block px-5 py-2 mb-6 text-[10px] font-black tracking-[0.2em] text-kraft uppercase bg-kraft/10 rounded-full">
                        Premium Solutions
                    </span>
                    <h2 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal mb-8 tracking-tight leading-[1.1]">
                        Explorez nos <br className="hidden sm:block" /> <span className="text-kraft">Collections</span>
                    </h2>
                    <p className="font-sans text-xl text-muted max-w-3xl mx-auto leading-relaxed font-light">
                        L&apos;excellence de l&apos;emballage alimentaire, conçue pour valoriser votre savoir-faire culinaire et garantir une conservation optimale.
                    </p>
                </FadeIn>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[280px] sm:auto-rows-[320px]">
                    {categories.map((category, index) => (
                        <FadeIn
                            key={category.id}
                            delay={index * 0.1}
                            className={`${category.span} group relative overflow-hidden rounded-3xl border border-border/50 hover:border-kraft/50 transition-all duration-500 hover:shadow-2xl hover:shadow-kraft/5`}
                        >
                            <Link
                                href={`/produits?category=${category.id}`}
                                className="flex flex-col h-full w-full p-6 sm:p-8"
                            >
                                {/* Background Image with subtle darkening overlay if needed */}
                                <div className="absolute inset-0 z-0 overflow-hidden bg-neutral-100">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                        className="object-cover scale-100 group-hover:scale-105 transition-transform duration-700 blur-0"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                </div>

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm backdrop-blur-sm border border-white/50 ${colorClasses[category.color]} group-hover:bg-kraft group-hover:text-white group-hover:scale-110 transition-all duration-500`}>
                                        <category.icon className="w-6 h-6" />
                                    </div>

                                    <div className="mt-auto">
                                        <div className="bg-white/70 backdrop-blur-lg p-4 sm:p-5 rounded-2xl border border-white/50 shadow-lg group-hover:bg-white/90 transition-all duration-500">
                                            <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-charcoal mb-2 group-hover:text-kraft transition-colors">
                                                {category.name}
                                            </h3>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="font-sans text-[10px] font-black uppercase tracking-widest text-muted/80 group-hover:text-kraft transition-colors shrink-0">
                                                    {category.products}
                                                </span>
                                                <div className="h-px flex-grow bg-charcoal/5 group-hover:bg-kraft/20 transition-colors hidden sm:block" />
                                                <div className="w-8 h-8 rounded-full border border-charcoal/10 flex items-center justify-center group-hover:border-kraft group-hover:bg-kraft transition-all duration-300 shadow-sm shrink-0">
                                                    <ArrowRight className="w-3.5 h-3.5 text-charcoal group-hover:text-white transform group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                            <p className="mt-3 font-sans text-muted text-[13px] leading-relaxed max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </FadeIn>
                    ))}

                    {/* View All / CTA Card */}
                    <FadeIn delay={0.6} className="col-span-1 sm:col-span-2 md:row-span-1 group relative overflow-hidden rounded-3xl bg-neutral-900 shadow-xl border border-white/5">
                        <Link
                            href="/produits"
                            className="flex items-center justify-between h-full w-full p-8 lg:p-12"
                        >
                            <div className="relative z-10">
                                <h3 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
                                    Découvrir la <br /> <span className="text-kraft">Gamme Complète</span>
                                </h3>
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-[2px] bg-kraft rounded-full" />
                                    <p className="font-sans text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
                                        500+ Références
                                    </p>
                                </div>
                            </div>
                            <div className="w-20 h-20 bg-kraft rounded-3xl flex items-center justify-center shadow-2xl shadow-kraft/40 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
                                <ArrowRight className="w-10 h-10 text-white" />
                            </div>

                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-kraft/15 rounded-full blur-[100px] group-hover:bg-kraft/25 transition-all duration-700 pointer-events-none" />
                        </Link>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}
