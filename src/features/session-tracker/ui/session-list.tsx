'use client'

import { useSessionStore } from '@/entities/session'
import type { ClaudeSession, TodoItem } from '@/shared/types'
import { useProjectStore } from '@/entities/project'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, MessageSquare, CheckCircle2, Circle, AlertCircle } from 'lucide-react'

export function SessionList() {
  const { sessions, selectedSession, selectSession } = useSessionStore()
  const { selectedProject } = useProjectStore()

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const getStatusColor = (session: ClaudeSession) => {
    const lastUpdateDate = new Date(session.lastUpdate)
    const isActive = lastUpdateDate.getTime() > Date.now() - 60 * 60 * 1000 // 1 hour
    return isActive ? 'default' : 'secondary'
  }

  const getStatusIcon = (session: ClaudeSession) => {
    const completedTodos = session.todos.filter((t: TodoItem) => t.status === 'completed').length
    const totalTodos = session.todos.length
    
    if (totalTodos === 0) {
      return <Circle className="h-4 w-4 text-muted-foreground" />
    }
    
    if (completedTodos === totalTodos) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
    
    if (completedTodos > 0) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
    
    return <Circle className="h-4 w-4 text-muted-foreground" />
  }

  if (!selectedProject) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a project to view sessions</p>
      </div>
    )
  }

  const projectSessions = sessions.filter(s => 
    selectedProject.sessions.some(ps => ps.id === s.id)
  )

  if (projectSessions.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No sessions found for this project</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">
        Sessions for {selectedProject.name}
      </h2>
      
      <div className="grid gap-3">
        {projectSessions.map((session) => (
          <Card 
            key={session.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSession?.id === session.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => selectSession(session)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(session)}
                  <CardTitle className="text-base">
                    Session {session.id.slice(-8)}
                  </CardTitle>
                </div>
                <Badge variant={getStatusColor(session)}>
                  {new Date(session.lastUpdate).getTime() > Date.now() - 60 * 60 * 1000 ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {formatDate(session.startTime)} - {formatDate(session.lastUpdate)}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Messages:</span>
                  <span className="font-medium">{session.messageCount}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{formatDuration(session.duration)}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">TODOs:</span>
                  <span className="font-medium">
                    {session.todos.filter((t: TodoItem) => t.status === 'completed').length}/{session.todos.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}