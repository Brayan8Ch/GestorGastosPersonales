import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Transaction } from '@/types'

function buildDailyData(transactions: Transaction[], year: number, month: number) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const daily: Record<string, { income: number; expense: number }> = {}

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    daily[key] = { income: 0, expense: 0 }
  }

  for (const t of transactions) {
    if (daily[t.date]) daily[t.date][t.type] += t.amount
  }

  let running = 0
  return Object.entries(daily).map(([date, vals]) => {
    running += vals.income - vals.expense
    return {
      day: date.split('-')[2],
      income: vals.income,
      expense: vals.expense,
      balance: running,
    }
  })
}

function formatK(n: number) {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (Math.abs(n) >= 1_000)     return `$${(n / 1_000).toFixed(0)}k`
  return `$${n.toFixed(0)}`
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: {value: number; dataKey: string}[]; label?: string }) {
  if (!active || !payload?.length) return null
  const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-xl text-xs space-y-1 min-w-[130px]">
      <p className="text-muted-foreground font-medium mb-1.5">Día {label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex justify-between gap-4">
          <span className="text-muted-foreground capitalize">{p.dataKey === 'income' ? 'Ingresos' : p.dataKey === 'expense' ? 'Egresos' : 'Balance'}</span>
          <span className={`num font-semibold ${p.dataKey === 'income' ? 'text-primary' : p.dataKey === 'expense' ? 'text-destructive' : 'text-foreground'}`}>
            {fmt.format(p.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

interface Props {
  transactions: Transaction[]
  month: number
  year: number
}

export function TrendChart({ transactions, month, year }: Props) {
  const data = buildDailyData(transactions, year, month)
  const hasData = transactions.length > 0
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  const animDuration = prefersReducedMotion ? 0 : 900

  return (
    <Card className="bento-card col-span-2 md:col-span-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Flujo mensual
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[180px] flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Sin datos este mes</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3ecf8e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f04444" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f04444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: 'oklch(0.62 0 0)', fontFamily: 'IBM Plex Mono' }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'oklch(0.62 0 0)', fontFamily: 'IBM Plex Mono' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatK}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area dataKey="income"  type="monotone" stroke="#3ecf8e" strokeWidth={1.5} fill="url(#incomeGrad)"  dot={false} animationDuration={animDuration} />
              <Area dataKey="expense" type="monotone" stroke="#f04444" strokeWidth={1.5} fill="url(#expenseGrad)" dot={false} animationDuration={animDuration} animationBegin={100} />
              <Area dataKey="balance" type="monotone" stroke="#6366f1" strokeWidth={1.5} fill="url(#balanceGrad)" dot={false} animationDuration={animDuration} animationBegin={200} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        )}
        <div className="flex gap-4 mt-2 justify-end">
          {[['#3ecf8e','Ingresos'],['#f04444','Egresos'],['#6366f1','Balance']].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-0.5 rounded" style={{ background: c }} />
              {l}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
