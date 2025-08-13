import type { Currency } from '@/types'

export function formatPrice(price: number, currency: Currency = 'USD'): string {
  const formatters = {
    USD: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }),
    CNY: new Intl.NumberFormat('zh-CN', {
      style: 'currency', 
      currency: 'CNY',
      minimumFractionDigits: 2
    })
  }

  return formatters[currency].format(price)
}

export function getCurrencySymbol(currency: Currency = 'USD'): string {
  const symbols = {
    USD: '$',
    CNY: '¥'
  }
  
  return symbols[currency]
}