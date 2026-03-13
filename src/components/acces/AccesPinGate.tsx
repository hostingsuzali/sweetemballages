'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export function AccesPinGate() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const trimmed = pin.replace(/\D/g, '').slice(0, 6)
    if (trimmed.length !== 6) {
      setError('Le code doit comporter exactement 6 chiffres.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/acces/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: trimmed }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data?.error || 'Code incorrect.')
        setLoading(false)
        return
      }
      router.refresh()
    } catch {
      setError('Erreur de connexion.')
      setLoading(false)
    }
  }

  return (
    <section className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-kraft/10 flex items-center justify-center">
              <Lock className="w-7 h-7 text-kraft" />
            </div>
          </div>
          <h1 className="font-heading text-xl font-bold text-charcoal text-center mb-2">
            Accès au guide
          </h1>
          <p className="font-sans text-sm text-muted text-center mb-6">
            Saisissez le code PIN à 6 chiffres pour accéder à cette page.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              pattern="\d*"
              maxLength={6}
              placeholder="••••••"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-2xl tracking-[0.5em] font-mono rounded-xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-kraft focus:border-transparent"
              autoFocus
              disabled={loading}
            />
            {error && (
              <p className="font-sans text-sm text-red-600 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-sans text-sm font-semibold bg-charcoal text-white py-3 rounded-xl hover:bg-[#3D3D3D] transition-colors disabled:opacity-50"
            >
              {loading ? 'Vérification…' : 'Accéder'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
