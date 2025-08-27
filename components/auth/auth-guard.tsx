'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckIcon } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're sure there's no authentication
    if (!isLoading && !isAuthenticated) {
      // Add a small delay to ensure auth initialization is complete
      setTimeout(() => {
        if (!useAuth.getState().isAuthenticated) {
          router.push('/login')
        }
      }, 100)
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <CheckIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return <>{children}</>
}