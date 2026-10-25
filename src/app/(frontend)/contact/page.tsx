import type { Metadata } from 'next'
import { InquiryForm } from '@/components/InquiryForm'

export const metadata: Metadata = { title: 'Contact | Property Management' }

export default function ContactPage() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, '')

  return (
    <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr]">
      <div><p className="text-sm font-semibold uppercase tracking-wider text-emerald-800">We’re here to help</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-900">Let’s talk property.</h1><p className="mt-4 max-w-lg leading-7 text-stone-600">Tell us a little about what you’re looking for. Our team will get back to you as soon as possible.</p>{phone && <a href={`https://wa.me/${phone}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-lg border border-emerald-800 px-5 py-3 font-semibold text-emerald-900 hover:bg-emerald-50">Chat with us on WhatsApp</a>}</div>
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="mb-5 text-xl font-semibold text-stone-900">Send us a message</h2><InquiryForm /></section>
    </main>
  )
}
