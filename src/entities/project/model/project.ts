import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ClaudeProject, ProjectStats } from '@/shared/types'

interface ProjectState {
  projects: ClaudeProject[]
  stats: ProjectStats | null
  selectedProject: ClaudeProject | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProjects: () => Promise<void>
  fetchStats: () => Promise<void>
  selectProject: (project: ClaudeProject) => void
  clearSelection: () => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectState>()(
  devtools(
    (set, get) => ({
      projects: [],
      stats: null,
      selectedProject: null,
      isLoading: false,
      error: null,

      fetchProjects: async () => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await fetch('/api/claude/projects')
          const result = await response.json()
          
          if (result.success) {
            set({ projects: result.data, isLoading: false })
          } else {
            set({ error: result.message || 'Failed to fetch projects', isLoading: false })
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error', 
            isLoading: false 
          })
        }
      },

      fetchStats: async () => {
        try {
          const response = await fetch('/api/claude/stats')
          const result = await response.json()
          
          if (result.success) {
            set({ stats: result.data })
          } else {
            set({ error: result.message || 'Failed to fetch stats' })
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      },

      selectProject: (project: ClaudeProject) => {
        set({ selectedProject: project })
      },

      clearSelection: () => {
        set({ selectedProject: null })
      },

      setError: (error: string | null) => {
        set({ error })
      }
    }),
    {
      name: 'project-store',
    }
  )
)