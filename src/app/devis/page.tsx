import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/contact/ContactForm'
import { FadeIn, FadeInRight, ScaleIn, SpringScale } from '@/components/ui/Animations'
import {
    Phone, Mail, MapPin,
    ClipboardList, Truck, Clock, BadgeCheck,
    CheckCircle2,
} from 'lucide-react'

export const metadata = {
    title: 'Demande de Devis | Sweet Emballages',
    description:
        'Obtenez un devis personnalisé pour vos emballages alimentaires professionnels. Service réservé aux professionnels des métiers de bouche en Suisse.',
}

const advantages = [
    {
        icon: ClipboardList,
        title: 'Devis sur mesure',
        description: 'Tarifs adaptés à vos volumes et besoins spécifiques.',
    },
    {
        icon: Truck,
        title: 'Livraison sous 24–48h',
        description: 'Expédition rapide partout en Suisse dès validation.',
    },
    {
        icon: Clock,
        title: 'Réponse sous 24h',
        description: 'Traitement prioritaire de toutes les demandes de devis.',
    },
    {
        icon: BadgeCheck,
        title: 'Produits certifiés',
        description: 'Emballages conformes aux normes alimentaires suisses.',
    },
]

const included = [
    'Prix en CHF HT dégressifs selon les quantités',
    'Personnalisation logo disponible sur devis',
    'Conseils personnalisés par un expert métier',
    'Livraison rapide partout en Suisse',
]

export default function DevisPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col pt-16 lg:pt-20">
            <Navbar />

            {/* ── Hero ─────────────────────────────────── */}
            <section className="relative overflow-hidden bg-charcoal text-white">
                {/* Noise texture */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                />
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-kraft/[0.1] to-transparent" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-kraft/10 blur-3xl" />
                <div className="absolute top-8 right-12 w-56 h-56 rounded-full bg-kraft/5 blur-2xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <FadeIn>
                            <span className="inline-flex items-center gap-2 text-xs font-semibold text-kraft uppercase tracking-[0.2em] mb-5">
                                <span className="w-6 h-px bg-kraft" />
                                Service professionnel
                            </span>
                            <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.08] mb-5">
                                Demande de{' '}
                                <span className="text-kraft">Devis</span>
                            </h1>
                            <p className="font-sans text-lg text-white/65 max-w-xl leading-relaxed">
                                Obtenez une offre sur mesure pour vos emballages alimentaires.
                                Réponse garantie sous 24h ouvrées.
                            </p>
                        </FadeIn>

                        {/* Stats row */}
                        <FadeIn delay={0.2}>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { value: '500+', label: 'Clients professionnels' },
                                    { value: '24h', label: 'Délai de réponse' },
                                    { value: '100%', label: 'Sur mesure' },
                                ].map((stat, i) => (
                                    <SpringScale key={stat.label} delay={0.3 + i * 0.1}>
                                        <div className="text-center p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <p className="font-heading text-2xl lg:text-3xl font-bold text-kraft mb-1">
                                                {stat.value}
                                            </p>
                                            <p className="font-sans text-xs text-white/50 leading-tight">
                                                {stat.label}
                                            </p>
                                        </div>
                                    </SpringScale>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* ── "What's included" strip ──────────────── */}
            <section className="bg-kraft/5 border-y border-kraft/15">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 justify-center lg:justify-start">
                        {included.map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green flex-shrink-0" />
                                <span className="font-sans text-sm font-medium text-charcoal">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="flex-1 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                        {/* ── Sidebar ────────────────── */}
                        <div className="space-y-8 lg:max-w-md">

                            {/* Contact info */}
                            <FadeInRight>
                                <h2 className="font-heading text-xl font-bold text-charcoal mb-5">
                                    Nous contacter directement
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        {
                                            icon: Phone,
                                            label: '076 504 10 69',
                                            sub: 'Lun–ven, 8h–18h',
                                            href: 'tel:+41765041069',
                                        },
                                        {
                                            icon: Mail,
                                            label: 'contact@sweetemballages.ch',
                                            sub: 'Réponse sous 24h',
                                            href: 'mailto:contact@sweetemballages.ch',
                                        },
                                        {
                                            icon: MapPin,
                                            label: 'Route de la Venoge 2',
                                            sub: '1302 Vufflens-la-Ville',
                                            href: null,
                                        },
                                    ].map((item) =>
                                        item.href ? (
                                            <a
                                                key={item.label}
                                                href={item.href}
                                                className="group flex items-start gap-4 p-4 bg-white rounded-2xl border border-border hover:border-kraft hover:shadow-md hover:shadow-kraft/5 transition-all duration-300"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-kraft/10 flex items-center justify-center flex-shrink-0 group-hover:bg-kraft/20 transition-colors">
                                                    <item.icon className="w-4 h-4 text-kraft" />
                                                </div>
                                                <div>
                                                    <p className="font-sans text-sm font-semibold text-charcoal group-hover:text-kraft transition-colors">
                                                        {item.label}
                                                    </p>
                                                    <p className="font-sans text-xs text-muted mt-0.5">{item.sub}</p>
                                                </div>
                                            </a>
                                        ) : (
                                            <div
                                                key={item.label}
                                                className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-border"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-kraft/10 flex items-center justify-center flex-shrink-0">
                                                    <item.icon className="w-4 h-4 text-kraft" />
                                                </div>
                                                <div>
                                                    <p className="font-sans text-sm font-semibold text-charcoal">
                                                        {item.label}
                                                    </p>
                                                    <p className="font-sans text-xs text-muted mt-0.5">{item.sub}</p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </FadeInRight>

                            {/* Advantage cards */}
                            <div>
                                <FadeInRight delay={0.05}>
                                    <h2 className="font-heading text-xl font-bold text-charcoal mb-5">
                                        Pourquoi choisir Sweet Emballages ?
                                    </h2>
                                </FadeInRight>
                                <div className="grid grid-cols-2 gap-3">
                                    {advantages.map((item, i) => (
                                        <ScaleIn key={item.title} delay={i * 0.08}>
                                            <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-border hover:border-kraft hover:shadow-sm transition-all duration-300 h-full">
                                                <div className="w-9 h-9 rounded-xl bg-kraft/10 flex items-center justify-center flex-shrink-0">
                                                    <item.icon className="w-4 h-4 text-kraft" />
                                                </div>
                                                <div>
                                                    <p className="font-heading text-sm font-bold text-charcoal mb-1">
                                                        {item.title}
                                                    </p>
                                                    <p className="font-sans text-xs text-muted leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </ScaleIn>
                                    ))}
                                </div>
                            </div>

                            {/* Professional badge */}
                            <FadeIn delay={0.2}>
                                <div className="relative overflow-hidden rounded-2xl border border-green/25 bg-green/5 p-5">
                                    <div className="flex gap-3 items-start">
                                        <span className="w-2.5 h-2.5 bg-green rounded-full mt-1.5 flex-shrink-0" />
                                        <p className="font-sans text-sm text-muted leading-relaxed">
                                            Service réservé aux{' '}
                                            <strong className="text-charcoal">
                                                professionnels des métiers de bouche
                                            </strong>{' '}
                                            : restaurants, pizzerias, boucheries, traiteurs&hellip;
                                        </p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        {/* ── Form ───────────────────── */}
                        <FadeIn delay={0.1} className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
                            <ContactForm type="devis" />
                        </FadeIn>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
