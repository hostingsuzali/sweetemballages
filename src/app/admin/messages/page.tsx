import { supabase } from '@/lib/supabase'
import { MessagesClient } from './MessagesClient'

export const revalidate = 0

export default async function MessagesAdminPage() {
    const { data: messages, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

    return <MessagesClient messages={messages ?? []} error={error?.message} />
}
