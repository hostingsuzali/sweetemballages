import { createClient } from '@supabase/supabase-js'

export interface ContactInfoData {
  phone: string
  phoneHours: string
  email: string
  emailResponseTime: string
  addressLine1: string
  addressLine2: string
  addressCountry: string
}

const defaults: ContactInfoData = {
  phone: '076 504 10 69',
  phoneHours: 'Lun–ven, 8h–18h',
  email: 'contact@sweetemballages.ch',
  emailResponseTime: 'Réponse sous 24h ouvrées',
  addressLine1: 'Route de la Venoge 2',
  addressLine2: '1302 Vufflens-la-Ville',
  addressCountry: 'Suisse',
}

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/** Fetch contact info for display (contact page, footer). Use in server components. */
export async function getContactInfo(): Promise<ContactInfoData> {
  const supabase = getServerSupabase()
  if (!supabase) return defaults

  const { data } = await supabase
    .from('contact_info')
    .select('phone, phone_hours, email, email_response_time, address_line1, address_line2, address_country')
    .eq('id', 'default')
    .maybeSingle()

  if (!data) return defaults

  return {
    phone: data.phone ?? defaults.phone,
    phoneHours: data.phone_hours ?? defaults.phoneHours,
    email: data.email ?? defaults.email,
    emailResponseTime: data.email_response_time ?? defaults.emailResponseTime,
    addressLine1: data.address_line1 ?? defaults.addressLine1,
    addressLine2: data.address_line2 ?? defaults.addressLine2,
    addressCountry: data.address_country ?? defaults.addressCountry,
  }
}
