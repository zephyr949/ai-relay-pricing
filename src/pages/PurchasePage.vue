<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 transition-colors">
    <!-- Header -->
    <header class="container mx-auto px-6 pt-12 pb-8">
      <div class="flex justify-between items-center">
        <router-link
          to="/"
          class="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ t('purchase_page.back_to_pricing') }}
        </router-link>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitch />
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 pb-16">
      <!-- Plan Not Found -->
      <div v-if="!selectedPlan" class="text-center py-16">
        <p class="text-gray-600 dark:text-gray-400 mb-4">Plan not found</p>
        <router-link to="/" class="btn-primary">
          Back to Pricing
        </router-link>
      </div>

      <!-- Purchase Content -->
      <div v-else class="max-w-6xl mx-auto">
        <!-- Title -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ t('purchase_page.title', { plan: t(selectedPlan.nameKey) }) }}
          </h1>
          <div class="flex items-baseline justify-center text-2xl">
            <span class="font-bold text-gray-900 dark:text-white">{{ formatCurrency(selectedPlan.price) }}</span>
            <span class="text-gray-500 dark:text-gray-400 ml-2">{{ t(`per_${selectedPlan.period}`) }}</span>
          </div>
        </div>

        <!-- Content Cards -->
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Plan Features -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">{{ t('whats_included') }}</h3>
            <ul class="space-y-3">
              <li
                v-for="(feature, index) in formattedFeatures"
                :key="index"
                class="flex items-center text-sm text-gray-600 dark:text-gray-300"
              >
                <svg
                  class="h-4 w-4 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ feature }}
              </li>
            </ul>
          </div>

          <!-- WeChat Contact -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {{ t('purchase_page.wechat_contact') }}
            </h2>
            
            <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {{ t('purchase_page.wechat_description') }}
            </p>
            
            <div 
              class="inline-flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-green-600 transition-colors"
              @click="copyWechatId"
              :title="t('purchase_page.click_to_copy')"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
              </svg>
              {{ t('purchase_page.wechat_id_label') }}: {{ wechatConfig?.id }}
            </div>
            
            <p v-if="copyMessage" class="text-green-600 dark:text-green-400 text-sm mt-2">
              {{ copyMessage }}
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LanguageSwitch from '@/components/LanguageSwitch.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useEnvConfig } from '@/composables/useEnvConfig'
import { useI18n } from '@/composables/useI18n'
import { useCurrency } from '@/composables/useCurrency'
import { formatBudget } from '@/utils/budgetFormatter'

const route = useRoute()
const { plans, wechatConfig, budgetConfig } = useEnvConfig()
const { t } = useI18n()
const { formatCurrency } = useCurrency()

const copyMessage = ref('')

const selectedPlan = computed(() => {
  if (!plans.value) return null
  return plans.value.find(plan => plan.id === route.params.planId)
})

const copyWechatId = async () => {
  try {
    await navigator.clipboard.writeText(wechatConfig.value?.id || '')
    copyMessage.value = t.value('purchase_page.copied')
    setTimeout(() => {
      copyMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text:', err)
  }
}

const formattedFeatures = computed(() => {
  if (!selectedPlan.value) return []
  
  const planId = selectedPlan.value.id as 'basic' | 'standard' | 'professional' | 'trial'
  const budget = budgetConfig.value[planId]
  
  return selectedPlan.value.features.map(featureKey => {
    let text = t.value(featureKey)
    
    // 替换占位符
    if (featureKey.includes('supported_models')) {
      text = text.replace('{models}', budget.models)
    } else if (featureKey.includes('monthly_budget') && budget.monthly) {
      text = text.replace('{amount}', formatBudget(budget.monthly))
    } else if (featureKey.includes('weekly_budget') && budget.weekly) {
      text = text.replace('{amount}', formatBudget(budget.weekly))
    } else if (featureKey.includes('daily_budget')) {
      text = text.replace('{amount}', formatBudget(budget.daily))
    }
    
    return text
  })
})

</script>