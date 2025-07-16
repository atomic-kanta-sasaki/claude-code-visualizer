import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export interface AppState {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'app-store',
    }
  )
)