import React from 'react'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Genesis Energy — Total Cost of Energy',
  description: 'See your total household energy spend across power, gas, and petrol — and discover how much you could save by going electric.',
  robots: { index: false, follow: false },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'Genesis Energy — Total Cost of Energy',
    description: 'See your total household energy spend and how much you could save by going electric.',
    type: 'website',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
