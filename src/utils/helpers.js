import { formatDistanceToNow, format } from 'date-fns'

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

export function formatDate(date, formatStr = 'MMM dd, yyyy') {
  return format(new Date(date), formatStr)
}

export function formatDateRelative(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function calculatePercentage(value, total) {
  if (total === 0) return 0
  return ((value / total) * 100).toFixed(1)
}

export function getCategoryColor(category) {
  const colors = {
    'groceries': '#22c55e',
    'dining': '#f97316',
    'entertainment': '#8b5cf6',
    'transportation': '#06b6d4',
    'utilities': '#eab308',
    'healthcare': '#ef4444',
    'shopping': '#ec4899',
    'savings': '#06b6d4',
    'other': '#6b7280'
  }
  return colors[category?.toLowerCase()] || colors.other
}

export function getCategoryIcon(category) {
  const icons = {
    'groceries': '🛒',
    'dining': '🍽️',
    'entertainment': '🎬',
    'transportation': '🚗',
    'utilities': '💡',
    'healthcare': '⚕️',
    'shopping': '🛍️',
    'savings': '💰',
    'other': '📦'
  }
  return icons[category?.toLowerCase()] || icons.other
}

export function truncateText(text, length = 50) {
  return text.length > length ? text.substring(0, length) + '...' : text
}
