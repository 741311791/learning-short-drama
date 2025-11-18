import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserProgressState {
  favorites: string[]
  completed_modules: Record<string, boolean>
  last_visited_stage: string | null

  // Actions
  addToFavorites: (itemId: string) => void
  removeFromFavorites: (itemId: string) => void
  toggleFavorite: (itemId: string) => void
  markAsCompleted: (moduleId: string, completed: boolean) => void
  setLastVisitedStage: (stageId: string) => void
}

export const useUserProgressStore = create<UserProgressState>()(
  persist(
    (set) => ({
      favorites: [],
      completed_modules: {},
      last_visited_stage: null,

      addToFavorites: (itemId) =>
        set((state) => {
          if (state.favorites.includes(itemId)) {
            return state // Already favorited
          }
          return { favorites: [...state.favorites, itemId] }
        }),

      removeFromFavorites: (itemId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== itemId),
        })),

      toggleFavorite: (itemId) =>
        set((state) => {
          const isFavorited = state.favorites.includes(itemId)
          return {
            favorites: isFavorited
              ? state.favorites.filter((id) => id !== itemId)
              : [...state.favorites, itemId],
          }
        }),

      markAsCompleted: (moduleId, completed) =>
        set((state) => ({
          completed_modules: {
            ...state.completed_modules,
            [moduleId]: completed,
          },
        })),

      setLastVisitedStage: (stageId) =>
        set({ last_visited_stage: stageId }),
    }),
    {
      name: 'learning-short-drama-progress',
      partialize: (state) => ({
        favorites: state.favorites,
        completed_modules: state.completed_modules,
        last_visited_stage: state.last_visited_stage,
      }),
    }
  )
)
