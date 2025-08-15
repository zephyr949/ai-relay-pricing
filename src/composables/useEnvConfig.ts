import { computed } from 'vue'
import type { Plan, Currency } from '@/types'

export function useEnvConfig() {
  // 站点信息
  const getSiteName = (locale: 'en' | 'zh'): string => {
    return locale === 'zh' 
      ? import.meta.env.VITE_SITE_NAME_ZH 
      : import.meta.env.VITE_SITE_NAME_EN
  }

  // 货币设置
  const currency = computed<Currency>(() => {
    return import.meta.env.VITE_CURRENCY || 'USD'
  })

  // 微信信息
  const wechatConfig = computed(() => ({
    id: import.meta.env.VITE_WECHAT_ID
  }))

  // 预算配置
  const budgetConfig = computed(() => ({
    trial: {
      daily: parseFloat(import.meta.env.VITE_TRIAL_PLAN_DAILY_BUDGET || '20'),
      models: import.meta.env.VITE_TRIAL_PLAN_MODELS || 'sonnet-4'
    },
    basic: {
      weekly: parseFloat(import.meta.env.VITE_BASIC_PLAN_WEEKLY_BUDGET || '150'),
      daily: parseFloat(import.meta.env.VITE_BASIC_PLAN_DAILY_BUDGET || '25'),
      models: import.meta.env.VITE_BASIC_PLAN_MODELS || 'sonnet-4'
    },
    standard: {
      monthly: parseFloat(import.meta.env.VITE_STANDARD_PLAN_MONTHLY_BUDGET || '1500'),
      daily: parseFloat(import.meta.env.VITE_STANDARD_PLAN_DAILY_BUDGET || '50'),
      models: import.meta.env.VITE_STANDARD_PLAN_MODELS || 'sonnet-4'
    }
  }))

  // 根据周期获取预算特性
  const getBudgetFeature = (planId: string, period: string): string => {
    if (period === 'day') {
      return `plans.${planId}.features.daily_budget`
    } else if (period === 'week') {
      return `plans.${planId}.features.weekly_budget`
    } else if (period === 'month') {
      return `plans.${planId}.features.monthly_budget`
    }
    return `plans.${planId}.features.daily_budget`
  }

  // 动态生成套餐配置
  const plans = computed<Plan[]>(() => {
    const trialPeriod = import.meta.env.VITE_TRIAL_PLAN_PERIOD || 'day'
    const basicPeriod = import.meta.env.VITE_BASIC_PLAN_PERIOD || 'week'
    const standardPeriod = import.meta.env.VITE_STANDARD_PLAN_PERIOD || 'month'
    
    return [
      {
        id: 'trial',
        nameKey: 'plans.trial.name',
        price: parseFloat(import.meta.env.VITE_TRIAL_PLAN_PRICE || '9.9'),
        period: trialPeriod,
        descriptionKey: 'plans.trial.description',
        popular: import.meta.env.VITE_TRIAL_PLAN_POPULAR === 'true',
        features: [
          'plans.trial.features.supported_models',
          getBudgetFeature('trial', trialPeriod),
          'plans.trial.features.unlimited_requests',
          'plans.trial.features.basic_support'
        ],
        buttonTextKey: 'plans.trial.button',
        unavailable: import.meta.env.VITE_TRIAL_PLAN_AVAILABLE !== 'true'
      },
      {
        id: 'basic',
        nameKey: 'plans.basic.name',
        price: parseFloat(import.meta.env.VITE_BASIC_PLAN_PRICE || '9.9'),
        period: basicPeriod,
        descriptionKey: 'plans.basic.description',
        popular: import.meta.env.VITE_BASIC_PLAN_POPULAR === 'true',
        features: [
          'plans.basic.features.supported_models',
          getBudgetFeature('basic', basicPeriod),
          'plans.basic.features.daily_budget',
          'plans.basic.features.unlimited_requests',
          'plans.basic.features.basic_support'
        ],
        buttonTextKey: 'plans.basic.button',
        unavailable: import.meta.env.VITE_BASIC_PLAN_AVAILABLE !== 'true'
      },
      {
        id: 'standard',
        nameKey: 'plans.standard.name',
        price: parseFloat(import.meta.env.VITE_STANDARD_PLAN_PRICE || '229'),
        period: standardPeriod,
        descriptionKey: 'plans.standard.description',
        popular: import.meta.env.VITE_STANDARD_PLAN_POPULAR === 'true',
        features: [
          'plans.standard.features.supported_models',
          getBudgetFeature('standard', standardPeriod),
          'plans.standard.features.daily_budget',
          'plans.standard.features.unlimited_requests',
          'plans.standard.features.basic_support'
        ],
        buttonTextKey: 'plans.standard.button',
        unavailable: import.meta.env.VITE_STANDARD_PLAN_AVAILABLE !== 'true'
      }
    ]
  })

  return {
    getSiteName,
    currency,
    wechatConfig,
    budgetConfig,
    plans
  }
}