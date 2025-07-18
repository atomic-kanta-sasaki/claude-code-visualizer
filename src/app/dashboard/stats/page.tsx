import { StatsOverview } from '@/widgets/claude-dashboard/ui/stats-overview'

export default function StatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground">
          Overview of your usage and performance metrics
        </p>
      </div>
      <StatsOverview />
    </div>
  )
}