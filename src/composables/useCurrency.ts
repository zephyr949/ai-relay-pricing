import { computed } from 'vue'
import { useEnvConfig } from '@/composables/useEnvConfig'
import { formatPrice, getCurrencySymbol } from '@/utils/currency'
import type { Currency } from '@/types'

export function useCurrency() {
  const { currency } = useEnvConfig()

  const formatCurrency = (price: number): string => {
    return formatPrice(price, currency.value)
  }

  const currencySymbol = computed(() => {
    return getCurrencySymbol(currency.value)
  })

  return {
    currency,
    formatCurrency,
    currencySymbol
  }
}