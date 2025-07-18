'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useProjectStore } from '@/entities/project'
import { useSessionStore } from '@/entities/session'
import { useConversationStore } from '@/entities/conversation'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  MessageSquare,
  Folder,
  Activity,
  Calendar
} from 'lucide-react'

export function StatsOverview() {
  const { stats, fetchStats } = useProjectStore()
  const { sessions } = useSessionStore()
  const { conversations } = useConversationStore()

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const systemStats = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      change: '+12%',
      changeType: 'increase' as const,
      icon: Folder,
      description: 'Active projects in the system'
    },
    {
      title: 'Total Sessions',
      value: sessions.length || 0,
      change: '+8%',
      changeType: 'increase' as const,
      icon: Clock,
      description: 'Conversation sessions this month'
    },
    {
      title: 'Total Conversations',
      value: conversations.length || 0,
      change: '+15%',
      changeType: 'increase' as const,
      icon: MessageSquare,
      description: 'Messages exchanged'
    },
    {
      title: 'Active Users',
      value: stats?.activeUsers || 0,
      change: '+3%',
      changeType: 'increase' as const,
      icon: Users,
      description: 'Users active this month'
    }
  ]

  const usageStats = [
    {
      category: 'Most Used Features',
      items: [
        { name: 'Conversations', count: 45, percentage: 65 },
        { name: 'Projects', count: 23, percentage: 35 },
        { name: 'Sessions', count: 18, percentage: 28 },
        { name: 'Todos', count: 12, percentage: 18 }
      ]
    },
    {
      category: 'Activity by Day',
      items: [
        { name: 'Monday', count: 32, percentage: 80 },
        { name: 'Tuesday', count: 28, percentage: 70 },
        { name: 'Wednesday', count: 35, percentage: 88 },
        { name: 'Thursday', count: 30, percentage: 75 },
        { name: 'Friday', count: 25, percentage: 63 }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* System Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2 text-xs">
                <Badge 
                  variant={stat.changeType === 'increase' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="text-muted-foreground">from last month</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {usageStats.map((section) => (
          <Card key={section.category}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>{section.category}</span>
              </CardTitle>
              <CardDescription>
                Usage patterns and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Performance Metrics</span>
          </CardTitle>
          <CardDescription>
            System health and performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">1.2s</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">99.2%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}