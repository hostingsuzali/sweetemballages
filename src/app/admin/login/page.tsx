"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Mail, Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (signInError) throw signInError

            router.push('/admin')
        } catch (err) {
            const error = err as Error
            setError(error.message || 'Error occurred during sign in')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-border p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-kraft" />

                <div className="text-center mb-10 space-y-4">
                    <Image
                        src="/logobrownblack.png"
                        alt="Sweet Emballages Logo"
                        width={256}
                        height={64}
                        className="h-16 w-auto mx-auto object-contain"
                        priority
                    />
                    <h1 className="font-heading text-3xl font-bold text-charcoal">
                        Espace <span className="text-kraft">Admin</span>
                    </h1>
                    <p className="font-sans text-muted mt-2">
                        Connectez-vous pour gérer vos produits
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-charcoal mb-2 font-sans">
                            Adresse Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent transition-all outline-none text-charcoal"
                                placeholder="admin@sweetemballages.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-charcoal mb-2 font-sans">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-border rounded-xl focus:ring-2 focus:ring-kraft focus:border-transparent transition-all outline-none text-charcoal"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-kraft hover:bg-[#b09268] text-white rounded-xl font-medium transition-colors focus:ring-4 focus:ring-kraft/30 flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Connexion...</span>
                            </>
                        ) : (
                            <span>Se connecter</span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
