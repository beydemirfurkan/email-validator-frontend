'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { Header } from '@/components/layout/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-purple-50/30">
        <Header />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}