import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import Link from 'next/link'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <header className="border-b border-stone-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
              <Link href="/" className="text-lg font-bold tracking-tight text-emerald-950">Property Management<span className="ml-1 text-emerald-700">.</span></Link>
              <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium text-stone-700 sm:gap-8">
                <Link href="/properties" className="hover:text-emerald-900">Properties</Link>
                <Link href="/contact" className="rounded-lg bg-emerald-900 px-4 py-2.5 text-white hover:bg-emerald-800">Contact</Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className="bg-stone-950 px-5 py-10 text-stone-300">
            <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div><Link href="/" className="font-semibold text-white">Property Management</Link><p className="mt-1 text-sm text-stone-400">Helping you find a place to call home.</p></div>
              <div className="flex gap-5 text-sm"><Link href="/properties" className="hover:text-white">Browse properties</Link><Link href="/contact" className="hover:text-white">Contact</Link><Link href="/admin" className="hover:text-white">Staff login</Link></div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}
