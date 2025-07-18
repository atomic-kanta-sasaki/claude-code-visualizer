import { ConversationTimeline } from '@/features/context-viewer'

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
        <p className="text-muted-foreground">
          View and analyze your conversation history
        </p>
      </div>
      <ConversationTimeline />
    </div>
  )
}