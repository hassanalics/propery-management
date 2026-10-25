import type { Media, Property } from '@/payload-types'

export const getPropertyImage = (image: number | Media | null | undefined) => {
  if (!image || typeof image === 'number') return null
  return image.url || null
}

export const formatPrice = (price: number, transactionType: Property['transactionType']) => {
  const formatted = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(price)
  return `PKR ${formatted}${transactionType === 'rent' ? ' / month' : ''}`
}

export const propertyTypes: Record<Property['propertyType'], string> = {
  house: 'House',
  apartment: 'Apartment',
  plot: 'Plot',
  commercial: 'Commercial',
  farmhouse: 'Farmhouse',
}
