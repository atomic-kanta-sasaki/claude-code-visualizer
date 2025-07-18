import { DashboardNav } from '@/widgets/claude-dashboard/ui/dashboard-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}