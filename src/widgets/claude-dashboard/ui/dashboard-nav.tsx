'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Folder,
  Clock,
  MessageSquare,
  ListTodo,
  BarChart3,
  Home,
  FileEdit
} from 'lucide-react'

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview of your Claude workspace'
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: Folder,
    description: 'Manage your Claude projects'
  },
  {
    name: 'Sessions',
    href: '/dashboard/sessions',
    icon: Clock,
    description: 'View conversation sessions'
  },
  {
    name: 'Conversations',
    href: '/dashboard/conversations',
    icon: MessageSquare,
    description: 'Browse conversation history'
  },
  {
    name: 'Todos',
    href: '/dashboard/todos',
    icon: ListTodo,
    description: 'Manage tasks and action items'
  },
  {
    name: 'Statistics',
    href: '/dashboard/stats',
    icon: BarChart3,
    description: 'Usage and performance metrics'
  },
  {
    name: 'Editor',
    href: '/dashboard/editor',
    icon: FileEdit,
    description: 'Edit CLAUDE.md configuration file'
  }
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">C</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Claude Dashboard</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 transition-colors hover:text-foreground/80',
                  isActive ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline-block">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}