'use client'

import { useRef, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Dashboard } from '@/components/dashboard'

export default function Home() {
  const navigateRef = useRef<((target: string) => void) | null>(null)

  const handleRegisterNavigate = useCallback((handler: (target: string) => void) => {
    navigateRef.current = handler
  }, [])

  const handleHeaderNavigate = useCallback((target: string) => {
    if (navigateRef.current) {
      navigateRef.current(target)
    }
  }, [])

  return (
    <main className="flex flex-col h-screen">
      <Header onNavigate={handleHeaderNavigate} />
      <Dashboard onRegisterNavigate={handleRegisterNavigate} />
    </main>
  )
}
