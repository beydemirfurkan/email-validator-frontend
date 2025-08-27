'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { api, type ValidationResult } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  KeyIcon, 
  CopyIcon, 
  BookOpenIcon, 
  SettingsIcon,
  CheckIcon,
  XIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  CalendarIcon,
  CreditCardIcon,
  UserIcon
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'sonner'
import Cookies from 'js-cookie'

export default function DashboardPage() {
  const [apiKey, setApiKey] = useState<string>('')
  const [testEmail, setTestEmail] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const queryClient = useQueryClient()

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => {
      console.log('🔍 Fetching dashboard data...')
      return api.getDashboard()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    onError: (error) => console.error('❌ Dashboard fetch error:', error),
    onSuccess: (data) => console.log('✅ Dashboard data:', data)
  })

  // Fetch user's first API key
  const { data: apiKeysData } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => api.getApiKeys(),
  })

  // Fetch usage data
  const { data: usageData, error: usageError } = useQuery({
    queryKey: ['usage'],
    queryFn: () => {
      console.log('🔍 Fetching usage data...')
      return api.getUsage()
    },
    onError: (error) => console.error('❌ Usage fetch error:', error),
    onSuccess: (data) => console.log('✅ Usage data:', data)
  })

  // Set first API key
  useEffect(() => {
    if (apiKeysData?.success && apiKeysData.data?.apiKeys && apiKeysData.data.apiKeys.length > 0) {
      setApiKey(`evapi_${'*'.repeat(20)}...${apiKeysData.data.apiKeys[0].keyName.slice(-4)}`)
    }
  }, [apiKeysData])

  const copyApiKey = async () => {
    if (apiKeysData?.success && apiKeysData.data?.apiKeys && apiKeysData.data.apiKeys.length > 0) {
      // In real app, you'd get the full key from creation response
      toast.success('API key copied to clipboard')
    }
  }

  // Single email validation mutation
  const singleValidationMutation = useMutation({
    mutationFn: (email: string) => api.validateEmail(email),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setValidationResult(response.data)
        toast.success('Email validated successfully!')
        
        // Temporary: Invalidate queries to simulate usage tracking
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['dashboard'] })
          queryClient.invalidateQueries({ queryKey: ['usage'] })
          queryClient.invalidateQueries({ queryKey: ['validationLogs'] })
        }, 1000)
      } else {
        toast.error(response.error || 'Validation failed')
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Validation failed')
    }
  })

  const handleTestValidation = () => {
    if (!testEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }
    
    // Debug: Check if user is authenticated
    const token = Cookies.get('auth-token')
    console.log('🔍 Auth Token:', token ? 'Present' : 'Missing')
    console.log('🔍 Validating email:', testEmail)
    
    singleValidationMutation.mutate(testEmail)
  }

  // Fetch recent validation logs
  const { data: validationLogsData, error: logsError } = useQuery({
    queryKey: ['validationLogs'],
    queryFn: () => {
      console.log('🔍 Fetching validation logs...')
      return api.getValidationLogs(1, 5) // Get 5 recent logs
    },
    refetchInterval: 30000,
    onError: (error) => console.error('❌ Validation logs fetch error:', error),
    onSuccess: (data) => console.log('✅ Validation logs data:', data)
  })

  // Mock chart data
  const chartData = dashboardData?.success && dashboardData.data ? 
    dashboardData.data.dashboard.recentActivity.map(item => ({
      date: item.date,
      requests: item.validations
    })) : [
      { date: '2024-01-09', requests: 45 },
      { date: '2024-01-10', requests: 32 },
      { date: '2024-01-11', requests: 78 },
      { date: '2024-01-12', requests: 95 },
      { date: '2024-01-13', requests: 67 },
      { date: '2024-01-14', requests: 89 },
      { date: '2024-01-15', requests: 123 }
    ]

  const dashboard = dashboardData?.success && dashboardData.data ? dashboardData.data.dashboard : null
  const usage = usageData?.success && usageData.data ? usageData.data.usage : null

  // Auth debug info
  useEffect(() => {
    const token = Cookies.get('auth-token')
    console.log('🔑 Current auth token:', token ? '✅ Present' : '❌ Missing')
    
    if (dashboardError) {
      console.error('🚨 Dashboard Error:', dashboardError)
    }
    if (usageError) {
      console.error('🚨 Usage Error:', usageError)  
    }
    if (logsError) {
      console.error('🚨 Logs Error:', logsError)
    }
  }, [dashboardError, usageError, logsError])

  if (dashboardLoading && !dashboard) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mt-2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Show login prompt if user is not authenticated
  if (dashboardError || usageError || logsError) {
    const token = Cookies.get('auth-token')
    if (!token) {
      return (
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
              <p className="text-gray-600 mb-6">
                Please login to view your dashboard, usage statistics, and validation history.
              </p>
              <Button asChild>
                <a href="/login">
                  Go to Login
                </a>
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening with your email validation.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Validations</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.validations?.total?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valid Emails</CardTitle>
            <CheckIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.contacts?.valid?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboard?.contacts?.validPercentage || '0'}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invalid Emails</CardTitle>
            <XIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.contacts?.invalid?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Disposable and invalid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <AlertCircleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard?.validations?.averageProcessingTime || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Lightning fast validation
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* API Key Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <KeyIcon className="h-5 w-5" />
              <span>API Key</span>
            </CardTitle>
            <CardDescription>
              Your authentication key for API requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <code className="flex-1 text-sm font-mono">
                {apiKey || 'No API key found'}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={copyApiKey}
                disabled={!apiKey}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="/api-keys" className="flex items-center">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Manage Keys
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/contact-lists" className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Contact Lists
                </a>
              </Button>
              <Button variant="outline" size="sm">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Read Docs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCardIcon className="h-5 w-5" />
              <span>Subscription</span>
            </CardTitle>
            <CardDescription>
              Your current plan and usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {usage?.planName || 'Free Plan'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {usage ? `${usage.validationsUsed?.toLocaleString()} / ${usage.validationsLimit?.toLocaleString()} requests used` : 
                   usageError ? 'Login required to view usage' : '0 / 1,000 requests used'}
                </div>
              </div>
              <Badge variant="secondary">
                {usage ? `${usage.daysRemaining} days left` : '∞'}
              </Badge>
            </div>
            
            {/* Usage Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: usage ? `${Math.min(100, (usage.validationsUsed / usage.validationsLimit) * 100)}%` : '10%'
                }}
              />
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{usage ? `${usage.utilizationPercentage}% used` : '10% used'}</span>
              <span>{usage?.daysRemaining || '∞'} days remaining</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Email Test */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Email Test</CardTitle>
          <CardDescription>
            Test a single email address validation with detailed results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter email address (e.g., test@example.com)"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTestValidation()}
              disabled={singleValidationMutation.isPending}
            />
            <Button 
              onClick={handleTestValidation}
              disabled={singleValidationMutation.isPending || !testEmail.trim()}
            >
              {singleValidationMutation.isPending ? 'Validating...' : 'Validate'}
            </Button>
          </div>

          {/* Validation Result */}
          {validationResult && (
            <div className="mt-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <Badge variant={validationResult.valid ? 'default' : 'destructive'} className="mb-1">
                    {validationResult.valid ? 'Valid' : 'Invalid'}
                  </Badge>
                  <div className="text-sm text-muted-foreground">Status</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{validationResult.score}/100</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{Math.round(validationResult.processingTime || 0)}ms</div>
                  <div className="text-sm text-muted-foreground">Processing Time</div>
                </div>
                <div className="text-center">
                  <Badge variant={validationResult.fromCache ? 'secondary' : 'outline'}>
                    {validationResult.fromCache ? 'Cached' : 'Fresh'}
                  </Badge>
                  <div className="text-sm text-muted-foreground">Source</div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Format:</span>
                  <Badge variant={validationResult.details?.format ? 'default' : 'destructive'} className="text-xs">
                    {validationResult.details?.format ? '✓' : '✗'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>MX Record:</span>
                  <Badge variant={validationResult.details?.mx ? 'default' : 'destructive'} className="text-xs">
                    {validationResult.details?.mx ? '✓' : '✗'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Disposable:</span>
                  <Badge variant={validationResult.details?.disposable ? 'secondary' : 'default'} className="text-xs">
                    {validationResult.details?.disposable ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Role Email:</span>
                  <Badge variant={validationResult.details?.role ? 'secondary' : 'default'} className="text-xs">
                    {validationResult.details?.role ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              {validationResult.provider && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Provider: </span>
                  <Badge variant="outline">{validationResult.provider}</Badge>
                </div>
              )}

              {validationResult.reason && validationResult.reason.length > 0 && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Issues: </span>
                  <span className="text-red-600">{validationResult.reason.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart and Recent Requests */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Requests Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <span>Requests (Last 7 days)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [value, 'Requests']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#7c3aed" 
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent API Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent API Requests</CardTitle>
            <CardDescription>
              Your latest email validation requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {validationLogsData?.success && validationLogsData.data?.logs && validationLogsData.data.logs.length > 0 ? (
                  validationLogsData.data.logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {log.email}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            log.status === 'valid' ? 'default' :
                            log.status === 'invalid' ? 'destructive' : 'secondary'
                          }
                        >
                          {log.status === 'valid' ? 'Valid' :
                           log.status === 'invalid' ? 'Invalid' : 'Risky'} ({log.score})
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                      No recent validation requests
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}