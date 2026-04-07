'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Calculator', target: 'calculator' },
  { label: 'Savings', target: 'savings-roadmap' },
  { label: 'Bill Tracker', target: 'bill-tracker' },
]

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <GenesisLogo />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-primary leading-tight">Genesis Energy</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground leading-tight">Total Cost of Energy</span>
              <span className="bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium leading-none">Prototype</span>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Button key={item.target} variant="ghost" size="sm" onClick={() => scrollTo(item.target)}>
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border px-4 py-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.target}
              className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md"
              onClick={() => { scrollTo(item.target); setMobileMenuOpen(false) }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}

function GenesisLogo() {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-9 h-9"
      aria-label="Genesis Energy"
    >
      {/* Spark / angular bird mark — geometric recreation from Brand 4.0 */}
      <rect width="40" height="40" rx="8" className="fill-primary" />
      <path
        d="M20 8 L32 18 L26 18 L32 28 L24 28 L28 32 L8 20 L16 20 L10 14 L18 14 Z"
        fill="white"
        fillRule="evenodd"
      />
    </svg>
  )
}
