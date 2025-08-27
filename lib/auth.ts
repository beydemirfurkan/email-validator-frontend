import { create } from 'zustand'
import Cookies from 'js-cookie'
import { api, type User } from './api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateUser: (user: User) => void
}

export const useAuth = create<AuthState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to prevent premature redirects

  login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await api.login({ email, password })
          
          if (response.success && response.data) {
            const { user, token } = response.data
            
            // Store token in httpOnly cookie (would be better but for now using js-cookie)
            Cookies.set('auth-token', token, { 
              expires: 1, // 1 day
              sameSite: 'strict',
              secure: process.env.NODE_ENV === 'production'
            })
            
            set({ 
              user, 
              isAuthenticated: true,
              isLoading: false 
            })
          } else {
            throw new Error(response.error || 'Login failed')
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await api.register({ name, email, password })
          
          if (response.success && response.data) {
            const { user, token } = response.data
            
            Cookies.set('auth-token', token, { 
              expires: 1,
              sameSite: 'strict',
              secure: process.env.NODE_ENV === 'production'
            })
            
            set({ 
              user, 
              isAuthenticated: true,
              isLoading: false 
            })
          } else {
            throw new Error(response.error || 'Registration failed')
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        Cookies.remove('auth-token')
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        })
      },

      refreshUser: async () => {
        const token = Cookies.get('auth-token')
        if (!token) {
          set({ user: null, isAuthenticated: false, isLoading: false })
          return
        }

        try {
          const response = await api.getProfile()
          if (response.success && response.data) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            // Token is invalid
            get().logout()
          }
        } catch (error) {
          console.error('Failed to refresh user:', error)
          get().logout()
        }
      },

      updateUser: (user: User) => {
        set({ user })
      },
    }))

// Initialize auth state on app start
export const initAuth = async () => {
  const token = Cookies.get('auth-token')
  if (token) {
    await useAuth.getState().refreshUser()
  } else {
    // No token, set loading to false
    useAuth.setState({ isLoading: false })
  }
}