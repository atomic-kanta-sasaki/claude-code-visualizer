'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TodoBoard } from '@/features/todo-dashboard'
import { useSessionStore } from '@/entities/session'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function TodosContent() {
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
          <Link href="/dashboard/conversations">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Conversations
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
          <p className="text-muted-foreground">
            Manage your tasks and action items
          </p>
        </div>
      </div>
      <TodoBoard />
    </div>
  )
}

export default function TodosPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodosContent />
    </Suspense>
  )
}