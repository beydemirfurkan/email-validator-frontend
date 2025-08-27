'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { CheckIcon } from 'lucide-react'
import Cookies from 'js-cookie'

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Only redirect after auth loading is complete
    if (!isLoading && !hasRedirected) {
      setHasRedirected(true)
      if (isAuthenticated) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isLoading, router, hasRedirected])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center animate-pulse">
            <CheckIcon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Valid2Go</h1>
        <p className="text-gray-600 text-sm mt-1">
          {isLoading ? 'Checking authentication...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  )
}
