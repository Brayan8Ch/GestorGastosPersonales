import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useTransactions } from '@/hooks/useTransactions'
import { useSavings } from '@/hooks/useSavings'
import { useCards } from '@/hooks/useCards'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthPage } from '@/pages/AuthPage'
import { DashboardPage, MONTHS } from '@/pages/DashboardPage'
import { TransactionsPage } from '@/pages/TransactionsPage'
import { SuperAdminPage } from '@/pages/SuperAdminPage'
import { TransactionModal } from '@/components/transactions/TransactionModal'
import { TransactionDetailModal } from '@/components/transactions/TransactionDetailModal'
import { ReceiptModal } from '@/components/transactions/ReceiptModal'
import type { Transaction, TransactionPayload } from '@/types'

type View = 'dashboard' | 'transactions' | 'admin'

export default function App() {
  const { user, loading, signIn, signOut } = useAuth()
  const { profile } = useProfile(user)

  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [view, setView] = useState<View>('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [receiptPath, setReceiptPath] = useState<string | null>(null)
  const [detailTx, setDetailTx] = useState<Transaction | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const userId = user?.id ?? ''

  const { transactions, save, remove, uploadReceipt, getReceiptUrl, income, expense, balance, carryover } =
    useTransactions(userId, month, year)
  const { platforms, total: savingsTotal, save: savePlatform, remove: deletePlatform } = useSavings(userId)
  const { cards, save: saveCard, remove: deleteCard } = useCards(userId)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <AuthPage onSignIn={signIn} />
  }

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) } else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) } else setMonth(m => m + 1)
  }

  const handleSave = async (payload: TransactionPayload, file?: File, id?: string) => {
    let receipt_url = editing?.receipt_url ?? null
    if (file) receipt_url = await uploadReceipt(file)
    await save({ ...payload, receipt_url }, id)
  }

  const openAdd = () => { setEditing(null); setModalOpen(true) }
  const openEdit = (t: Transaction) => { setEditing(t); setModalOpen(true) }
  const openDetail = (t: Transaction) => { setDetailTx(t); setDetailOpen(true) }

  const handleDelete = async (id: string) => {
    await remove(id)
  }

  return (
    <AppLayout
      email={user.email ?? ''}
      view={view}
      isSuperAdmin={profile?.role === 'superadmin'}
      onViewChange={setView}
      onSignOut={signOut}
      monthLabel={`${MONTHS[month - 1]} ${year}`}
      onPrevMonth={prevMonth}
      onNextMonth={nextMonth}
    >
      {view === 'admin' ? (
        <SuperAdminPage userId={userId} />
      ) : view === 'dashboard' ? (
        <DashboardPage
          transactions={transactions}
          income={income}
          expense={expense}
          balance={balance}
          carryover={carryover}
          platforms={platforms}
          savingsTotal={savingsTotal}
          cards={cards}
          userId={userId}
          month={month}
          year={year}
          onAdd={openAdd}
          onOpenTransaction={openDetail}
          onSavePlatform={savePlatform}
          onDeletePlatform={deletePlatform}
          onSaveCard={saveCard}
          onDeleteCard={deleteCard}
        />
      ) : (
        <TransactionsPage
          transactions={transactions}
          onAdd={openAdd}
          onEdit={openEdit}
          onDelete={handleDelete}
          onViewReceipt={path => setReceiptPath(path)}
          onDetail={openDetail}
        />
      )}

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        userId={userId}
        editing={editing}
        cards={cards}
      />

      <TransactionDetailModal
        transaction={detailTx}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onViewReceipt={path => { setDetailOpen(false); setReceiptPath(path) }}
      />

      <ReceiptModal
        path={receiptPath}
        onClose={() => setReceiptPath(null)}
        getUrl={getReceiptUrl}
      />
    </AppLayout>
  )
}
