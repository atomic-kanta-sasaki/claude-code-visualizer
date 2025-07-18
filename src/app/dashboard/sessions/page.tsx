'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SessionList } from '@/features/session-tracker'
import { useProjectStore } from '@/entities/project'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function SessionsContent() {
  const searchParams = useSearchParams()
  const projectId = searchParams?.get('project')
  const { projects, selectProject } = useProjectStore()

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p.id === projectId)
      if (project) {
        selectProject(project)
      }
    }
  }, [projectId, projects, selectProject])

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessions</h1>
          <p className="text-muted-foreground">
            View and manage your conversation sessions
          </p>
        </div>
      </div>
      <SessionList />
    </div>
  )
}

export default function SessionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionsContent />
    </Suspense>
  )
}