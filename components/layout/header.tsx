'use client'

import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CheckIcon, ChevronDownIcon, UserIcon, SettingsIcon, KeyIcon, CreditCardIcon, BookOpenIcon, LogOutIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function Header() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <CheckIcon className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold">Valid2Go</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Dashboard
          </Link>
          <Link
            href="/bulk-verification"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Bulk Verification
          </Link>
          <Link
            href="/blocklist"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Blocklist
          </Link>
        </nav>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {user?.name || 'User'}
              </span>
              <ChevronDownIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href="/api-keys" className="flex items-center">
                <KeyIcon className="w-4 h-4 mr-2" />
                API Keys
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem disabled>
              <SettingsIcon className="w-4 h-4 mr-2" />
              Webhooks (Soon)
            </DropdownMenuItem>
            
            <DropdownMenuItem disabled>
              <UserIcon className="w-4 h-4 mr-2" />
              Team (Soon)
            </DropdownMenuItem>
            
            <DropdownMenuItem disabled>
              <CreditCardIcon className="w-4 h-4 mr-2" />
              Billing (Soon)
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center">
                <SettingsIcon className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem>
              <BookOpenIcon className="w-4 h-4 mr-2" />
              Documentation
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}