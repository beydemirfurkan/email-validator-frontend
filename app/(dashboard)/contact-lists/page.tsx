'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  UsersIcon, 
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  MailIcon,
  SearchIcon,
  DownloadIcon,
  UploadIcon,
  ListIcon
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'

// Mock data for contact lists
const mockContactLists = [
  {
    id: 1,
    name: 'Marketing Subscribers',
    description: 'Newsletter subscribers from our website',
    contactCount: 1250,
    validContactCount: 1180,
    lastUpdated: '2024-01-15T10:00:00Z',
    tags: ['newsletter', 'marketing'],
    isActive: true
  },
  {
    id: 2,
    name: 'VIP Customers',
    description: 'High-value customers and enterprise clients',
    contactCount: 85,
    validContactCount: 83,
    lastUpdated: '2024-01-12T14:30:00Z',
    tags: ['vip', 'enterprise'],
    isActive: true
  },
  {
    id: 3,
    name: 'Event Attendees',
    description: 'Contacts from recent webinar and conference',
    contactCount: 420,
    validContactCount: 380,
    lastUpdated: '2024-01-10T09:15:00Z',
    tags: ['events', 'webinar'],
    isActive: false
  }
]

export default function ContactListsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [listName, setListName] = useState('')
  const [listDescription, setListDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  // Mock queries
  const { data: contactListsData, isLoading } = useQuery({
    queryKey: ['contactLists'],
    queryFn: async () => ({
      success: true,
      data: { lists: mockContactLists }
    }),
  })

  const createListMutation = useMutation({
    mutationFn: async (_data: { name: string; description: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Contact list created successfully!')
      setIsCreateDialogOpen(false)
      setListName('')
      setListDescription('')
      queryClient.invalidateQueries({ queryKey: ['contactLists'] })
    },
    onError: () => {
      toast.error('Failed to create contact list')
    }
  })

  const deleteListMutation = useMutation({
    mutationFn: async (_id: number) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500))
      return { success: true }
    },
    onSuccess: () => {
      toast.success('Contact list deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['contactLists'] })
    },
    onError: () => {
      toast.error('Failed to delete contact list')
    }
  })

  const handleCreateList = () => {
    if (!listName.trim()) {
      toast.error('Please enter a list name')
      return
    }

    createListMutation.mutate({
      name: listName.trim(),
      description: listDescription.trim()
    })
  }

  const contactLists = contactListsData?.success ? contactListsData.data?.lists || [] : []
  const filteredLists = contactLists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contact Lists</h1>
          <p className="text-muted-foreground">
            Organize and manage your email contacts in custom lists
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Create List
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Contact List</DialogTitle>
              <DialogDescription>
                Create a new list to organize your contacts
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="listName">List Name</Label>
                <Input
                  id="listName"
                  placeholder="e.g., Marketing Subscribers"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="listDescription">Description (Optional)</Label>
                <Textarea
                  id="listDescription"
                  placeholder="Brief description of this contact list..."
                  value={listDescription}
                  onChange={(e) => setListDescription(e.target.value)}
                  className="h-20 resize-none"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateList}
                disabled={createListMutation.isPending}
              >
                {createListMutation.isPending ? 'Creating...' : 'Create List'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search contact lists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UploadIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Import Contacts</h3>
              <p className="text-sm text-muted-foreground">Upload CSV file</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MailIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Bulk Validate</h3>
              <p className="text-sm text-muted-foreground">Verify all contacts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="flex items-center space-x-4 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DownloadIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download as CSV</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Lists */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ListIcon className="h-5 w-5" />
            <span>Your Contact Lists</span>
          </CardTitle>
          <CardDescription>
            Manage and organize your email contact lists
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredLists.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching lists' : 'No contact lists'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first contact list to organize your email addresses'
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First List
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Contacts</TableHead>
                  <TableHead>Valid Rate</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLists.map((list) => (
                  <TableRow key={list.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <UsersIcon className="h-4 w-4 text-gray-400" />
                        <span>{list.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {list.description || 'No description'}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{list.contactCount.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          {Math.round((list.validContactCount / list.contactCount) * 100)}%
                        </span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-2 bg-green-500 rounded-full"
                            style={{ 
                              width: `${(list.validContactCount / list.contactCount) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(list.lastUpdated), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={list.isActive ? 'default' : 'secondary'}>
                        {list.isActive ? 'Active' : 'Inactive'}
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
                            Edit List
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MailIcon className="h-4 w-4 mr-2" />
                            Validate All
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => deleteListMutation.mutate(list.id)}
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
    </div>
  )
}
