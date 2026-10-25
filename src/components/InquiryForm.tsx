'use client'

import { useState, type FormEvent } from 'react'

export function InquiryForm({ propertyId }: { propertyId?: number }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('sending')
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const data: Record<string, string | number> = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      phone: String(form.get('phone') || ''),
      message: String(form.get('message') || ''),
    }
    if (propertyId) data.property = propertyId

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setState(response.ok ? 'sent' : 'error')
      if (response.ok) formElement.reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-900">Thanks for reaching out. We’ll be in touch soon.</p>
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm font-medium text-stone-700">Your name<input name="name" required autoComplete="name" className="rounded-lg border border-stone-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-800" /></label>
      <label className="grid gap-1.5 text-sm font-medium text-stone-700">Email<input name="email" type="email" required autoComplete="email" className="rounded-lg border border-stone-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-800" /></label>
      <label className="grid gap-1.5 text-sm font-medium text-stone-700">Phone<input name="phone" type="tel" required autoComplete="tel" className="rounded-lg border border-stone-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-800" /></label>
      <label className="grid gap-1.5 text-sm font-medium text-stone-700">Message<textarea name="message" required rows={4} className="rounded-lg border border-stone-300 px-3 py-2.5 font-normal outline-none focus:border-emerald-800" /></label>
      <button disabled={state === 'sending'} className="rounded-lg bg-emerald-900 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60">{state === 'sending' ? 'Sending…' : 'Send inquiry'}</button>
      {state === 'error' && <p role="alert" className="text-sm text-red-700">We couldn’t send your message. Please try again.</p>}
    </form>
  )
}
