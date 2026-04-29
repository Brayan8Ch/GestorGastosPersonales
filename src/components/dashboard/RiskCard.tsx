import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function getRiskInfo(income: number, expense: number) {
  if (income === 0) {
    const hasCost = expense > 0
    return { label: hasCost ? 'Crítico' : 'Sin datos', ratio: hasCost ? 100 : 0, color: hasCost ? '#f04444' : '#555', description: hasCost ? 'Gastos sin ingresos.' : 'Registrá ingresos.' }
  }
  const ratio = Math.min((expense / income) * 100, 150)
  if (ratio <= 50)  return { label: 'Saludable', ratio, color: '#3ecf8e', description: 'Ahorrás más de la mitad de tus ingresos.' }
  if (ratio <= 75)  return { label: 'Moderado',  ratio, color: '#f59e0b', description: 'Tus gastos están en un rango normal.' }
  if (ratio <= 90)  return { label: 'Elevado',   ratio, color: '#f97316', description: 'Gastás la mayor parte de tus ingresos.' }
  return              { label: 'Crítico',   ratio, color: '#f04444', description: 'Tus gastos superan o rozan tus ingresos.' }
}

function formatARS(n: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

const R = 40
const CIRC = Math.PI * R        // semicircle circumference
const CX = 60, CY = 56

interface Props { income: number; expense: number }

export function RiskCard({ income, expense }: Props) {
  const risk = getRiskInfo(income, expense)
  const fill = (Math.min(risk.ratio, 100) / 100) * CIRC
  const dash = `${fill} ${CIRC}`
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false

  return (
    <Card className="bento-card flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Riesgo de gasto
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3 pt-2">
        {/* SVG semicircle gauge */}
        <div className="relative">
          <svg width="120" height="68" viewBox="0 0 120 68" aria-hidden="true">
            {/* track */}
            <path
              d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
              fill="none"
              stroke="oklch(1 0 0 / 8%)"
              strokeWidth="7"
              strokeLinecap="round"
            />
            {/* fill */}
            <path
              d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
              fill="none"
              stroke={risk.color}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={dash}
              strokeDashoffset={0}
              style={{
                transition: prefersReducedMotion ? 'none' : 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1), stroke 0.4s',
                filter: `drop-shadow(0 0 6px ${risk.color}66)`,
              }}
            />
            {/* needle dot */}
            <circle cx={CX} cy={CY - R + 3.5} r="0" fill={risk.color} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="num text-2xl font-semibold" style={{ color: risk.color }}>
              {risk.ratio.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="text-center space-y-1">
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border" style={{ color: risk.color, borderColor: `${risk.color}40`, background: `${risk.color}14` }}>
            {risk.label}
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[160px] mx-auto">
            {risk.description}
          </p>
        </div>

        {income > 0 && (
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="rounded-lg bg-muted/40 p-2.5 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Ingresos</p>
              <p className="num text-sm font-semibold text-primary">{formatARS(income)}</p>
            </div>
            <div className="rounded-lg bg-muted/40 p-2.5 border border-border/50">
              <p className="text-xs text-muted-foreground mb-1">Egresos</p>
              <p className="num text-sm font-semibold text-destructive">{formatARS(expense)}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
