import { SessionList } from '@/features/session-tracker'

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
        <p className="text-muted-foreground">
          View and manage your conversation sessions
        </p>
      </div>
      <SessionList />
    </div>
  )
}