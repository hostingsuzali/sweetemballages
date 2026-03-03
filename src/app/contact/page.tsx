import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ContactForm } from '@/components/contact/ContactForm'
import { FadeIn, FadeInRight, ScaleIn } from '@/components/ui/Animations'
import { Phone, Mail, MapPin, ArrowRight, MessageSquare, Clock3, Shield } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Contact | Sweet Emballages',
    description:
        'Contactez l\'équipe Sweet Emballages pour toute question. Service réservé aux professionnels des métiers de bouche en Suisse.',
}

const contactItems = [
    {
        icon: Phone,
        label: 'Téléphone',
        value: '076 504 10 69',
        href: 'tel:+41765041069',
        description: 'Lun–ven, 8h–18h',
    },
    {
        icon: Mail,
        label: 'Email',
        value: 'contact@sweetemballages.ch',
        href: 'mailto:contact@sweetemballages.ch',
        description: 'Réponse sous 24h ouvrées',
    },
    {
        icon: MapPin,
        label: 'Adresse',
        value: 'Route de la Venoge 2',
        subvalue: '1302 Vufflens-la-Ville',
        href: null,
        description: 'Suisse',
    },
]

const commitments = [
    {
        icon: Clock3,
        title: 'Réponse sous 24h',
        description: 'Nous traitons chaque message dans les meilleurs délais.',
    },
    {
        icon: MessageSquare,
        title: 'Écoute personnalisée',
        description: 'Un interlocuteur dédié pour comprendre vos besoins.',
    },
    {
        icon: Shield,
        title: 'Confidentialité',
        description: 'Vos données restent strictement confidentielles.',
    },
]

export default function ContactPage() {
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
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-kraft/[0.08] to-transparent" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-kraft/10 blur-3xl" />
                <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-kraft/5 blur-2xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <FadeIn>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-kraft uppercase tracking-[0.2em] mb-5">
                            <span className="w-6 h-px bg-kraft" />
                            Parlons de vos besoins
                        </span>
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.08] mb-5">
                            Contactez-nous
                        </h1>
                        <p className="font-sans text-lg text-white/65 max-w-xl leading-relaxed mb-8">
                            Notre équipe est à votre disposition pour répondre à toutes vos
                            questions sur nos emballages alimentaires professionnels.
                        </p>
                        <Link
                            href="/devis"
                            className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-kraft hover:text-white transition-colors group"
                        >
                            Vous souhaitez un devis ?
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </FadeIn>
                </div>
            </section>

            {/* ── Contact cards row ───────────────────── */}
            <section className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid sm:grid-cols-3 gap-4 lg:gap-6">
                        {contactItems.map((item, i) => (
                            <FadeIn key={item.label} delay={i * 0.08}>
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        className="group flex items-start gap-4 p-5 rounded-2xl border border-border hover:border-kraft hover:shadow-md hover:shadow-kraft/5 transition-all duration-300 bg-background"
                                    >
                                        <div className="w-11 h-11 rounded-xl bg-kraft/10 flex items-center justify-center flex-shrink-0 group-hover:bg-kraft/20 transition-colors">
                                            <item.icon className="w-5 h-5 text-kraft" />
                                        </div>
                                        <div>
                                            <p className="font-sans text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">
                                                {item.label}
                                            </p>
                                            <p className="font-heading text-sm font-bold text-charcoal group-hover:text-kraft transition-colors">
                                                {item.value}
                                            </p>
                                            <p className="font-sans text-xs text-muted mt-0.5">{item.description}</p>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-background">
                                        <div className="w-11 h-11 rounded-xl bg-kraft/10 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-5 h-5 text-kraft" />
                                        </div>
                                        <div>
                                            <p className="font-sans text-xs font-semibold text-muted uppercase tracking-wider mb-0.5">
                                                {item.label}
                                            </p>
                                            <p className="font-heading text-sm font-bold text-charcoal">
                                                {item.value}
                                            </p>
                                            {item.subvalue && (
                                                <p className="font-sans text-sm text-charcoal">{item.subvalue}</p>
                                            )}
                                            <p className="font-sans text-xs text-muted mt-0.5">{item.description}</p>
                                        </div>
                                    </div>
                                )}
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Main content ────────────────────────── */}
            <section className="flex-1 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                        {/* Commitments sidebar */}
                        <FadeInRight className="space-y-6 lg:max-w-md">
                            <div>
                                <span className="font-sans text-xs font-semibold text-kraft uppercase tracking-widest">
                                    Nos engagements
                                </span>
                                <h2 className="font-heading text-2xl font-bold text-charcoal mt-2 mb-6">
                                    Un service à la hauteur de vos attentes
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {commitments.map((c, i) => (
                                    <ScaleIn key={c.title} delay={i * 0.1}>
                                        <div className="flex gap-4 p-5 bg-white rounded-2xl border border-border hover:border-kraft hover:shadow-sm transition-all duration-300">
                                            <div className="w-10 h-10 rounded-xl bg-kraft/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <c.icon className="w-5 h-5 text-kraft" />
                                            </div>
                                            <div>
                                                <p className="font-heading text-sm font-bold text-charcoal mb-1">{c.title}</p>
                                                <p className="font-sans text-sm text-muted leading-relaxed">{c.description}</p>
                                            </div>
                                        </div>
                                    </ScaleIn>
                                ))}
                            </div>

                            {/* Devis CTA card */}
                            <div className="relative overflow-hidden rounded-2xl bg-charcoal text-white p-6">
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-kraft/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative">
                                    <p className="font-sans text-xs font-semibold text-kraft uppercase tracking-widest mb-2">
                                        Besoin d&apos;un tarif ?
                                    </p>
                                    <p className="font-heading text-lg font-bold mb-3">
                                        Demandez votre devis personnalisé
                                    </p>
                                    <p className="font-sans text-sm text-white/60 mb-5">
                                        Obtenez une offre adaptée à vos volumes en quelques minutes.
                                    </p>
                                    <Link
                                        href="/devis"
                                        className="inline-flex items-center gap-2 bg-kraft text-white font-sans text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-kraft-hover transition-colors group"
                                    >
                                        Demander un devis
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </FadeInRight>

                        {/* Contact form */}
                        <FadeIn delay={0.15} className="w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
                            <ContactForm />
                        </FadeIn>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
