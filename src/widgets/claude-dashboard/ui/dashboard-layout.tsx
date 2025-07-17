'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ProjectList } from '@/features/project-manager'
import { SessionList } from '@/features/session-tracker'
import { ConversationTimeline } from '@/features/context-viewer'
import { TodoBoard } from '@/features/todo-dashboard'
import { useProjectStore } from '@/entities/project'
import { useSessionStore } from '@/entities/session'
import { useConversationStore } from '@/entities/conversation'
import { 
  Folder, 
  Clock, 
  MessageSquare, 
  ListTodo, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

type View = 'projects' | 'sessions' | 'conversations' | 'todos' | 'stats'

export function DashboardLayout() {
  const [currentView, setCurrentView] = useState<View>('projects')
  const { stats, selectedProject, fetchStats } = useProjectStore()
  const { selectedSession } = useSessionStore()
  const { setConversations } = useConversationStore()

  // 統計情報を読み込み
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // プロジェクトが選択されたらセッション画面に自動遷移
  useEffect(() => {
    if (selectedProject && currentView === 'projects') {
      setCurrentView('sessions')
    }
  }, [selectedProject, currentView])

  // セッションが選択されたら会話画面に自動遷移
  useEffect(() => {
    if (selectedSession && currentView === 'sessions') {
      setCurrentView('conversations')
      // 会話データを設定
      setConversations(selectedSession.conversations || [])
    }
  }, [selectedSession, currentView, setConversations])

  const getViewTitle = (view: View) => {
    switch (view) {
      case 'projects':
        return 'Projects'
      case 'sessions':
        return 'Sessions'
      case 'conversations':
        return 'Conversations'
      case 'todos':
        return 'TODOs'
      case 'stats':
        return 'Statistics'
      default:
        return 'Dashboard'
    }
  }

  const getViewIcon = (view: View) => {
    switch (view) {
      case 'projects':
        return <Folder className="h-5 w-5" />
      case 'sessions':
        return <Clock className="h-5 w-5" />
      case 'conversations':
        return <MessageSquare className="h-5 w-5" />
      case 'todos':
        return <ListTodo className="h-5 w-5" />
      case 'stats':
        return <BarChart3 className="h-5 w-5" />
      default:
        return <Folder className="h-5 w-5" />
    }
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'projects':
        return <ProjectList />
      case 'sessions':
        return <SessionList />
      case 'conversations':
        return <ConversationTimeline />
      case 'todos':
        return <TodoBoard />
      case 'stats':
        return <StatsView />
      default:
        return <ProjectList />
    }
  }

  const StatsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Statistics</h2>
      
      {stats ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-2xl">{stats.totalProjects}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                {stats.activeProjects} active
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Sessions</CardDescription>
              <CardTitle className="text-2xl">{stats.totalSessions}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                {stats.activeSessions} active
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Messages</CardDescription>
              <CardTitle className="text-2xl">{stats.totalMessages}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                All time
              </Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>TODO Progress</CardDescription>
              <CardTitle className="text-2xl">
                {stats.totalTodos > 0 ? Math.round((stats.completedTodos / stats.totalTodos) * 100) : 0}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                {stats.completedTodos}/{stats.totalTodos} completed
              </Badge>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Loading statistics...</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Claude Context Manager</h1>
          </div>
          
          <div className="flex items-center space-x-1 ml-auto">
            {/* バックボタン */}
            {currentView !== 'projects' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (currentView === 'sessions') {
                    setCurrentView('projects')
                  } else if (currentView === 'conversations' || currentView === 'todos') {
                    setCurrentView('sessions')
                  } else if (currentView === 'stats') {
                    setCurrentView('projects')
                  }
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            
            {/* 現在の画面情報 */}
            <div className="flex items-center space-x-2 px-3 py-1 bg-muted rounded-md">
              {currentView === 'projects' && <Folder className="h-4 w-4" />}
              {currentView === 'sessions' && <Clock className="h-4 w-4" />}
              {currentView === 'conversations' && <MessageSquare className="h-4 w-4" />}
              {currentView === 'todos' && <ListTodo className="h-4 w-4" />}
              {currentView === 'stats' && <BarChart3 className="h-4 w-4" />}
              <span className="text-sm font-medium capitalize">{currentView}</span>
              {selectedProject && currentView !== 'projects' && (
                <span className="text-xs text-muted-foreground">
                  / {selectedProject.name}
                </span>
              )}
              {selectedSession && (currentView === 'conversations' || currentView === 'todos') && (
                <span className="text-xs text-muted-foreground">
                  / {selectedSession.id.slice(-8)}
                </span>
              )}
            </div>
            
            {/* 直接ナビゲーション */}
            <Button
              variant={currentView === 'stats' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCurrentView('stats')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Stats
            </Button>
            
            {/* セッション選択時にTODOボタンを表示 */}
            {selectedSession && currentView === 'conversations' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('todos')}
              >
                <ListTodo className="h-4 w-4 mr-2" />
                TODOs
              </Button>
            )}
            
            {/* TODO画面からConversationに戻る */}
            {selectedSession && currentView === 'todos' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentView('conversations')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Conversations
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex h-[calc(100vh-4rem)]">
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderCurrentView()}
          </div>
        </main>
      </div>
    </div>
  )
}