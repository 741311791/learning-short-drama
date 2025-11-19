import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React dependencies
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // State management and validation
          'vendor-state': ['zustand', 'zod'],
          // Markdown rendering (lazy loaded with ConceptDetailPage)
          'vendor-markdown': ['react-markdown', 'remark-gfm'],
          // Syntax highlighting (lazy loaded with ConceptDetailPage)
          'vendor-syntax': ['react-syntax-highlighter'],
          // Search functionality (lazy loaded with SearchPage)
          'vendor-search': ['flexsearch'],
          // UI components
          'vendor-ui': ['lucide-react', 'clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    // Enable source maps for debugging in production
    sourcemap: false,
    // Minify output
    minify: 'esbuild',
    // Target modern browsers
    target: 'es2020',
  },
  server: {
    port: 5173,
    open: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand'],
  },
})