/// <reference types="vite/client" />

interface ImportMetaEnv {
  // 站点信息
  readonly VITE_SITE_NAME_EN: string
  readonly VITE_SITE_NAME_ZH: string
  
  // 货币设置
  readonly VITE_CURRENCY: 'USD' | 'CNY'
  
  // 微信信息
  readonly VITE_WECHAT_ID: string
  
  // API配置
  readonly VITE_API_BASE_URL: string
  
  // 套餐配置
  readonly VITE_BASIC_PLAN_PRICE: string
  readonly VITE_BASIC_PLAN_POPULAR: string
  readonly VITE_BASIC_PLAN_AVAILABLE: string
  readonly VITE_BASIC_PLAN_MONTHLY_BUDGET: string
  readonly VITE_BASIC_PLAN_DAILY_BUDGET: string
  readonly VITE_BASIC_PLAN_MODELS: string
  
  readonly VITE_PROFESSIONAL_PLAN_PRICE: string
  readonly VITE_PROFESSIONAL_PLAN_POPULAR: string
  readonly VITE_PROFESSIONAL_PLAN_AVAILABLE: string
  readonly VITE_PROFESSIONAL_PLAN_MONTHLY_BUDGET: string
  readonly VITE_PROFESSIONAL_PLAN_DAILY_BUDGET: string
  readonly VITE_PROFESSIONAL_PLAN_MODELS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}