import { supabase } from '@/lib/supabase'
import { DevisClient } from './DevisClient'

export const revalidate = 0

export default async function DevisAdminPage() {
    const { data: devis, error } = await supabase
        .from('demandes_devis')
        .select('*')
        .order('created_at', { ascending: false })

    return <DevisClient devis={devis ?? []} error={error?.message} />
}
