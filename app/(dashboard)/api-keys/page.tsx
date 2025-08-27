'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  PlusIcon, 
  KeyIcon, 
  CopyIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  RefreshCwIcon,
  EyeIcon,
  EyeOffIcon,
  AlertTriangleIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function ApiKeysPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [rateLimit, setRateLimit] = useState('1000')
  const [expiryDays, setExpiryDays] = useState('90')
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set())
  const queryClient = useQueryClient()

  // Fetch API keys
  const { data: apiKeysData, isLoading } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: () => api.getApiKeys(),
  })

  // Create API key mutation
  const createKeyMutation = useMutation({
    mutationFn: (data: { keyName: string; rateLimit?: number; expiryDays?: number }) => 
      api.createApiKey(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('API key created successfully!')
        setIsCreateDialogOpen(false)
        setKeyName('')
        setRateLimit('1000')
        setExpiryDays('90')
        queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
      } else {
        toast.error(response.error || 'Failed to create API key')
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create API key')
    }
  })

  // Delete API key mutation
  const deleteKeyMutation = useMutation({
    mutationFn: (id: number) => api.deleteApiKey(id),
    onSuccess: () => {
      toast.success('API key deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete API key')
    }
  })

  const handleCreateKey = () => {
    if (!keyName.trim()) {
      toast.error('Please enter a key name')
      return
    }

    const rateLimitNum = parseInt(rateLimit)
    const expiryDaysNum = parseInt(expiryDays)

    if (isNaN(rateLimitNum) || rateLimitNum < 1) {
      toast.error('Rate limit must be a positive number')
      return
    }

    if (isNaN(expiryDaysNum) || expiryDaysNum < 1) {
      toast.error('Expiry days must be a positive number')
      return
    }

    createKeyMutation.mutate({
      keyName: keyName.trim(),
      rateLimit: rateLimitNum,
      expiryDays: expiryDaysNum
    })
  }

  const handleCopyKey = (keyName: string) => {
    // In a real app, you'd have the actual key stored securely
    const mockKey = `evapi_${keyName.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).slice(2)}`
    navigator.clipboard.writeText(mockKey)
    toast.success('API key copied to clipboard')
  }

  const toggleKeyVisibility = (keyId: number) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const maskKey = (keyName: string) => {
    return `evapi_${'*'.repeat(20)}...${keyName.slice(-4)}`
  }

  const showFullKey = (keyName: string) => {
    return `evapi_${keyName.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).slice(2)}`
  }

  const apiKeys = apiKeysData?.success ? apiKeysData.data?.apiKeys || [] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for accessing the Valid2Go validation service
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for your application
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production App, Development"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests/minute)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  min="1"
                  max="10000"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDays">Expiry (days)</Label>
                <Input
                  id="expiryDays"
                  type="number"
                  min="1"
                  max="365"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateKey}
                disabled={createKeyMutation.isPending}
              >
                {createKeyMutation.isPending ? 'Creating...' : 'Create Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <KeyIcon className="h-5 w-5" />
            <span>Your API Keys</span>
          </CardTitle>
          <CardDescription>
            Manage authentication keys for your applications
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <KeyIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API Keys</h3>
              <p className="text-gray-500 mb-4">
                Create your first API key to start using the validation service
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Your First Key
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">
                      {apiKey.keyName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {apiKey.keyName.toLowerCase().includes('prod') ? 'Production' : 'Development'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                          {visibleKeys.has(apiKey.id) ? showFullKey(apiKey.keyName) : maskKey(apiKey.keyName)}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyKey(apiKey.keyName)}
                        >
                          <CopyIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {apiKey.rateLimit}/min
                    </TableCell>
                    <TableCell>
                      {format(new Date(apiKey.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {apiKey.lastUsedAt ? (
                        format(new Date(apiKey.lastUsedAt), 'MMM d, yyyy')
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                        {apiKey.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <EditIcon className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCwIcon className="h-4 w-4 mr-2" />
                            Regenerate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deleteKeyMutation.mutate(apiKey.id)}
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Security Best Practices */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start space-x-3 p-4">
          <AlertTriangleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-900 mb-1">Security Best Practices</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              <li>• Never share your API keys publicly or commit them to version control</li>
              <li>• Rotate your keys regularly for enhanced security</li>
              <li>• Use different keys for different environments (development, production)</li>
              <li>• Monitor your API key usage and set appropriate rate limits</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}