import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

// Helper function to update DOM classes with View Transitions API
const updateThemeClass = (newTheme: Theme) => {
  const updateDOM = () => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
  }

  // Use View Transitions API if supported
  if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
    ;(document as any).startViewTransition(updateDOM)
  } else {
    updateDOM()
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',

      setTheme: (theme) =>
        set(() => {
          updateThemeClass(theme)
          return { theme }
        }),

      toggleTheme: () =>
        set((state) => {
          const newTheme: Theme = state.theme === 'light' ? 'dark' : 'light'
          updateThemeClass(newTheme)
          return { theme: newTheme }
        }),
    }),
    {
      name: 'learning-short-drama-theme',
    }
  )
)
