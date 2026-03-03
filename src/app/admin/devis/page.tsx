import { createClient } from '@supabase/supabase-js'
import { DevisClient } from './DevisClient'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 0

export default async function DevisAdminPage() {
    const { data: devis, error } = await supabase
        .from('demandes_devis')
        .select('*')
        .order('created_at', { ascending: false })

    return <DevisClient devis={devis ?? []} error={error?.message} />
}
