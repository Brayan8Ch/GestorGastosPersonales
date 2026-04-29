import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RiskCard } from '@/components/dashboard/RiskCard'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { TrendChart } from '@/components/dashboard/TrendChart'
import { SavingsCard } from '@/components/dashboard/SavingsCard'
import { CardsCard } from '@/components/dashboard/CardsCard'
import type { Card as CardType, SavingsPlatform, Transaction } from '@/types'
import type { PlatformPayload } from '@/hooks/useSavings'
import type { CardPayload } from '@/hooks/useCards'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function formatARS(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function formatDate(s: string) {
  const [y, m, d] = s.split('-')
  return `${d}/${m}/${y}`
}

interface Props {
  transactions: Transaction[]
  income: number
  expense: number
  balance: number
  platforms: SavingsPlatform[]
  savingsTotal: number
  cards: CardType[]
  userId: string
  month: number
  year: number
  onAdd: () => void
  onOpenTransaction: (t: Transaction) => void
  onSavePlatform: (payload: PlatformPayload, id?: string) => Promise<void>
  onDeletePlatform: (id: string) => Promise<void>
  onSaveCard: (payload: CardPayload, id?: string) => Promise<void>
  onDeleteCard: (id: string) => Promise<void>
}

export function DashboardPage({
  transactions, income, expense, balance,
  platforms, savingsTotal, cards, userId, month, year,
  onAdd, onOpenTransaction, onSavePlatform, onDeletePlatform, onSaveCard, onDeleteCard,
}: Props) {
  const recent = transactions.slice(0, 6)
  const isPositive = balance >= 0

  return (
    <div className="bento grid grid-cols-2 md:grid-cols-6 gap-3 auto-rows-auto">

      {/* ── Balance ── col-span-4 */}
      <Card className="bento-card col-span-2 md:col-span-4 relative overflow-hidden border-border/60">
        {/* subtle gradient mesh */}
        <div className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse 60% 80% at 10% 50%, ${isPositive ? '#3ecf8e' : '#f04444'}18, transparent)` }} />
        <CardHeader className="pb-1 relative">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Balance mensual
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <p className={`num text-5xl font-semibold tracking-tight leading-none ${isPositive ? 'text-primary' : 'text-destructive'}`}>
            {formatARS(balance)}
          </p>
          <div className="flex items-center gap-5 mt-5">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Ingresos</p>
              <p className="num text-xl font-semibold text-primary">{formatARS(income)}</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Egresos</p>
              <p className="num text-xl font-semibold text-destructive">{formatARS(expense)}</p>
            </div>
            {income > 0 && (
              <>
                <div className="w-px h-8 bg-border" />
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Tasa ahorro</p>
                  <p className={`num text-xl font-semibold ${isPositive ? 'text-primary' : 'text-destructive'}`}>
                    {(((income - expense) / income) * 100).toFixed(0)}%
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Risk + Add button ── col-span-2 */}
      <div className="col-span-2 md:col-span-2 flex flex-col gap-3">
        <button
          onClick={onAdd}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nueva transacción
        </button>
        <RiskCard income={income} expense={expense} />
      </div>

      {/* ── Trend chart ── col-span-4 */}
      <TrendChart transactions={transactions} month={month} year={year} />

      {/* ── Expense donut ── col-span-2 */}
      <div className="col-span-2 md:col-span-2">
        <ExpenseChart transactions={transactions} />
      </div>

      {/* ── Savings ── col-span-4 */}
      <div className="col-span-2 md:col-span-4">
        <SavingsCard
          platforms={platforms}
          total={savingsTotal}
          userId={userId}
          onSave={onSavePlatform}
          onDelete={onDeletePlatform}
        />
      </div>

      {/* ── Cards ── col-span-2 */}
      <div className="col-span-2 md:col-span-2">
        <CardsCard
          cards={cards}
          userId={userId}
          onSave={onSaveCard}
          onDelete={onDeleteCard}
        />
      </div>

      {/* ── Recent transactions ── col-span-4 */}
      <Card className="bento-card col-span-2 md:col-span-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Últimas transacciones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-2">
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No hay transacciones este mes.</p>
          ) : recent.map(t => (
            <button
              key={t.id}
              onClick={() => onOpenTransaction(t)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors text-left group focus-visible:outline-none focus-visible:bg-muted/40"
            >
              <div className={`w-1 h-7 rounded-full flex-shrink-0 ${t.type === 'income' ? 'bg-primary' : 'bg-destructive'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none mb-0.5">{t.category}</p>
                <p className="text-xs text-muted-foreground truncate">{t.description || formatDate(t.date)}</p>
              </div>
              <span className={`num text-sm font-semibold flex-shrink-0 ${t.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                {t.type === 'income' ? '+' : '−'}{formatARS(t.amount)}
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

    </div>
  )
}

export { MONTHS }
