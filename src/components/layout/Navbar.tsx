"use client"
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight } from 'lucide-react'

const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/produits', label: 'Produits' },
    { href: '/personnalisation', label: 'Personnalisation' },
]

export function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [mobileMenuOpen])

    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.5 }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    }

    const linkContainerVariants = {
        closed: { opacity: 0 },
        open: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const linkVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/logobrownblack.png"
                                alt="Sweet Emballages Logo"
                                width={160}
                                height={48}
                                className="h-10 lg:h-12 w-auto object-contain"
                                style={{ height: 'auto' }}
                                priority
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="font-sans text-sm font-medium text-muted hover:text-charcoal transition-colors relative group"
                                >
                                    {link.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-kraft group-hover:w-full transition-all duration-300" />
                                </Link>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link
                                href="/contact"
                                className="font-sans text-sm font-medium text-muted hover:text-charcoal transition-colors relative group"
                            >
                                Contact
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-kraft group-hover:w-full transition-all duration-300" />
                            </Link>
                            <Link
                                href="/devis"
                                className="font-sans text-sm font-semibold bg-charcoal text-white px-5 py-2.5 rounded-lg hover:bg-[#3D3D3D] transition-colors"
                            >
                                Demander un devis
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2.5 text-charcoal bg-white/50 hover:bg-white/80 border border-border/50 rounded-full backdrop-blur-md transition-all z-[60] relative"
                            aria-label="Toggle menu flex items-center justify-center"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            ) : (
                                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                            )}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Modern Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={menuVariants}
                        className="fixed inset-0 z-40 lg:hidden bg-[#FAF9F6] flex flex-col pt-24 px-6 pb-10 overflow-y-auto"
                    >

                        <motion.div
                            variants={linkContainerVariants}
                            className="flex-1 flex flex-col justify-center space-y-6"
                        >
                            {/* Decorative element */}
                            <motion.div variants={linkVariants} className="text-[10px] font-black tracking-[0.2em] text-kraft uppercase opacity-70 mb-4">
                                Navigation
                            </motion.div>

                            {navLinks.map((link) => (
                                <motion.div key={link.href} variants={linkVariants}>
                                    <Link
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="group flex items-center justify-between font-heading text-4xl sm:text-5xl font-bold text-charcoal py-2 hover:text-kraft transition-colors"
                                    >
                                        <span>{link.label}</span>
                                        <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-kraft group-hover:bg-kraft group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div variants={linkVariants}>
                                <Link
                                    href="/contact"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="group flex items-center justify-between font-heading text-4xl sm:text-5xl font-bold text-charcoal py-2 hover:text-kraft transition-colors"
                                >
                                    <span>Contact</span>
                                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-kraft group-hover:bg-kraft group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Bottom Actions */}
                        <motion.div
                            variants={linkContainerVariants}
                            className="mt-8 space-y-4"
                        >
                            <motion.div variants={linkVariants}>
                                <div className="h-px w-full bg-border mb-8" />
                            </motion.div>

                            <motion.div variants={linkVariants} className="flex flex-col gap-4">
                                <Link
                                    href="/devis"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center font-sans text-lg font-bold uppercase tracking-wider bg-charcoal text-white px-6 py-5 rounded-xl hover:bg-[#3D3D3D] transition-colors shadow-xl w-full"
                                >
                                    Demander un devis
                                </Link>
                                <div className="flex justify-between items-center text-xs text-muted font-sans mt-2">
                                    <span>© 2026 Sweet Emballages</span>
                                    <span className="uppercase tracking-widest text-kraft font-bold">100% Pro</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
