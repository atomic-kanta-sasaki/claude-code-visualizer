import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import type { 
  ClaudeProject, 
  ClaudeSession, 
  Conversation, 
  TodoItem, 
  StatsigData,
  ProjectStats
} from '@/shared/types/claude'

const CLAUDE_DIR = path.join(os.homedir(), '.claude')

export class ClaudeFileSystem {
  private static instance: ClaudeFileSystem
  
  static getInstance(): ClaudeFileSystem {
    if (!ClaudeFileSystem.instance) {
      ClaudeFileSystem.instance = new ClaudeFileSystem()
    }
    return ClaudeFileSystem.instance
  }

  async readProjects(): Promise<ClaudeProject[]> {
    try {
      const projectsDir = path.join(CLAUDE_DIR, 'projects')
      const projectDirs = await fs.readdir(projectsDir)
      
      const projects: ClaudeProject[] = []
      
      for (const projectDir of projectDirs) {
        const projectPath = path.join(projectsDir, projectDir)
        const stats = await fs.stat(projectPath)
        
        if (stats.isDirectory()) {
          const project = await this.readProject(projectDir, projectPath)
          projects.push(project)
        }
      }
      
      return projects.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    } catch (error) {
      console.error('Error reading projects:', error)
      return []
    }
  }

  private async readProject(projectDir: string, projectPath: string): Promise<ClaudeProject> {
    const sessionFiles = await fs.readdir(projectPath)
    const sessions: ClaudeSession[] = []
    
    for (const sessionFile of sessionFiles) {
      if (sessionFile.endsWith('.jsonl')) {
        const sessionId = sessionFile.replace('.jsonl', '')
        const session = await this.readSession(sessionId, path.join(projectPath, sessionFile))
        sessions.push(session)
      }
    }
    
    const lastActivity = sessions.length > 0 
      ? new Date(Math.max(...sessions.map(s => s.lastUpdate.getTime())))
      : new Date()
    
    const totalMessages = sessions.reduce((sum, session) => sum + session.messageCount, 0)
    
    return {
      id: projectDir,
      path: projectDir.replace(/-/g, '/'),
      name: this.getProjectName(projectDir),
      sessions,
      lastActivity,
      totalMessages,
      totalSessions: sessions.length
    }
  }

  private async readSession(sessionId: string, sessionPath: string): Promise<ClaudeSession> {
    try {
      const content = await fs.readFile(sessionPath, 'utf8')
      const lines = content.trim().split('\n').filter(line => line.trim())
      
      const conversations: Conversation[] = []
      let startTime = new Date()
      let lastUpdate = new Date()
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          
          // メッセージデータの正規化
          let messageContent = ''
          if (typeof data.message === 'string') {
            messageContent = data.message
          } else if (data.message && typeof data.message === 'object') {
            if (data.message.content) {
              messageContent = data.message.content
            } else if (data.message.text) {
              messageContent = data.message.text
            } else {
              messageContent = JSON.stringify(data.message)
            }
          } else if (data.content) {
            messageContent = data.content
          } else if (data.text) {
            messageContent = data.text
          } else {
            messageContent = 'No content available'
          }
          
          const conversation: Conversation = {
            id: data.id || Math.random().toString(36),
            parentUuid: data.parentUuid,
            sessionId,
            type: data.type || 'user',
            message: {
              role: data.message?.role || data.type || 'user',
              content: messageContent
            },
            timestamp: new Date(data.timestamp || Date.now()),
            tools: data.tools
          }
          
          conversations.push(conversation)
          
          if (conversation.timestamp < startTime) {
            startTime = conversation.timestamp
          }
          if (conversation.timestamp > lastUpdate) {
            lastUpdate = conversation.timestamp
          }
        } catch (parseError) {
          console.error('Error parsing conversation line:', parseError)
        }
      }
      
      const todos = await this.readTodos(sessionId)
      const duration = lastUpdate.getTime() - startTime.getTime()
      
