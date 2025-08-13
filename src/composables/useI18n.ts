import { ref, computed, onMounted } from 'vue'
import type { Locale } from '@/types'

// Global shared state
const currentLocale = ref<Locale>('en')
const messages = ref<Record<Locale, any>>({
  en: {},
  zh: {}
})
const loading = ref(false)

export function useI18n() {
  // Get nested object value by key path (e.g., 'plans.basic.name')
  const getNestedValue = (obj: any, path: string): string => {
    return path.split('.').reduce((current, key) => current?.[key], obj) || path
  }

  const t = computed(() => {
    return (key: string, params?: Record<string, string>): string => {
      const localeMessages = messages.value[currentLocale.value] || {}
      let text = getNestedValue(localeMessages, key)
      
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(`{${paramKey}}`, value)
        })
      }
      
      return text
    }
  })

  const setLocale = (locale: Locale) => {
    currentLocale.value = locale
    localStorage.setItem('preferred-locale', locale)
    loadLocaleMessages(locale)
  }

  const loadLocaleMessages = async (locale: Locale) => {
    // Skip if already loaded
    if (messages.value[locale] && Object.keys(messages.value[locale]).length > 0) {
      return
    }
    
    try {
      const response = await fetch(`/locales/${locale}.json`)
      const localeMessages = await response.json()
      messages.value[locale] = localeMessages
    } catch (error) {
      console.error(`Failed to load ${locale} messages:`, error)
    }
  }

  const loadMessages = async () => {
    loading.value = true
    try {
      // Load current locale messages
      await loadLocaleMessages(currentLocale.value)
      // Preload other locale
      const otherLocale = currentLocale.value === 'en' ? 'zh' : 'en'
      loadLocaleMessages(otherLocale)
    } catch (error) {
      console.error('Failed to load i18n messages:', error)
    } finally {
      loading.value = false
    }
  }

  const initializeLocale = () => {
    const savedLocale = localStorage.getItem('preferred-locale') as Locale
    const browserLocale = navigator.language.startsWith('zh') ? 'zh' : 'en'
    currentLocale.value = savedLocale || browserLocale
  }

  onMounted(() => {
    initializeLocale()
    loadMessages()
  })

  return {
    currentLocale,
    t,
    setLocale,
    loading
  }
}