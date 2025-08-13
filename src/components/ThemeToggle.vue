<template>
  <button
    @click="toggleTheme"
    class="group relative inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
    :aria-label="getAriaLabel()"
  >
    <!-- Light mode icon -->
    <svg
      v-if="currentTheme === 'light'"
      class="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform group-hover:rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    
    <!-- Dark mode icon -->
    <svg
      v-else-if="currentTheme === 'dark'"
      class="w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform group-hover:-rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
    
    <!-- System mode icon -->
    <svg
      v-else
      class="w-5 h-5 text-gray-600 dark:text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import { useI18n } from '../composables/useI18n'

const { currentTheme, resolvedTheme, toggleTheme } = useTheme()
const { t } = useI18n()

const getAriaLabel = () => {
  const labels = {
    light: 'Switch to dark mode',
    dark: 'Switch to light mode',
    system: 'Using system theme'
  }
  return currentTheme.value === 'system' 
    ? labels.system 
    : labels[resolvedTheme.value as 'light' | 'dark']
}
</script>