import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Transaction, TransactionPayload } from '@/types'

export function useTransactions(userId: string, month: number, year: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]

  const load = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (!error) setTransactions(data ?? [])
    setLoading(false)
  }, [userId, startDate, endDate])

  useEffect(() => { load() }, [load])

  const save = async (payload: TransactionPayload, id?: string) => {
    if (id) {
      await supabase.from('transactions').update(payload).eq('id', id)
    } else {
      await supabase.from('transactions').insert(payload)
    }
    await load()
  }

  const remove = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id)
    await load()
  }

  const uploadReceipt = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('receipts').upload(path, file)
    if (error) throw error
    return path
  }

  const getReceiptUrl = async (path: string): Promise<string> => {
    const { data, error } = await supabase.storage.from('receipts').createSignedUrl(path, 3600)
    if (error) throw error
    return data.signedUrl
  }

  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  return { transactions, loading, save, remove, uploadReceipt, getReceiptUrl, income, expense, balance }
}
