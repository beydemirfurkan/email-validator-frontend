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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container py-6">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}