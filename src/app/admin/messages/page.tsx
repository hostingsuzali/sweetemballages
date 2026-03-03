import { createClient } from '@supabase/supabase-js'
import { MessagesClient } from './MessagesClient'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const revalidate = 0

export default async function MessagesAdminPage() {
    const { data: messages, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    return <MessagesClient messages={messages ?? []} error={error?.message} />
}
