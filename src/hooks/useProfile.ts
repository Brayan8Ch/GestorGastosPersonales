import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  email: string
  role: 'user' | 'superadmin'
}

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error) console.error('[useProfile]', error)
        setProfile(data)
        setLoading(false)
      })
  }, [user?.id])

  return { profile, loading }
}
