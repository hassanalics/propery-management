import Link from 'next/link'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { PropertyCard } from '@/components/PropertyCard'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const [featured, recent] = await Promise.all([
    payload.find({
      collection: 'properties',
      depth: 1,
      draft: false,
      limit: 3,
      overrideAccess: false,
      sort: '-createdAt',
      where: { and: [{ featured: { equals: true } }, { availability: { equals: 'available' } }] },
    }),
    payload.find({
      collection: 'properties',
      depth: 1,
      draft: false,
      limit: 3,
      overrideAccess: false,
      sort: '-createdAt',
      where: { availability: { equals: 'available' } },
    }),
  ])

  return (
    <main>
      <section className="bg-[#103d32] px-5 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">A better place to begin</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">Find a place that feels like yours.</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-emerald-50/80 sm:text-lg">Explore carefully selected homes, apartments and investment properties in your preferred neighbourhood.</p>
          <form action="/properties" className="mt-10 grid gap-3 rounded-2xl bg-white p-3 text-stone-900 shadow-xl sm:grid-cols-[1fr_190px_auto]">
            <label className="sr-only" htmlFor="home-search">City or neighbourhood</label>
            <input id="home-search" name="q" placeholder="City or neighbourhood" className="min-w-0 rounded-xl px-4 py-3 outline-none placeholder:text-stone-400" />
            <select name="transactionType" aria-label="Listing type" className="rounded-xl border border-stone-200 bg-white px-4 py-3">
              <option value="">Buy or rent</option><option value="sale">Buy</option><option value="rent">Rent</option>
            </select>
            <button className="rounded-xl bg-emerald-900 px-7 py-3 font-semibold text-white hover:bg-emerald-800">Search homes</button>
          </form>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-emerald-50/75"><span>Homes picked with care</span><span>Local market knowledge</span><span>Here to guide you</span></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-800">Handpicked</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">Featured properties</h2></div>
          <Link href="/properties" className="hidden text-sm font-semibold text-emerald-900 hover:underline sm:block">Browse all properties →</Link>
        </div>
        {featured.docs.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featured.docs.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <p className="rounded-xl border border-dashed border-stone-300 p-8 text-stone-600">No featured properties yet. Publish listings and mark them featured in the admin dashboard.</p>}
      </section>

      <section className="bg-stone-50 px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-800">Just listed</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">Recent properties</h2></div><Link href="/properties" className="text-sm font-semibold text-emerald-900 hover:underline">See all →</Link></div>
          {recent.docs.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{recent.docs.map((property) => <PropertyCard key={property.id} property={property} />)}</div> : <p className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-stone-600">Your published listings will appear here.</p>}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex flex-col justify-between gap-6 rounded-3xl bg-[#e8efe9] p-8 sm:flex-row sm:items-center sm:p-12">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-800">Personal guidance</p><h2 className="mt-2 max-w-xl text-3xl font-semibold tracking-tight text-stone-900">Looking for the right property?</h2><p className="mt-3 max-w-xl text-stone-600">Tell us what matters to you and we’ll help you find the right fit.</p></div>
          <Link href="/contact" className="shrink-0 rounded-xl bg-emerald-900 px-6 py-3 text-center font-semibold text-white hover:bg-emerald-800">Talk to our team</Link>
        </div>
      </section>
    </main>
  )
}
