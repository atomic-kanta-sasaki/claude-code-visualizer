import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Conversation, ConversationFilter } from '@/shared/types'

interface ConversationState {
  conversations: Conversation[]
  filteredConversations: Conversation[]
  selectedConversation: Conversation | null
  filters: ConversationFilter
  isLoading: boolean
  error: string | null
  
  // Actions
  setConversations: (conversations: Conversation[]) => void
  selectConversation: (conversation: Conversation) => void
  clearSelection: () => void
  applyFilters: (filters: ConversationFilter) => void
  clearFilters: () => void
  searchConversations: (searchTerm: string) => void
  getConversationsByType: (type: 'user' | 'assistant' | 'system') => Conversation[]
  getConversationsBySession: (sessionId: string) => Conversation[]
  setError: (error: string | null) => void
}

export const useConversationStore = create<ConversationState>()(
  devtools(
    (set, get) => ({
      conversations: [],
      filteredConversations: [],
      selectedConversation: null,
      filters: {},
      isLoading: false,
      error: null,

      setConversations: (conversations: Conversation[]) => {
        set({ conversations })
        
        // Apply current filters to new conversations
        const { filters } = get()
        let filtered = [...conversations]

        // Filter by type
        if (filters.type) {
          filtered = filtered.filter(conv => conv.type === filters.type)
        }

        // Filter by date range
        if (filters.dateRange) {
          const { start, end } = filters.dateRange
          filtered = filtered.filter(conv => {
            const convDate = new Date(conv.timestamp)
            return convDate >= start && convDate <= end
          })
        }

        // Filter by search term
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase()
          filtered = filtered.filter(conv => 
            conv.message.content.toLowerCase().includes(searchLower)
          )
        }

        // Filter by session ID
        if (filters.sessionId) {
          filtered = filtered.filter(conv => conv.sessionId === filters.sessionId)
        }

        // Filter by project ID
        if (filters.projectId) {
          filtered = filtered.filter(conv => conv.sessionId.includes(filters.projectId!))
        }

        // Sort by timestamp (newest first)
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        set({ filteredConversations: filtered })
      },

      selectConversation: (conversation: Conversation) => {
        set({ selectedConversation: conversation })
      },

      clearSelection: () => {
        set({ selectedConversation: null })
      },

      applyFilters: (filters: ConversationFilter) => {
        const { conversations } = get()
        let filtered = [...conversations]

        // Filter by type
        if (filters.type) {
          filtered = filtered.filter(conv => conv.type === filters.type)
        }

        // Filter by date range
        if (filters.dateRange) {
          const { start, end } = filters.dateRange
          filtered = filtered.filter(conv => {
            const convDate = new Date(conv.timestamp)
            return convDate >= start && convDate <= end
          })
        }

        // Filter by search term
        if (filters.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase()
          filtered = filtered.filter(conv => 
            conv.message.content.toLowerCase().includes(searchLower)
          )
        }

        // Filter by session ID
        if (filters.sessionId) {
          filtered = filtered.filter(conv => conv.sessionId === filters.sessionId)
        }

        // Filter by project ID
        if (filters.projectId) {
          filtered = filtered.filter(conv => conv.sessionId.includes(filters.projectId!))
        }

        // Sort by timestamp (newest first)
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

        set({ filters, filteredConversations: filtered })
      },

      clearFilters: () => {
        set({ filters: {}, filteredConversations: get().conversations })
      },

      searchConversations: (searchTerm: string) => {
        const currentFilters = get().filters
        get().applyFilters({ ...currentFilters, searchTerm })
      },

      getConversationsByType: (type: 'user' | 'assistant' | 'system') => {
        return get().conversations.filter(conv => conv.type === type)
      },

      getConversationsBySession: (sessionId: string) => {
        return get().conversations.filter(conv => conv.sessionId === sessionId)
      },

      setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'conversation-store',
    }
  )
)