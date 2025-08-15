<template>
  <div
    :class="[
      'pricing-card relative',
      plan.popular ? 'pricing-card-popular' : ''
    ]"
  >
    <!-- Popular Badge -->
    <div
      v-if="plan.popular"
      class="absolute -top-4 left-1/2 transform -translate-x-1/2"
    >
      <span class="bg-primary-500 text-white text-sm font-medium px-4 py-1 rounded-full">
        {{ t('popular') }}
      </span>
    </div>

    <!-- Plan Header -->
    <div class="text-center mb-6">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        <span v-if="plan.popular">🔥 </span>{{ t(plan.nameKey) }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400 text-base">
        {{ t(plan.descriptionKey) }}
      </p>
    </div>

    <!-- Price -->
    <div class="text-center mb-8">
      <div class="flex items-baseline justify-center">
        <span class="text-5xl font-bold text-gray-900 dark:text-white">{{ formatCurrency(plan.price) }}</span>
        <span class="text-gray-500 dark:text-gray-400 ml-2">{{ t(`per_${plan.period}`) }}</span>
      </div>
    </div>

    <!-- Features -->
    <div class="mb-8">
      <h4 class="font-semibold text-gray-900 dark:text-white mb-4">{{ t('whats_included') }}</h4>
      <ul class="space-y-3">
        <li
          v-for="feature in plan.features"
          :key="feature"
          class="flex items-center"
        >
          <svg
            class="h-5 w-5 text-green-500 mr-3 flex-shrink-0"
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
          <span class="text-gray-700 dark:text-gray-300 text-sm">{{ formatFeature(feature) }}</span>
        </li>
      </ul>
    </div>

    <!-- Button -->
    <div class="mt-auto">
      <button
        v-if="plan.unavailable"
        :class="[
          'w-full py-3 px-6 text-sm font-medium rounded-lg transition-colors duration-200',
          'bg-gray-200 text-gray-500 cursor-not-allowed'
        ]"
        disabled
      >
        {{ t('purchase_temporarily_unavailable') }}
      </button>
      <button
        v-else
        @click="$emit('purchase', plan)"
        :class="[
          'w-full py-3 px-6 text-sm font-medium rounded-lg transition-colors duration-200',
          plan.popular
            ? 'btn-primary'
            : 'btn-secondary'
        ]"
      >
        {{ t(plan.buttonTextKey) }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Plan } from '@/types'
import { useI18n } from '@/composables/useI18n'
import { useCurrency } from '@/composables/useCurrency'
import { useEnvConfig } from '@/composables/useEnvConfig'
import { formatBudget } from '@/utils/budgetFormatter'

interface Props {
  plan: Plan
}

defineProps<Props>()
defineEmits<{
  purchase: [plan: Plan]
}>()

const { t } = useI18n()
const { formatCurrency } = useCurrency()
const { budgetConfig } = useEnvConfig()

// 格式化特性文本，对预算特性进行特殊处理
const formatFeature = (featureKey: string): string => {
  // 检查是否是支持的模型特性
  if (featureKey.includes('supported_models')) {
    const planType = featureKey.includes('basic') ? 'basic' : 
                     featureKey.includes('standard') ? 'standard' : 'trial'
    const models = budgetConfig.value[planType].models
    return t.value(featureKey, { models })
  }
  
  // 检查是否是总额度特性
  if (featureKey.includes('total_budget')) {
    const planType = featureKey.includes('basic') ? 'basic' : 
                     featureKey.includes('standard') ? 'standard' : 'trial'
    const amount = formatBudget(budgetConfig.value[planType].total)
    return t.value(featureKey, { amount })
  }
  
  // 检查是否是日额度特性
  if (featureKey.includes('daily_budget')) {
    const planType = featureKey.includes('basic') ? 'basic' : 
                     featureKey.includes('standard') ? 'standard' : 'trial'
    const amount = formatBudget(budgetConfig.value[planType].daily)
    return t.value(featureKey, { amount })
  }
  
  // 其他特性直接翻译
  return t.value(featureKey)
}
</script>