'use client'

import { useSessionStore } from '@/entities/session'
import type { TodoItem } from '@/shared/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Clock, AlertTriangle, ListTodo } from 'lucide-react'

export function TodoBoard() {
  const { selectedSession } = useSessionStore()

  if (!selectedSession) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a session to view TODOs</p>
      </div>
    )
  }

  const todos = selectedSession.todos || []
  const pendingTodos = todos.filter(t => t.status === 'pending')
  const inProgressTodos = todos.filter(t => t.status === 'in_progress')
  const completedTodos = todos.filter(t => t.status === 'completed')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'pending':
        return <Circle className="h-4 w-4 text-gray-500" />
      default:
        return <Circle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
      case 'in_progress':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800'
      case 'pending':
        return 'bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800'
      default:
        return 'bg-muted border-muted-foreground'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      case 'low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  const TodoColumn = ({ title, todos, icon }: { title: string; todos: TodoItem[]; icon: React.ReactNode }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="outline" className="text-xs">
          {todos.length}
        </Badge>
      </div>
      
      <div className="space-y-2">
        {todos.map((todo) => (
          <Card 
            key={todo.id}
            className={`transition-all hover:shadow-md ${getStatusColor(todo.status)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(todo.status)}
                  <CardTitle className="text-sm">
                    {todo.content}
                  </CardTitle>
                </div>
                <Badge variant={getPriorityColor(todo.priority) as 'destructive' | 'default' | 'secondary' | 'outline'} className="text-xs">
                  {todo.priority}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Created: {formatDate(todo.createdAt)}
                {todo.updatedAt && new Date(todo.updatedAt).getTime() !== new Date(todo.createdAt).getTime() && (
                  <span className="ml-2">
                    Updated: {formatDate(todo.updatedAt)}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
        
        {todos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No {title.toLowerCase()} TODOs</p>
          </div>
        )}
      </div>
    </div>
  )

  if (todos.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No TODOs found for this session</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          TODOs
        </h2>
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed: {completedTodos.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>In Progress: {inProgressTodos.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Pending: {pendingTodos.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TodoColumn 
          title="Pending"
          todos={pendingTodos}
          icon={<Circle className="h-5 w-5 text-gray-500" />}
        />
        
        <TodoColumn 
          title="In Progress"
          todos={inProgressTodos}
          icon={<Clock className="h-5 w-5 text-yellow-500" />}
        />
        
        <TodoColumn 
          title="Completed"
          todos={completedTodos}
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
        />
      </div>
    </div>
  )
}