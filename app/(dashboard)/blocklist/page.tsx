'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
  ShieldIcon, 
  MoreVerticalIcon,
  TrashIcon,
  AlertTriangleIcon,
  SearchIcon,
  FilterIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

// Mock data for blocklist
const mockBlocklistItems = [
  {
    id: 1,
    domain: 'spam-domain.com',
    type: 'Domain',
    reason: 'High spam rate',
    addedAt: '2024-01-10T10:00:00Z',
    addedBy: 'System',
    isActive: true
  },
  {
    id: 2,
    domain: '10minutemail.com',
    type: 'Domain',
    reason: 'Disposable email provider',
    addedAt: '2024-01-08T15:30:00Z',
    addedBy: 'Admin',
    isActive: true
  },
  {
    id: 3,
    domain: 'baduser@example.com',
    type: 'Email',
    reason: 'Manual block',
    addedAt: '2024-01-05T09:15:00Z',
    addedBy: 'User',
    isActive: false
  }
]

export default function BlocklistPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [itemType, setItemType] = useState<'domain' | 'email'>('domain')
  const [reason, setReason] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  // Mock queries (in real app, these would be actual API calls)
  const { data: blocklistData, isLoading } = useQuery({
    queryKey: ['blocklist'],
    queryFn: async () => ({
      success: true,
      data: { items: mockBlocklistItems }
    }),
  })

  const addToBlocklistMutation = useMutation({
    mutationFn: async (_data: { item: string; type: string; reason: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Item added to blocklist successfully!')
      setIsAddDialogOpen(false)
      setNewItem('')
      setReason('')
      queryClient.invalidateQueries({ queryKey: ['blocklist'] })
    },
    onError: () => {
      toast.error('Failed to add item to blocklist')
    }
  })

  const removeFromBlocklistMutation = useMutation({
    mutationFn: async (_id: number) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Item removed from blocklist')
      queryClient.invalidateQueries({ queryKey: ['blocklist'] })
    },
    onError: () => {
      toast.error('Failed to remove item from blocklist')
    }
  })

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast.error('Please enter a domain or email address')
      return
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason')
      return
    }

    addToBlocklistMutation.mutate({
      item: newItem.trim(),
      type: itemType,
      reason: reason.trim()
    })
  }

  const blocklistItems = blocklistData?.success ? blocklistData.data?.items || [] : []
  const filteredItems = blocklistItems.filter(item =>
    item.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.reason.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blocklist</h1>
          <p className="text-muted-foreground">
            Manage blocked domains and email addresses
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add to Blocklist
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to Blocklist</DialogTitle>
              <DialogDescription>
                Block a domain or specific email address
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="itemType">Type</Label>
                <select
                  id="itemType"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as 'domain' | 'email')}
                >
                  <option value="domain">Domain</option>
                  <option value="email">Email Address</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newItem">
                  {itemType === 'domain' ? 'Domain' : 'Email Address'}
                </Label>
                <Input
                  id="newItem"
                  placeholder={itemType === 'domain' ? 'e.g., spam-domain.com' : 'e.g., user@spam-domain.com'}
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  placeholder="e.g., High spam rate, Manual block"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddItem}
                disabled={addToBlocklistMutation.isPending}
              >
                {addToBlocklistMutation.isPending ? 'Adding...' : 'Add to Blocklist'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search domains or reasons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Blocklist Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ShieldIcon className="h-5 w-5" />
            <span>Blocked Items</span>
          </CardTitle>
          <CardDescription>
            Domains and email addresses currently blocked from validation
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
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <ShieldIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching items' : 'No blocked items'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Add domains or email addresses to prevent them from being validated'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Added By</TableHead>
                  <TableHead>Added Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium font-mono">
                      {item.domain}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.reason}
                    </TableCell>
                    <TableCell className="text-sm">
                      {item.addedBy}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(item.addedAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? 'destructive' : 'secondary'}>
                        {item.isActive ? 'Blocked' : 'Inactive'}
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
                            {item.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => removeFromBlocklistMutation.mutate(item.id)}
                          >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Remove
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

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start space-x-3 p-4">
          <AlertTriangleIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">About Blocklist</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Blocked domains and emails will always return as invalid during validation</li>
              <li>• Domain blocks apply to all email addresses from that domain</li>
              <li>• Use this feature to block known spam sources or disposable email providers</li>
              <li>• Blocklist changes take effect immediately</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
