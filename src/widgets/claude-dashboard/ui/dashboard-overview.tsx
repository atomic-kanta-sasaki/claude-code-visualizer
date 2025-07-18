'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useProjectStore } from '@/entities/project'
import { useSessionStore } from '@/entities/session'
import { useConversationStore } from '@/entities/conversation'
import { 
  Folder, 
  Clock, 
  MessageSquare, 
  ListTodo, 
  BarChart3,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export function DashboardOverview() {
  const { stats, fetchStats } = useProjectStore()
  const { sessions } = useSessionStore()
  const { conversations } = useConversationStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const quickStats = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: Folder,
      description: 'Active projects',
      href: '/dashboard/projects'
    },
    {
      title: 'Sessions',
      value: sessions.length || 0,
      icon: Clock,
      description: 'Conversation sessions',
      href: '/dashboard/sessions'
    },
    {
      title: 'Conversations',
      value: conversations.length || 0,
      icon: MessageSquare,
      description: 'Total conversations',
      href: '/dashboard/conversations'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      icon: Users,
      description: 'This month',
      href: '/dashboard/stats'
    }
  ]

  const recentActivity = [
    {
      type: 'project',
      title: 'New project created',
      description: 'Project "NextJS App" was created',
      time: '2 hours ago'
    },
    {
      type: 'session',
      title: 'Session completed',
      description: 'Session with 15 conversations',
      time: '4 hours ago'
    },
    {
      type: 'conversation',
      title: 'Long conversation',
      description: 'Conversation with 50+ messages',
      time: '1 day ago'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your Claude workspace.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className="mt-3">
                <Button asChild variant="outline" size="sm">
                  <Link href={stat.href}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates across your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 border-b pb-3 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/projects">
                  <Folder className="mr-2 h-4 w-4" />
                  Browse Projects
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/conversations">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  View Conversations
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/todos">
                  <ListTodo className="mr-2 h-4 w-4" />
                  Manage Todos
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/stats">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Statistics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}