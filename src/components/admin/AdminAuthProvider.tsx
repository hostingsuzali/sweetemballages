"use client"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            const isAuth = !!session
            setIsAuthenticated(isAuth)

            if (!isAuth && !pathname.includes('/admin/login')) {
                router.push('/admin/login')
            } else if (isAuth && pathname.includes('/admin/login')) {
                router.push('/admin')
            }

            setIsLoading(false)
        }

        checkAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            const isAuth = !!session
            setIsAuthenticated(isAuth)
            if (!isAuth && !pathname.includes('/admin/login')) {
                router.push('/admin/login')
            } else if (isAuth && pathname.includes('/admin/login')) {
                router.push('/admin')
            }
        })

        return () => subscription.unsubscribe()
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
