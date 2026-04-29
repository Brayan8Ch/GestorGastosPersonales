export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  category: string
  description: string | null
  date: string
  receipt_url: string | null
  card_id: string | null
  created_at: string
}

export interface TransactionPayload {
  user_id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
  receipt_url?: string | null
  card_id?: string | null
}

export type PlatformType = 'bank' | 'fintech' | 'crypto' | 'cash' | 'investment'
export type CardType = 'debit' | 'credit'

export interface SavingsPlatform {
  id: string
  user_id: string
  name: string
  type: PlatformType
  balance: number
  color: string
  created_at: string
}

export interface Card {
  id: string
  user_id: string
  name: string
  bank: string
  last4: string | null
  type: CardType
  color: string
  created_at: string
}

export type RiskLevel = 'healthy' | 'moderate' | 'elevated' | 'critical'

export interface RiskInfo {
  level: RiskLevel
  label: string
  ratio: number
  description: string
}
