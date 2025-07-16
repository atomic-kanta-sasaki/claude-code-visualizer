import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ClaudeSession, Conversation, TodoItem } from '@/shared/types'

interface SessionState {
  sessions: ClaudeSession[]
  selectedSession: ClaudeSession | null
  conversations: Conversation[]
  todos: TodoItem[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setSessions: (sessions: ClaudeSession[]) => void
  selectSession: (session: ClaudeSession) => void
  clearSelection: () => void
  getSessionById: (id: string) => ClaudeSession | undefined
  getConversationsBySession: (sessionId: string) => Conversation[]
  getTodosBySession: (sessionId: string) => TodoItem[]
  setError: (error: string | null) => void
}

export const useSessionStore = create<SessionState>()(
  devtools(
    (set, get) => ({
      sessions: [],
      selectedSession: null,
      conversations: [],
      todos: [],
      isLoading: false,
      error: null,

      setSessions: (sessions: ClaudeSession[]) => {
        set({ sessions })
        
        // Extract all conversations and todos from sessions
        const allConversations = sessions.flatMap(s => s.conversations)
        const allTodos = sessions.flatMap(s => s.todos)
        
        set({ conversations: allConversations, todos: allTodos })
      },

      selectSession: (session: ClaudeSession) => {
        set({ selectedSession: session })
      },

      clearSelection: () => {
        set({ selectedSession: null })
      },

      getSessionById: (id: string) => {
        return get().sessions.find(session => session.id === id)
      },

      getConversationsBySession: (sessionId: string) => {
        return get().conversations.filter(conv => conv.sessionId === sessionId)
      },

      getTodosBySession: (sessionId: string) => {
        return get().todos.filter(todo => todo.sessionId === sessionId)
      },

      setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'session-store',
    }
  )
)