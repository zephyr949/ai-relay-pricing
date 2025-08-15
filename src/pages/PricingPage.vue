<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="container mx-auto px-6 pt-12 pb-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-primary-500">{{ getSiteName(currentLocale) }}</h1>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 pb-16">
      <!-- Title Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {{ t('title') }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mx-auto leading-relaxed mb-4 px-4">
          {{ t('subtitle') }}
        </p>
        <div class="text-lg text-gray-500 dark:text-gray-400 mx-auto px-4 whitespace-nowrap overflow-x-auto" v-html="t('recommendation')">
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-8 max-w-7xl mx-auto">
        <PricingCard
          v-for="plan in plans"
          :key="plan.id"
          :plan="plan"
          :class="['w-full', 'max-w-sm']"
          @purchase="handlePurchase"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import PricingCard from '@/components/PricingCard.vue'
import LanguageSwitch from '@/components/LanguageSwitch.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useEnvConfig } from '@/composables/useEnvConfig'
import { useI18n } from '@/composables/useI18n'
import type { Plan } from '@/types'

const router = useRouter()
const { plans, getSiteName } = useEnvConfig()
const { t, currentLocale } = useI18n()

const handlePurchase = (plan: Plan) => {
  if (!plan.unavailable) {
    router.push(`/purchase/${plan.id}`)
  }
}
</script>