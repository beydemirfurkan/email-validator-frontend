import Cookies from 'js-cookie'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
console.log('API_URL:', API_URL, 'ENV:', process.env.NEXT_PUBLIC_API_URL)

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface ValidationResult {
  valid: boolean
  email: string
  score: number
  reason: string[]
  details: {
    format: boolean
    mx: boolean
    smtp?: boolean
    disposable: boolean
    role: boolean
    typo: boolean
    suspicious: boolean
    spamKeywords: boolean
  }
  suggestion?: string
  provider?: string
  processingTime?: number
  fromCache?: boolean
  error?: unknown
}

export interface User {
  id: number
  email: string
  name: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiKey {
  id: number
  keyName: string
  key?: string
  lastUsedAt?: string
  expiresAt?: string
  isActive: boolean
  rateLimit: number
  createdAt: string
}

export interface ContactList {
  id: number
  name: string
  description?: string
  totalContacts: number
  validContacts: number
  invalidContacts: number
  riskyContacts: number
  unknownContacts: number
  lastValidatedAt?: string
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: number
  name: string
  description?: string
  price: number
  billingCycle: string
  validationsPerMonth: number
  maxApiKeys?: number
  maxContactLists?: number
  bulkValidation?: boolean
  apiAccess?: boolean
  features: Array<{
    name: string
    value?: string
    enabled: boolean
  }>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    console.log('API Request:', { url, baseUrl: this.baseUrl, endpoint })
    
    // Get token from cookies
    const token = Cookies.get('auth-token')
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    // Add auth token if available
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      console.error('URL:', url)
      console.error('Config:', config)
      throw error
    }
  }

  // Auth endpoints
  async register(userData: {
    name: string
    email: string
    password: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(credentials: {
    email: string
    password: string
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async getProfile(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/api/auth/profile')
  }

  async updateProfile(data: { name: string }): Promise<ApiResponse<{ user: User }>> {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<ApiResponse> {
    return this.request('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Email validation endpoints
  async validateEmail(email: string): Promise<ApiResponse<ValidationResult>> {
    return this.request('/api/email-validation/validate-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async validateEmails(emails: string[]): Promise<ApiResponse<{
    results: ValidationResult[]
    statistics: {
      total: number
      valid: number
      invalid: number
      validPercentage: string
      invalidPercentage: string
    }
    processing: {
      totalSubmitted: number
      duplicatesRemoved: number
      processed: number
    }
  }>> {
    return this.request('/api/email-validation/validate-emails', {
      method: 'POST',
      body: JSON.stringify({ emails }),
    })
  }

  async getHealth(): Promise<ApiResponse<{
    status: string
    timestamp: string
    uptime: number
    version: string
    database: string
    cache?: {
      size: number
      hitRate: number
    }
  }>> {
    return this.request('/api/email-validation/health')
  }

  // API Keys management
  async getApiKeys(): Promise<ApiResponse<{ apiKeys: ApiKey[]; total: number }>> {
    return this.request('/api/keys')
  }

  async createApiKey(data: {
    keyName: string
    rateLimit?: number
    expiryDays?: number
  }): Promise<ApiResponse<{ apiKey: ApiKey; warning: string }>> {
    return this.request('/api/keys', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateApiKey(
    id: number,
    data: {
      keyName?: string
      rateLimit?: number
      isActive?: boolean
    }
  ): Promise<ApiResponse<{ apiKey: ApiKey }>> {
    return this.request(`/api/keys/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteApiKey(id: number): Promise<ApiResponse> {
    return this.request(`/api/keys/${id}`, {
      method: 'DELETE',
    })
  }

  // Contact Lists
  async getContactLists(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<ApiResponse<ContactList[]>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)

    return this.request(`/api/contact-lists?${searchParams.toString()}`)
  }

  async createContactList(data: {
    name: string
    description?: string
    tags?: string[]
  }): Promise<ApiResponse<{ contactList: ContactList }>> {
    return this.request('/api/contact-lists', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Analytics
  async getDashboard(period?: number): Promise<ApiResponse<{
    dashboard: {
      period: string
      validations: {
        total: number
        averageProcessingTime: number
      }
      contacts: {
        totalLists: number
        totalContacts: number
        valid: number
        invalid: number
        risky: number
        unknown: number
        validPercentage: string
      }
      recentActivity: Array<{
        date: string
        validations: number
      }>
    }
  }>> {
    const params = period ? `?period=${period}` : ''
    return this.request(`/api/analytics/dashboard${params}`)
  }

  // Plans
  async getPlans(): Promise<ApiResponse<{ plans: Plan[] }>> {
    return this.request('/api/plans')
  }

  async getCurrentSubscription(): Promise<ApiResponse<{
    subscription: Record<string, unknown>
  }>> {
    return this.request('/api/plans/subscriptions')
  }

  async getUsage(): Promise<ApiResponse<{
    usage: {
      planName: string
      validationsUsed: number
      validationsLimit: number
      utilizationPercentage: string
      daysRemaining: number
    }
  }>> {
    return this.request('/api/plans/usage')
  }

  // File upload
  async uploadCsv(
    file: File,
    immediate: boolean = true
  ): Promise<ApiResponse<Record<string, unknown>>> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('immediate', immediate.toString())

    const token = Cookies.get('auth-token')
    
    const response = await fetch('/api/files/validate-csv', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    return response.json()
  }

  async exportCsv(results: ValidationResult[]): Promise<Blob> {
    const token = Cookies.get('auth-token')
    
    const response = await fetch('/api/files/export-csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ results }),
    })

    if (!response.ok) {
      throw new Error('Export failed')
    }

    return response.blob()
  }

  // Analytics
  async getValidationLogs(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<{
    logs: Array<{
      id: number
      email: string
      status: 'valid' | 'invalid' | 'risky'
      score: number
      processingTime: number
      createdAt: string
    }>
    total: number
  }>> {
    return this.request(`/api/analytics/validation-logs?page=${page}&limit=${limit}`)
  }

  // Additional Contact List methods

  async deleteContactList(id: number): Promise<ApiResponse<Record<string, unknown>>> {
    return this.request(`/api/contact-lists/${id}`, {
      method: 'DELETE'
    })
  }

  async validateContactList(id: number): Promise<ApiResponse<Record<string, unknown>>> {
    return this.request(`/api/contact-lists/${id}/validate`, {
      method: 'POST'
    })
  }

  async updateContactList(id: number, name: string, description?: string): Promise<ApiResponse<{ contactList: ContactList }>> {
    return this.request(`/api/contact-lists/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description })
    })
  }
}

export const api = new ApiClient()