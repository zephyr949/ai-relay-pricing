<template>
  <div class="relative">
    <!-- Dropdown trigger button -->
    <button
      @click="isOpen = !isOpen"
      @blur="handleBlur"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
    >
      <span class="text-lg">🌐</span>
      <span>{{ getCurrentLocaleName() }}</span>
      <svg
        :class="['w-4 h-4 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      class="absolute top-full left-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10"
    >
      <button
        v-for="locale in locales"
        :key="locale.code"
        @click="handleLocaleChange(locale.code)"
        :class="[
          'w-full flex items-center space-x-3 px-4 py-3 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150',
          currentLocale === locale.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300',
          locale === locales[0] ? 'rounded-t-lg' : '',
          locale === locales[locales.length - 1] ? 'rounded-b-lg' : ''
        ]"
      >
        <span class="text-lg">{{ locale.flag }}</span>
        <span class="font-medium">{{ locale.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { Locale } from '@/types'

const { currentLocale, setLocale } = useI18n()
const isOpen = ref(false)

const locales = [
  { code: 'en' as Locale, name: 'English', flag: '🇺🇸' },
  { code: 'zh' as Locale, name: '中文', flag: '🇨🇳' }
]

const handleLocaleChange = (locale: Locale) => {
  setLocale(locale)
  isOpen.value = false
}

const getCurrentLocaleName = () => {
  const locale = locales.find(l => l.code === currentLocale.value)
  return locale?.name || 'English'
}

const handleBlur = (event: FocusEvent) => {
  // Close dropdown only if focus is not moving to a dropdown item
  setTimeout(() => {
    if (!event.relatedTarget || !event.currentTarget?.contains(event.relatedTarget as Node)) {
      isOpen.value = false
    }
  }, 100)
}
</script>