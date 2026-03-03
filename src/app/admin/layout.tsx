"use client"
import { AdminAuthProvider } from '@/components/admin/AdminAuthProvider'
import { LogOut, Package2, Tags, Workflow, MessageSquare, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

interface NavCounts {
    messages: number
    devis: number
}

const NavLink = ({
    href,
    icon: Icon,
    label,
    active,
    badge,
}: {
    href: string
    icon: React.ElementType
    label: string
    active: boolean
    badge?: number
}) => (
    <Link
        href={href}
        className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${active ? 'bg-kraft/10 text-kraft' : 'text-charcoal hover:bg-gray-50'}`}
    >
        <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5" />
            <span>{label}</span>
        </div>
        {badge && badge > 0 ? (
            <span className="text-[11px] font-bold text-white bg-amber-500 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                {badge > 99 ? '99+' : badge}
            </span>
        ) : null}
    </Link>
)

const Sidebar = ({ counts }: { counts: NavCounts }) => {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-white border-r border-border flex flex-col hidden md:flex min-h-screen">
            <div className="p-6 border-b border-border flex items-center gap-3">
                <Image
                    src="/logobrownblack.png"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="h-8 w-auto object-contain"
                />
                <span className="font-heading text-xl font-bold text-charcoal border-l border-border pl-3">
                    Admin
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-1 font-sans">
                <NavLink
                    href="/admin"
                    icon={Package2}
                    label="Produits"
                    active={pathname === '/admin'}
                />
                <NavLink
                    href="/admin/categories"
                    icon={Tags}
                    label="Catégories"
                    active={pathname?.includes('/admin/categories') ?? false}
                />
                <NavLink
                    href="/admin/usages"
                    icon={Workflow}
                    label="Usages"
                    active={pathname?.includes('/admin/usages') ?? false}
                />

                {/* Divider */}
                <div className="pt-3 pb-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4">
                        Formulaires
                    </div>
                </div>

                <NavLink
                    href="/admin/messages"
                    icon={MessageSquare}
                    label="Messages"
                    active={pathname?.includes('/admin/messages') ?? false}
                    badge={counts.messages}
                />
                <NavLink
                    href="/admin/devis"
                    icon={FileText}
                    label="Devis"
                    active={pathname?.includes('/admin/devis') ?? false}
                    badge={counts.devis}
                />
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={() => supabase.auth.signOut()}
                    className="flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg text-muted hover:bg-gray-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Déconnexion</span>
                </button>
            </div>
        </aside>
    )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname?.includes('/admin/login')
    const [counts, setCounts] = useState<NavCounts>({ messages: 0, devis: 0 })

    useEffect(() => {
        const fetchCounts = async () => {
            const [messagesRes, devisRes] = await Promise.all([
                supabase.from('contact_messages').select('id', { count: 'exact' }).eq('is_read', false),
                supabase.from('demandes_devis').select('id', { count: 'exact' }).eq('is_read', false),
            ])
            setCounts({
                messages: messagesRes.count ?? 0,
                devis: devisRes.count ?? 0,
            })
        }

        if (!isLoginPage) {
            fetchCounts()
            // Refresh every 60s
            const interval = setInterval(fetchCounts, 60_000)
            return () => clearInterval(interval)
        }
    }, [isLoginPage])

    return (
        <AdminAuthProvider>
            {isLoginPage ? (
                children
            ) : (
                <div className="min-h-screen bg-background flex">
                    <Sidebar counts={counts} />

                    <main className="flex-1 overflow-auto">
                        {/* Mobile Header */}
                        <div className="md:hidden bg-white border-b border-border p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Image
                                    src="/logobrownblack.png"
                                    alt="Logo"
                                    width={24}
                                    height={24}
                                    className="h-6 w-auto object-contain"
                                />
                                <span className="font-heading text-lg font-bold">Admin</span>
                            </div>
                            <button onClick={() => supabase.auth.signOut()}><LogOut className="w-5 h-5" /></button>
                        </div>
                        <div className="p-8">
                            {children}
                        </div>
                    </main>
                </div>
            )}
        </AdminAuthProvider>
    )
}
