import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import { PropertyCard } from '@/components/PropertyCard'

export const metadata: Metadata = { title: 'Properties | Property Management' }

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function PropertiesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const value = (key: string) => typeof params[key] === 'string' ? (params[key] as string).trim() : ''
  const query = value('q')
  const city = value('city')
  const area = value('area')
  const transactionType = value('transactionType')
  const propertyType = value('propertyType')
  const minimumPrice = Number(value('minPrice'))
  const maximumPrice = Number(value('maxPrice'))
  const filters: Where[] = []

  if (transactionType === 'sale' || transactionType === 'rent') filters.push({ transactionType: { equals: transactionType } })
  if (['house', 'apartment', 'plot', 'commercial', 'farmhouse'].includes(propertyType)) filters.push({ propertyType: { equals: propertyType } })
  if (city) filters.push({ city: { equals: city } })
  if (area) filters.push({ area: { contains: area } })
  if (query) filters.push({ or: [{ title: { like: query } }, { city: { like: query } }, { area: { like: query } }] })
  if (value('minPrice') && Number.isFinite(minimumPrice)) filters.push({ price: { greater_than_equal: minimumPrice } })
  if (value('maxPrice') && Number.isFinite(maximumPrice)) filters.push({ price: { less_than_equal: maximumPrice } })

  const payload = await getPayload({ config: configPromise })
  const [properties, citiesResult] = await Promise.all([
    payload.find({
      collection: 'properties',
      depth: 1,
      draft: false,
      limit: 60,
      overrideAccess: false,
      sort: '-createdAt',
      where: filters.length ? { and: filters } : undefined,
    }),
    payload.find({ collection: 'properties', draft: false, limit: 1000, overrideAccess: false, select: { city: true } }),
  ])
  const cities = [...new Set(citiesResult.docs.map((property) => property.city).filter(Boolean))].sort()

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-wider text-emerald-800">Explore homes</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">Find your next property</h1><p className="mt-3 text-stone-600">Browse published homes, apartments and investment opportunities.</p></div>
      <form action="/properties" className="mt-8 grid gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input name="q" defaultValue={query} placeholder="Search listings" aria-label="Search listings" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5" />
        <select name="transactionType" defaultValue={transactionType} aria-label="Sale or rent" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5"><option value="">Buy or rent</option><option value="sale">For sale</option><option value="rent">For rent</option></select>
        <select name="city" defaultValue={city} aria-label="City" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5"><option value="">All cities</option>{cities.map((name) => <option value={name} key={name}>{name}</option>)}</select>
        <input name="area" defaultValue={area} placeholder="Area or neighbourhood" aria-label="Area or neighbourhood" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5" />
        <select name="propertyType" defaultValue={propertyType} aria-label="Property type" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5"><option value="">Any property type</option><option value="house">House</option><option value="apartment">Apartment</option><option value="plot">Plot</option><option value="commercial">Commercial</option><option value="farmhouse">Farmhouse</option></select>
        <input name="minPrice" type="number" min="0" defaultValue={value('minPrice')} placeholder="Min price (PKR)" aria-label="Minimum price" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5" />
        <input name="maxPrice" type="number" min="0" defaultValue={value('maxPrice')} placeholder="Max price (PKR)" aria-label="Maximum price" className="rounded-lg border border-stone-300 bg-white px-3 py-2.5" />
        <button className="rounded-lg bg-emerald-900 px-4 py-2.5 font-semibold text-white hover:bg-emerald-800">Apply filters</button>
      </form>
      <div className="mt-8 flex items-center justify-between"><h2 className="text-lg font-semibold text-stone-900">{properties.totalDocs} properties</h2>{Object.values(params).some(Boolean) && <a href="/properties" className="text-sm font-medium text-emerald-900 hover:underline">Clear filters</a>}</div>
      {properties.docs.length ? <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{properties.docs.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-stone-300 p-10 text-center"><h2 className="text-lg font-semibold">No properties found</h2><p className="mt-2 text-stone-600">Try changing your filters or check back soon.</p></div>}
    </main>
  )
}
