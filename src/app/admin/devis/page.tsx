import { supabase } from '@/lib/supabase'
import { DevisClient } from './DevisClient'

export const revalidate = 0

export default async function DevisAdminPage() {
    const [{ data: devis, error }, { data: devisQuotes }] = await Promise.all([
        supabase.from('demandes_devis').select('*').order('created_at', { ascending: false }),
        supabase.from('devis').select('*').order('created_at', { ascending: false }),
    ])

    return <DevisClient devis={devis ?? []} devisQuotes={devisQuotes ?? []} error={error?.message} />
}
