// 格式化预算金额，大于1000时使用k简写
export function formatBudgetAmount(amount: number, formatCurrency: (amount: number) => string): string {
  // 对于大于等于1000的数值，使用k简写
  if (amount >= 1000) {
    const kValue = amount / 1000
    // 如果是整数k值，不显示小数
    if (kValue === Math.floor(kValue)) {
      return formatCurrency(kValue) + 'k'
    }
    // 显示一位小数
    return formatCurrency(parseFloat(kValue.toFixed(1))) + 'k'
  }
  
  return formatCurrency(amount)
}

// 格式化预算（美元）- 直接显示为 $xxx
export function formatBudget(amount: number): string {
  if (amount >= 1000) {
    const kValue = amount / 1000
    // 如果是整数k值，不显示小数
    if (kValue === Math.floor(kValue)) {
      return `$${kValue}k`
    }
    // 显示一位小数
    return `$${kValue.toFixed(1)}k`
  }
  
  return `$${amount}`
}