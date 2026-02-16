// الأسعار في قاعدة البيانات بالدولار
export const CURRENCY = 'USD'
export const CURRENCY_SYMBOL = '$'

export function formatPrice(price) {
  if (price == null) return ''
  const num = Number(price)
  return `${CURRENCY_SYMBOL}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const categoryLabels = {
  electronics: 'إلكترونيات',
  clothes: 'ملابس',
  perfumes: 'عطور'
}

export function getCategoryLabel(cat) {
  return categoryLabels[cat] || cat || ''
}
