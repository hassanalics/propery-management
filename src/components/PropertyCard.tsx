import Image from 'next/image'
import Link from 'next/link'
import type { Property } from '@/payload-types'
import { formatPrice, getPropertyImage, propertyTypes } from '@/utilities/propertyPresentation'

export function PropertyCard({ property }: { property: Property }) {
  const image = getPropertyImage(property.coverImage)

  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/properties/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-stone-100">
          {image ? (
            <Image src={image} alt={property.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">Add property photos in the admin</div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-900">
            {property.transactionType === 'sale' ? 'For sale' : 'For rent'}
          </span>
        </div>
        <div className="p-5">
          <p className="text-xl font-semibold text-stone-900">{formatPrice(property.price, property.transactionType)}</p>
          <h3 className="mt-2 text-lg font-medium text-stone-800">{property.title}</h3>
          <p className="mt-1 text-sm text-stone-500">{property.area}, {property.city}</p>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-stone-100 pt-4 text-sm text-stone-500">
            <span>{propertyTypes[property.propertyType]}</span>
            {property.bedrooms != null && <span>{property.bedrooms} beds</span>}
            {property.bathrooms != null && <span>{property.bathrooms} baths</span>}
            {property.areaSize != null && <span>{property.areaSize} {property.areaUnit || 'sqft'}</span>}
          </div>
        </div>
      </Link>
    </article>
  )
}
