import { cookies } from 'next/headers'
import { verifyAccesCookie, COOKIE_NAME } from '@/lib/acces-pin'
import { AccesPinGate } from '@/components/acces/AccesPinGate'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FadeIn, FadeInRight } from '@/components/ui/Animations'
import {
    LogIn,
    Package,
    FolderTree,
    Tag,
    Phone,
    Mail,
    FileText,
    LayoutDashboard,
    ArrowRight,
    Lock,
    BookOpen,
} from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'Accès & gestion | Sweet Emballages',
    description:
        "Comment accéder à l'espace d'administration et gérer le site Sweet Emballages : connexion, produits, catégories, messages et devis.",
}

const adminSections = [
    {
        icon: Package,
        title: 'Produits',
        href: '/admin',
        description: 'Gérer le catalogue : ajouter, modifier, rechercher et supprimer des produits.',
    },
    {
        icon: FolderTree,
        title: 'Catégories',
        href: '/admin/categories',
        description: 'Organiser les familles de produits (Sacs, Boîtes, Gobelets, etc.).',
    },
    {
        icon: Tag,
        title: 'Usages',
        href: '/admin/usages',
        description: 'Gérer les contextes d\'utilisation (Boulangerie, Restauration, Traiteur, etc.).',
    },
    {
        icon: Phone,
        title: 'Infos contact',
        href: '/admin/contact',
        description: 'Téléphone, email, adresse affichés sur la page Contact et dans le pied de page.',
    },
    {
        icon: Mail,
        title: 'Messages',
        href: '/admin/messages',
        description: 'Messages envoyés via le formulaire de contact du site.',
    },
    {
        icon: FileText,
        title: 'Devis',
        href: '/admin/devis',
        description: 'Demandes de devis envoyées depuis le site.',
    },
]

const quickTips = [
    'Utilisez un navigateur moderne (Chrome, Edge, Firefox) à jour.',
    'Déconnectez-vous de l\'admin lorsque vous avez terminé.',
    'Les pastilles à côté de Messages et Devis indiquent le nombre de non lus.',
    'En cas de problème, notez la date/heure et contactez votre prestataire technique.',
]

