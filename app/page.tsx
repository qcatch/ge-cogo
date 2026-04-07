import { Header } from '@/components/layout/header'
import { Dashboard } from '@/components/dashboard'

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <Header />
      <Dashboard />
    </main>
  )
}
