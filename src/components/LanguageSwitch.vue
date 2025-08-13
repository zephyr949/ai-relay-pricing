<template>
  <div class="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
    <button
      v-for="locale in locales"
      :key="locale.code"
      @click="handleLocaleChange(locale.code)"
      :class="[
        'px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200',
        currentLocale === locale.code
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
      ]"
    >
      {{ locale.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import type { Locale } from '@/types'

const { currentLocale, setLocale } = useI18n()

const locales = [
  { code: 'en' as Locale, name: 'EN' },
  { code: 'zh' as Locale, name: '中文' }
]

const handleLocaleChange = (locale: Locale) => {
  setLocale(locale)
}
</script>