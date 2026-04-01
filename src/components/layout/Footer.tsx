import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import { getContactInfo } from '@/lib/contact-info'

const footerLinks = {
    produits: [
        { label: 'Boîtes à pizza', href: '/produits?category=snacks' },
        { label: 'Sacs alimentaires', href: '/produits?category=sacs-sacherie' },
        { label: 'Gobelets & vaisselle', href: '/produits?category=gob-vais-jet' },
        { label: 'Papier & aluminium', href: '/produits?category=hygiene-emballages' },
        { label: 'Boîtes repas', href: '/produits?category=plats-emporter' },
    ],
    services: [
        { label: 'Personnalisation logo', href: '/personnalisation' },
        { label: 'Demander un devis', href: '/devis' },
        { label: 'Catalogue complet', href: '/produits' },
    ],
    entreprise: [
        { label: 'À propos', href: '/contact' },
        { label: 'Contact', href: '/contact' },
    ],
}

export async function Footer() {
    const contact = await getContactInfo()
    const telHref = contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : null

    return (
        <footer className="bg-charcoal text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <Image
                                src="/logobrownblack.png"
                                alt="Sweet Emballages Logo"
                                width={160}
                                height={40}
                                className="h-10 w-auto object-contain brightness-0 invert"
                                style={{ width: 'auto' }}
                            />
                        </Link>
                        <p className="font-sans text-[#A0A0A0] leading-relaxed mb-6 max-w-sm">
                            Votre fournisseur d&apos;emballages alimentaires professionnels en
                            Suisse. Service réservé aux professionnels des métiers de bouche.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            {contact.phone && (
                                <a
                                    href={telHref ?? '#'}
                                    className="flex items-center gap-3 text-[#A0A0A0] hover:text-white transition-colors"
                                >
                                    <Phone className="w-4 h-4 text-kraft" />
                                    <span className="font-sans text-sm">{contact.phone}</span>
                                </a>
                            )}
                            {contact.email && (
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="flex items-center gap-3 text-[#A0A0A0] hover:text-white transition-colors"
                                >
                                    <Mail className="w-4 h-4 text-kraft" />
                                    <span className="font-sans text-sm">{contact.email}</span>
                                </a>
                            )}
                            {(contact.addressLine1 || contact.addressLine2 || contact.addressCountry) && (
                                <div className="flex items-start gap-3 text-[#A0A0A0]">
                                    <MapPin className="w-4 h-4 text-kraft mt-0.5" />
                                    <span className="font-sans text-sm">
                                        {contact.addressLine1}
                                        {(contact.addressLine2 || contact.addressCountry) && (
                                            <>
                                                {contact.addressLine1 && <br />}
                                                {[contact.addressLine2, contact.addressCountry].filter(Boolean).join(', ')}
                                            </>
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-heading font-bold text-white mb-4">
                            Produits
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.produits.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="font-sans text-sm text-[#A0A0A0] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-heading font-bold text-white mb-4">
                            Services
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="font-sans text-sm text-[#A0A0A0] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-heading font-bold text-white mb-4">
                            Entreprise
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.entreprise.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="font-sans text-sm text-[#A0A0A0] hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#3D3D3D]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="font-sans text-sm text-[#A0A0A0]">
                            © {new Date().getFullYear()} SWEET EMBALLAGES. Tous droits
                            réservés.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="font-sans text-xs text-muted">
                                Service réservé aux professionnels
                            </span>
                            <span className="w-2 h-2 bg-green rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
