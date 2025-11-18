import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',

      setTheme: (theme) =>
        set(() => {
          // Update DOM with View Transitions API if supported
          if ('startViewTransition' in document) {
            ;(document as Document & { startViewTransition: (callback: () => void) => void })
              .startViewTransition(() => {
                document.documentElement.classList.remove('light', 'dark')
                document.documentElement.classList.add(theme)
              })
          } else {
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(theme)
          }

          return { theme }
        }),

      toggleTheme: () =>
        set((state) => {
          const newTheme: Theme = state.theme === 'light' ? 'dark' : 'light'

          // Update DOM with View Transitions API if supported
          if ('startViewTransition' in document) {
            ;(document as Document & { startViewTransition: (callback: () => void) => void })
              .startViewTransition(() => {
                document.documentElement.classList.remove('light', 'dark')
                document.documentElement.classList.add(newTheme)
              })
          } else {
            document.documentElement.classList.remove('light', 'dark')
            document.documentElement.classList.add(newTheme)
          }

          return { theme: newTheme }
        }),
    }),
    {
      name: 'learning-short-drama-theme',
    }
  )
)
