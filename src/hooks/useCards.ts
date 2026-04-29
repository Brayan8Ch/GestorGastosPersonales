import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Card, CardType } from '@/types'

export interface CardPayload {
  user_id: string
  name: string
  bank: string
  last4: string
  type: CardType
  color: string
}

export function useCards(userId: string) {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if (!error) setCards(data ?? [])
    setLoading(false)
  }, [userId])

  useEffect(() => { load() }, [load])

  const save = async (payload: CardPayload, id?: string) => {
    if (id) {
      await supabase.from('cards').update(payload).eq('id', id)
    } else {
      await supabase.from('cards').insert(payload)
    }
    await load()
  }

  const remove = async (id: string) => {
    await supabase.from('cards').delete().eq('id', id)
    await load()
  }

  return { cards, loading, save, remove }
}
