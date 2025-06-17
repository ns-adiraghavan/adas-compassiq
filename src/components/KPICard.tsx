
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  trend?: number
  subtitle?: string
  icon?: React.ReactNode
}

export function KPICard({ title, value, trend, subtitle, icon }: KPICardProps) {
  return (
    <Card className="hover-lift hover-glow animate-scale-in bg-gradient-to-br from-card/50 to-card border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center pt-1">
            {trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <span className={`text-xs ml-1 font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
