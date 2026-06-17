"use client"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me')
                if (res.ok) {
                    setIsAuthenticated(true)
                    if (pathname.includes('/admin/login')) {
                        router.push('/admin')
                    }
                } else {
                    setIsAuthenticated(false)
                    if (!pathname.includes('/admin/login')) {
                        router.push('/admin/login')
                    }
                }
            } catch {
                setIsAuthenticated(false)
                if (!pathname.includes('/admin/login')) {
                    router.push('/admin/login')
                }
            } finally {
                setIsLoading(false)
            }
        }

        void checkAuth()
    }, [pathname, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kraft"></div>
            </div>
        )
    }

    if (!isAuthenticated && !pathname.includes('/admin/login')) {
        return null
    }

    return <>{children}</>
}
