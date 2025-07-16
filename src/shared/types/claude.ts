export interface ClaudeProject {
  id: string
  path: string
  name: string
  sessions: ClaudeSession[]
  lastActivity: Date
  totalMessages: number
  totalSessions: number
}

export interface ClaudeSession {
  id: string
  projectId: string
  conversations: Conversation[]
  todos: TodoItem[]
  startTime: Date
  lastUpdate: Date
  messageCount: number
  duration: number
}

export interface Conversation {
  id: string
  parentUuid?: string
  sessionId: string
  type: 'user' | 'assistant' | 'system'
  message: Message
  timestamp: Date
  tools?: ToolUsage[]
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: ToolCall[]
}

export interface ToolCall {
  id: string
  type: string
  function: {
    name: string
    arguments: string
  }
}

export interface ToolUsage {
  name: string
  parameters: Record<string, unknown>
  result: unknown
  timestamp: Date
}

export interface TodoItem {
  id: string
  content: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  sessionId: string
  createdAt: Date
  updatedAt: Date
}

export interface StatsigData {
  sessionId: string
  stableId: string
  evaluations: Record<string, unknown>
  lastUpdate: Date
}

export interface ShellSnapshot {
  id: string
  timestamp: Date
  environment: Record<string, string>
  functions: string[]
  aliases: Record<string, string>
}

export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  totalSessions: number
  activeSessions: number
  totalMessages: number
  totalTodos: number
  completedTodos: number
  averageSessionDuration: number
}

export interface SessionStats {
  messageCount: number
  duration: number
  toolsUsed: string[]
  todoProgress: {
    total: number
    completed: number
    inProgress: number
    pending: number
  }
}

export interface ConversationFilter {
  type?: 'user' | 'assistant' | 'system'
  dateRange?: {
    start: Date
    end: Date
  }
  searchTerm?: string
  sessionId?: string
  projectId?: string
}

export interface ProjectFilter {
  name?: string
  dateRange?: {
    start: Date
    end: Date
  }
  minSessions?: number
  maxSessions?: number
  hasActiveSessions?: boolean
}