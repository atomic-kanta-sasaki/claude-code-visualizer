'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ConversationTimeline } from '@/features/context-viewer'
import { useSessionStore } from '@/entities/session'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function ConversationsContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session')
  const { sessions, selectSession } = useSessionStore()

  useEffect(() => {
    if (sessionId && sessions.length > 0) {
      const session = sessions.find(s => s.id === sessionId)
      if (session) {
        selectSession(session)
      }
    }
  }, [sessionId, sessions, selectSession])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/sessions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sessions
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">
            View and analyze your conversation history
          </p>
        </div>
      </div>
      <ConversationTimeline />
    </div>
  )
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConversationsContent />
    </Suspense>
  )
}