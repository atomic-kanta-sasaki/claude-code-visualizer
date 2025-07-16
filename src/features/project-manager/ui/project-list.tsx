'use client'

import { useEffect } from 'react'
import type { ClaudeProject } from '@/shared/types'
import { useProjectStore } from '@/entities/project'
import { useSessionStore } from '@/entities/session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Folder, Clock, MessageSquare, CheckCircle2, Loader2 } from 'lucide-react'

export function ProjectList() {
  const { 
    projects, 
    isLoading, 
    error, 
    fetchProjects, 
    selectProject, 
    selectedProject 
  } = useProjectStore()
  
  const { setSessions } = useSessionStore()

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleProjectSelect = (project: ClaudeProject) => {
    selectProject(project)
    setSessions(project.sessions)
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const isActiveProject = (lastActivity: Date | string) => {
    const activityDate = new Date(lastActivity)
    return activityDate.getTime() > Date.now() - 24 * 60 * 60 * 1000
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading projects...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
        <Button onClick={fetchProjects} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No Claude projects found</p>
        <p className="text-sm mt-2">Make sure you have Claude CLI projects in ~/.claude/projects</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
      
      <div className="grid gap-4">
        {projects.map((project) => (
          <Card 
            key={project.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProject?.id === project.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleProjectSelect(project)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                </div>
                <Badge variant="secondary">
                  {project.totalSessions} sessions
                </Badge>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {project.path}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Messages:</span>
                  <span className="font-medium">{project.totalMessages}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last active:</span>
                  <span className="font-medium">{formatDate(project.lastActivity)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={isActiveProject(project.lastActivity) ? 'default' : 'secondary'}>
                    {isActiveProject(project.lastActivity) ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}