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
      total: parseFloat(import.meta.env.VITE_TRIAL_PLAN_TOTAL_BUDGET || '20'),
      daily: parseFloat(import.meta.env.VITE_TRIAL_PLAN_DAILY_BUDGET || '20'),
      models: import.meta.env.VITE_TRIAL_PLAN_MODELS || 'sonnet-4'
    },
    standard: {
      total: parseFloat(import.meta.env.VITE_STANDARD_PLAN_TOTAL_BUDGET || '175'),
      daily: parseFloat(import.meta.env.VITE_STANDARD_PLAN_DAILY_BUDGET || '25'),
      models: import.meta.env.VITE_STANDARD_PLAN_MODELS || 'sonnet-4'
    },
    professional: {
      total: parseFloat(import.meta.env.VITE_PROFESSIONAL_PLAN_TOTAL_BUDGET || '750'),
      daily: parseFloat(import.meta.env.VITE_PROFESSIONAL_PLAN_DAILY_BUDGET || '25'),
      models: import.meta.env.VITE_PROFESSIONAL_PLAN_MODELS || 'sonnet-4'
    }
  }))

  // 根据周期获取预算特性
  const getBudgetFeature = (planId: string, period: string): string => {
    // 所有套餐都显示总额度
    return `plans.${planId}.features.total_budget`
  }

  // 动态生成套餐配置
  const plans = computed<Plan[]>(() => {
    const trialPeriod = import.meta.env.VITE_TRIAL_PLAN_PERIOD || 'day'
    const standardPeriod = import.meta.env.VITE_STANDARD_PLAN_PERIOD || 'week'
    const professionalPeriod = import.meta.env.VITE_PROFESSIONAL_PLAN_PERIOD || 'month'
    
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
          'plans.trial.features.daily_budget',
          'plans.trial.features.unlimited_requests',
          'plans.trial.features.basic_support'
        ],
        buttonTextKey: 'plans.trial.button',
        unavailable: import.meta.env.VITE_TRIAL_PLAN_AVAILABLE !== 'true'
      },
      {
        id: 'standard',
        nameKey: 'plans.standard.name',
        price: parseFloat(import.meta.env.VITE_STANDARD_PLAN_PRICE || '9.9'),
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
      },
      {
        id: 'professional',
        nameKey: 'plans.professional.name',
        price: parseFloat(import.meta.env.VITE_PROFESSIONAL_PLAN_PRICE || '229'),
        period: professionalPeriod,
        descriptionKey: 'plans.professional.description',
        popular: import.meta.env.VITE_PROFESSIONAL_PLAN_POPULAR === 'true',
        features: [
          'plans.professional.features.supported_models',
          getBudgetFeature('professional', professionalPeriod),
          'plans.professional.features.daily_budget',
          'plans.professional.features.unlimited_requests',
          'plans.professional.features.basic_support'
        ],
        buttonTextKey: 'plans.professional.button',
        unavailable: import.meta.env.VITE_PROFESSIONAL_PLAN_AVAILABLE !== 'true'
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