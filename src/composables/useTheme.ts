import { ref, watch, onMounted } from 'vue'

const THEME_KEY = 'theme'
type Theme = 'light' | 'dark' | 'system'

const currentTheme = ref<Theme>('system')
const resolvedTheme = ref<'light' | 'dark'>('light')

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  resolvedTheme.value = theme
}

const initTheme = () => {
  const stored = localStorage.getItem(THEME_KEY) as Theme | null
  currentTheme.value = stored || 'system'
  
  const theme = currentTheme.value === 'system' ? getSystemTheme() : currentTheme.value
  applyTheme(theme)
}

const setTheme = (theme: Theme) => {
  currentTheme.value = theme
  localStorage.setItem(THEME_KEY, theme)
  
  const resolved = theme === 'system' ? getSystemTheme() : theme
  applyTheme(resolved)
}

const toggleTheme = () => {
  const themes: Theme[] = ['light', 'dark', 'system']
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  setTheme(themes[nextIndex])
}

export function useTheme() {
  onMounted(() => {
    initTheme()
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (currentTheme.value === 'system') {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
  })
  
  return {
    currentTheme,
    resolvedTheme,
    setTheme,
    toggleTheme
  }
}