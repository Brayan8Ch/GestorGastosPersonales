import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { SavingsPlatform, PlatformType } from '@/types'

export interface PlatformPayload {
  user_id: string
  name: string
  type: PlatformType
  balance: number
  color: string
}

export function useSavings(userId: string) {
  const [platforms, setPlatforms] = useState<SavingsPlatform[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('savings_platforms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if (!error) setPlatforms(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const save = async (payload: PlatformPayload, id?: string) => {
    if (id) {
      await supabase.from('savings_platforms').update(payload).eq('id', id)
    } else {
      await supabase.from('savings_platforms').insert(payload)
    }
    await load()
  }

  const remove = async (id: string) => {
    await supabase.from('savings_platforms').delete().eq('id', id)
    await load()
  }

  const total = platforms.reduce((s, p) => s + p.balance, 0)

  return { platforms, loading, save, remove, total }
}