export default async function AccesPage() {
    const cookieStore = await cookies()
    const accesCookie = cookieStore.get(COOKIE_NAME)
    if (!verifyAccesCookie(accesCookie?.value)) {
        return (
            <main className="min-h-screen bg-background flex flex-col pt-16 lg:pt-20">
                <Navbar />
                <AccesPinGate />
                <Footer />
            </main>
        )
    }
    return (
        <main className="min-h-screen bg-background flex flex-col pt-16 lg:pt-20">
            <Navbar />

            {/* Hero */}
            <section className="relative overflow-hidden bg-charcoal text-white">
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                />
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-kraft/[0.08] to-transparent" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-kraft/10 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <FadeIn>
                        <span className="inline-flex items-center gap-2 text-xs font-semibold text-kraft uppercase tracking-[0.2em] mb-5">
                            <span className="w-6 h-px bg-kraft" />
                            Guide client
                        </span>
                        <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-[1.08] mb-5 text-white">
                            Accès & gestion du site
                        </h1>
                        <p className="font-sans text-lg text-white/65 max-w-xl leading-relaxed mb-8">
                            Comment vous connecter à l&apos;espace d&apos;administration et gérer
                            produits, catégories, messages et devis.
                        </p>
                        <Link
                            href="/admin/login"
                            className="inline-flex items-center gap-2 font-sans text-sm font-semibold bg-kraft text-white px-5 py-2.5 rounded-lg hover:bg-kraft-hover transition-colors group"
                        >
                            <LogIn className="w-4 h-4" />
                            Se connecter à l&apos;admin
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </FadeIn>
                </div>
            </section>

            {/* How to access */}
            <section className="bg-white border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <FadeIn>
                        <span className="font-sans text-xs font-semibold text-kraft uppercase tracking-widest">
                            Accès
                        </span>
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal mt-2 mb-8">
                            Comment accéder à l&apos;administration
                        </h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 gap-6">
                        <FadeIn delay={0.05}>
                            <div className="p-6 rounded-2xl border border-border bg-background hover:border-kraft hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-xl bg-kraft/10 flex items-center justify-center mb-4">
                                    <Lock className="w-6 h-6 text-kraft" />
                                </div>
                                <h3 className="font-heading text-lg font-bold text-charcoal mb-2">
                                    1. Connexion
                                </h3>
                                <p className="font-sans text-sm text-muted leading-relaxed mb-4">
                                    Ouvrez l&apos;URL d&apos;administration. Si vous n&apos;êtes pas connecté,
                                    vous serez redirigé vers la page de connexion. Saisissez l&apos;email
                                    et le mot de passe fournis, puis cliquez sur « Se connecter ».
                                </p>
                                <Link
                                    href="/admin/login"
                                    className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-kraft hover:text-kraft-hover transition-colors"
                                >
                                    Page de connexion
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <div className="p-6 rounded-2xl border border-border bg-background hover:border-kraft hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-xl bg-kraft/10 flex items-center justify-center mb-4">
                                    <LayoutDashboard className="w-6 h-6 text-kraft" />
                                </div>
                                <h3 className="font-heading text-lg font-bold text-charcoal mb-2">
                                    2. Tableau de bord
                                </h3>
                                <p className="font-sans text-sm text-muted leading-relaxed mb-4">
                                    Une fois connecté, le menu latéral affiche toutes les sections :
                                    Produits, Catégories, Usages, Infos contact, Messages et Devis.
                                    Utilisez le bouton « Déconnexion » en bas du menu pour quitter.
                                </p>
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-kraft hover:text-kraft-hover transition-colors"
                                >
                                    Accéder à l&apos;admin
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* Manage: links to each admin section */}
            <section className="bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <FadeIn>
                        <span className="font-sans text-xs font-semibold text-kraft uppercase tracking-widest">
                            Gestion
                        </span>
                        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-charcoal mt-2 mb-2">
                            Que gérer et où
                        </h2>
                        <p className="font-sans text-muted mb-10 max-w-2xl">
                            Chaque section de l&apos;admin a un rôle précis. Voici les liens directs et
                            un résumé de ce que vous pouvez y faire.
                        </p>
                    </FadeIn>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {adminSections.map((section, i) => (
                            <FadeIn key={section.href} delay={i * 0.05}>
                                <Link
                                    href={section.href}
                                    className="group flex gap-4 p-5 rounded-2xl border border-border bg-white hover:border-kraft hover:shadow-md transition-all"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-kraft/10 flex items-center justify-center flex-shrink-0 group-hover:bg-kraft/20 transition-colors">
                                        <section.icon className="w-5 h-5 text-kraft" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-heading text-sm font-bold text-charcoal group-hover:text-kraft transition-colors mb-1">
                                            {section.title}
                                        </h3>
                                        <p className="font-sans text-xs text-muted leading-relaxed">
                                            {section.description}
                                        </p>
                                        <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-kraft mt-2">
                                            Ouvrir
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick tips + CTA */}
            <section className="bg-white border-t border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <FadeIn>
                            <span className="font-sans text-xs font-semibold text-kraft uppercase tracking-widest">
                                Bonnes pratiques
                            </span>
                            <h2 className="font-heading text-2xl font-bold text-charcoal mt-2 mb-6">
                                Recommandations
                            </h2>
                            <ul className="space-y-3">
                                {quickTips.map((tip, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-3 font-sans text-sm text-muted leading-relaxed"
                                    >
                                        <span className="text-kraft mt-0.5">•</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>
                        <FadeInRight>
                            <div className="relative overflow-hidden rounded-2xl bg-charcoal text-white p-8">
                                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-kraft/10 blur-2xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-kraft/20 flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-7 h-7 text-kraft" />
                                    </div>
                                    <div>
                                        <p className="font-heading text-lg font-bold mb-1">
                                            Guide client complet
                                        </p>
                                        <p className="font-sans text-sm text-white/60 mb-4">
                                            Pour plus de détails (connexion, produits, catégories,
                                            messages, devis, dépannage), consultez le document
                                            CLIENT_GUIDE.md fourni avec le projet.
                                        </p>
                                        <Link
                                            href="/admin/login"
                                            className="inline-flex items-center gap-2 bg-kraft text-white font-sans text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-kraft-hover transition-colors w-fit"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Se connecter
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </FadeInRight>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
