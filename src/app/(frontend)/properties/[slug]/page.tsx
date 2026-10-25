import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import configPromise from '@payload-config'
import { InquiryForm } from '@/components/InquiryForm'
import { getPropertyImage, formatPrice, propertyTypes } from '@/utilities/propertyPresentation'
import { getPayload } from 'payload'

type Args = { params: Promise<{ slug: string }> }

async function getProperty(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'properties',
    depth: 1,
    draft: false,
    limit: 1,
    overrideAccess: false,
    where: { slug: { equals: slug } },
  })
  return result.docs[0] || null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const property = await getProperty(slug)
  return property ? { title: `${property.title} | Property Management`, description: `${property.propertyType} in ${property.area}, ${property.city}.` } : { title: 'Property not found' }
}

export default async function PropertyPage({ params }: Args) {
  const { slug } = await params
  const property = await getProperty(slug)
  if (!property) notFound()

  const cover = getPropertyImage(property.coverImage)
  const gallery = (property.gallery || []).map(getPropertyImage).filter((url): url is string => Boolean(url) && url !== cover)
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')
  const whatsapp = phone ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hello, I'm interested in ${property.title} (${property.slug}).`)}` : null

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
      <Link href="/properties" className="text-sm font-medium text-emerald-900 hover:underline">← All properties</Link>
      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100 sm:aspect-[16/10]">
            {cover && <Image src={cover} alt={property.title} fill priority sizes="(max-width: 1024px) 100vw, 65vw" className="object-cover" />}
            {!cover && <div className="flex h-full items-center justify-center text-stone-400">Property photo</div>}
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-900">{property.transactionType === 'sale' ? 'For sale' : 'For rent'}</span>
            {property.availability !== 'available' && <span className="absolute right-4 top-4 rounded-full bg-stone-900/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">{property.availability}</span>}
          </div>
          {gallery.length > 0 && <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">{gallery.map((src, index) => <div className="relative aspect-square overflow-hidden rounded-xl bg-stone-100" key={`${src}-${index}`}><Image src={src} alt={`${property.title} photo ${index + 2}`} fill sizes="(max-width: 640px) 33vw, 20vw" className="object-cover" /></div>)}</div>}
          <div className="mt-8"><p className="text-sm font-semibold uppercase tracking-wider text-emerald-800">{propertyTypes[property.propertyType]}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">{property.title}</h1><p className="mt-2 text-stone-600">{property.address ? `${property.address}, ` : ''}{property.area}, {property.city}</p></div>
          <div className="mt-6 flex flex-wrap gap-3">{property.bedrooms != null && <span className="rounded-lg bg-stone-100 px-4 py-2 text-sm text-stone-700">{property.bedrooms} bedrooms</span>}{property.bathrooms != null && <span className="rounded-lg bg-stone-100 px-4 py-2 text-sm text-stone-700">{property.bathrooms} bathrooms</span>}{property.areaSize != null && <span className="rounded-lg bg-stone-100 px-4 py-2 text-sm text-stone-700">{property.areaSize} {property.areaUnit || 'sqft'}</span>}</div>
          <section className="mt-8 border-t border-stone-200 pt-7"><h2 className="text-xl font-semibold text-stone-900">About this property</h2><p className="mt-3 whitespace-pre-line leading-7 text-stone-600">{property.description}</p></section>
        </div>
        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
          <p className="text-sm text-stone-500">{property.transactionType === 'sale' ? 'Asking price' : 'Monthly rent'}</p><p className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">{formatPrice(property.price, property.transactionType)}</p>
          <div className="mt-5 border-t border-stone-100 pt-5"><h2 className="mb-4 text-lg font-semibold text-stone-900">Interested in this property?</h2><InquiryForm propertyId={property.id} />
            {whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className="mt-3 block rounded-lg border border-emerald-800 px-5 py-3 text-center font-semibold text-emerald-900 hover:bg-emerald-50">Ask on WhatsApp</a>}
          </div>
        </aside>
      </div>
    </main>
  )
}
