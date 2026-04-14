"use client"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        let cancelled = false

        const finishLoading = () => {
            if (!cancelled) setIsLoading(false)
        }

        const applySession = (session: Session | null) => {
            const isAuth = !!session
            setIsAuthenticated(isAuth)
            if (!isAuth && !pathname.includes('/admin/login')) {
                router.push('/admin/login')
            } else if (isAuth && pathname.includes('/admin/login')) {
                router.push('/admin')
            }
        }

        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (cancelled) return
                applySession(session)
            } catch {
                if (!cancelled) {
                    setIsAuthenticated(false)
                    if (!pathname.includes('/admin/login')) router.push('/admin/login')
                }
            } finally {
                finishLoading()
            }
        }

        void checkAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            applySession(session)
            finishLoading()
        })

        return () => {
            cancelled = true
            subscription.unsubscribe()
        }
    }, [pathname, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kraft"></div>
            </div>
        )
    }

    if (!isAuthenticated && !pathname.includes('/admin/login')) {
        return null // Will redirect
    }

    return <>{children}</>
}
