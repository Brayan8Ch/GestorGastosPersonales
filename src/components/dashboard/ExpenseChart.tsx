import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Transaction } from '@/types'

const COLORS = ['#3ecf8e','#f59e0b','#06b6d4','#8b5cf6','#f97316','#ec4899','#10b981','#6366f1']

function formatARS(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: {name: string; value: number}[] }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg text-xs">
      <p className="font-medium mb-0.5">{payload[0].name}</p>
      <p className="num text-primary">{formatARS(payload[0].value)}</p>
    </div>
  )
}

interface Props { transactions: Transaction[] }

export function ExpenseChart({ transactions }: Props) {
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  const expenses = transactions.filter(t => t.type === 'expense')
  const byCategory = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount
    return acc
  }, {})
  const total = Object.values(byCategory).reduce((s, v) => s + v, 0)
  const data = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }))

  return (
    <Card className="bento-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Distribución egresos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {data.length === 0 ? (
          <div className="h-[160px] flex items-center justify-center">
            <p className="text-xs text-muted-foreground">Sin egresos este mes</p>
          </div>
        ) : (
          <>
            <p className="sr-only">Gráfico de torta con distribución de egresos: {data.map(d => `${d.name} ${((d.value / total) * 100).toFixed(0)}%`).join(', ')}</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={prefersReducedMotion ? 0 : 800}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {data.map(({ name, value }, i) => (
                <div key={name} className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="flex-1 text-muted-foreground truncate">{name}</span>
                  <span className="num font-medium">{total > 0 ? ((value / total) * 100).toFixed(0) : 0}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
