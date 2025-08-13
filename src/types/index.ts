export interface Plan {
  id: string
  nameKey: string
  price: number
  period: string
  descriptionKey: string
  popular?: boolean
  features: string[]
  buttonTextKey: string
  unavailable?: boolean
}

export interface PricingConfig {
  plans: Plan[]
}

export interface Settings {
  wechatId: string
  apiBaseUrl: string
  wechatQrImage: string
  currency: 'USD' | 'CNY'
}

export type Currency = 'USD' | 'CNY'

export interface I18nMessages {
  [locale: string]: {
    [key: string]: any
  }
}

export type Locale = 'en' | 'zh'