      return {
        id: sessionId,
        projectId: sessionId.split('-')[0],
        conversations,
        todos,
        startTime,
        lastUpdate,
        messageCount: conversations.length,
        duration
      }
    } catch (error) {
      console.error('Error reading session:', error)
      return {
        id: sessionId,
        projectId: sessionId.split('-')[0],
        conversations: [],
        todos: [],
        startTime: new Date(),
        lastUpdate: new Date(),
        messageCount: 0,
        duration: 0
      }
    }
  }

  private async readTodos(sessionId: string): Promise<TodoItem[]> {
    try {
      const todosDir = path.join(CLAUDE_DIR, 'todos')
      const todoFiles = await fs.readdir(todosDir)
      
      const sessionTodoFiles = todoFiles.filter(file => 
        file.startsWith(sessionId) && file.endsWith('.json')
      )
      
      const todos: TodoItem[] = []
      
      for (const todoFile of sessionTodoFiles) {
        const todoPath = path.join(todosDir, todoFile)
        const content = await fs.readFile(todoPath, 'utf8')
        const todoData = JSON.parse(content)
        
        if (Array.isArray(todoData)) {
          todoData.forEach(todo => {
            todos.push({
              id: todo.id,
              content: todo.content,
              status: todo.status,
              priority: todo.priority,
              sessionId,
              createdAt: new Date(todo.createdAt || Date.now()),
              updatedAt: new Date(todo.updatedAt || Date.now())
            })
          })
        }
      }
      
      return todos
    } catch (error) {
      console.error('Error reading todos:', error)
      return []
    }
  }

  async readStatsig(): Promise<StatsigData | null> {
    try {
      const statsigDir = path.join(CLAUDE_DIR, 'statsig')
      const files = await fs.readdir(statsigDir)
      
      const sessionFile = files.find(f => f.startsWith('statsig.session_id.'))
      const stableFile = files.find(f => f.startsWith('statsig.stable_id.'))
      const evaluationFiles = files.filter(f => f.startsWith('statsig.cached.evaluations.'))
      
      if (!sessionFile || !stableFile) {
        return null
      }
      
      const sessionContent = await fs.readFile(path.join(statsigDir, sessionFile), 'utf8')
      const stableContent = await fs.readFile(path.join(statsigDir, stableFile), 'utf8')
      
      const sessionData = JSON.parse(sessionContent)
      const stableData = JSON.parse(stableContent)
      
      const evaluations: Record<string, unknown> = {}
      for (const evalFile of evaluationFiles) {
        const evalContent = await fs.readFile(path.join(statsigDir, evalFile), 'utf8')
        evaluations[evalFile] = JSON.parse(evalContent)
      }
      
      return {
        sessionId: sessionData.sessionID,
        stableId: stableData.stableID,
        evaluations,
        lastUpdate: new Date(sessionData.lastUpdate)
      }
    } catch (error) {
      console.error('Error reading statsig:', error)
      return null
    }
  }

  async getProjectStats(): Promise<ProjectStats> {
    const projects = await this.readProjects()
    const activeProjects = projects.filter(p => 
      p.lastActivity.getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length
    
    const allSessions = projects.flatMap(p => p.sessions)
    const activeSessions = allSessions.filter(s => 
      s.lastUpdate.getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length
    
    const totalMessages = projects.reduce((sum, p) => sum + p.totalMessages, 0)
    const allTodos = allSessions.flatMap(s => s.todos)
    const completedTodos = allTodos.filter(t => t.status === 'completed').length
    
    const averageSessionDuration = allSessions.length > 0 
      ? allSessions.reduce((sum, s) => sum + s.duration, 0) / allSessions.length
      : 0
    
    return {
      totalProjects: projects.length,
      activeProjects,
      totalSessions: allSessions.length,
      activeSessions,
      totalMessages,
      totalTodos: allTodos.length,
      completedTodos,
      averageSessionDuration
    }
  }

  private getProjectName(projectDir: string): string {
    const path = projectDir.replace(/-/g, '/')
    const parts = path.split('/')
    return parts[parts.length - 1] || 'Unknown Project'
  }
}

export const claudeFs = ClaudeFileSystem.getInstance()