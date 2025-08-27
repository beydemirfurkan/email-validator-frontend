'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/lib/auth'
import { api } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  UserIcon,
  KeyIcon,
  ShieldIcon,
  MonitorIcon,
  LogOutIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  CheckIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { name: string }) => api.updateProfile(data),
    onSuccess: (response) => {
      if (response.success && response.data?.user) {
        updateUser(response.data.user)
        toast.success('Profile updated successfully!')
        setIsEditingProfile(false)
      } else {
        toast.error(response.error || 'Failed to update profile')
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    }
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => 
      api.changePassword(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        toast.error(response.error || 'Failed to change password')
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to change password')
    }
  })

  const handleUpdateProfile = () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }

    updateProfileMutation.mutate({ name: name.trim() })
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      return
    }

    changePasswordMutation.mutate({ currentPassword, newPassword })
  }

  const handleLogoutAllSessions = () => {
    // In a real app, this would call an API to invalidate all sessions
    logout()
    toast.success('Logged out from all devices')
  }

  const mockSessions = [
    {
      id: 1,
      device: 'Chrome on macOS',
      location: 'Istanbul, Turkey',
      lastActive: new Date(),
      current: true
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Istanbul, Turkey',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      current: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and email address
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditingProfile ? (
                      <Input
                        id="firstName"
                        value={name.split(' ')[0] || ''}
                        onChange={(e) => {
                          const lastName = name.split(' ').slice(1).join(' ')
                          setName(`${e.target.value} ${lastName}`.trim())
                        }}
                        placeholder="First name"
                      />
                    ) : (
                      <Input
                        value={name.split(' ')[0] || ''}
                        disabled
                        className="bg-gray-50"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditingProfile ? (
                      <Input
                        id="lastName"
                        value={name.split(' ').slice(1).join(' ')}
                        onChange={(e) => {
                          const firstName = name.split(' ')[0] || ''
                          setName(`${firstName} ${e.target.value}`.trim())
                        }}
                        placeholder="Last name"
                      />
                    ) : (
                      <Input
                        value={name.split(' ').slice(1).join(' ')}
                        disabled
                        className="bg-gray-50"
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-gray-50"
                    />
                    <Badge variant="secondary" className="text-green-700 bg-green-100">
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email address cannot be changed. Contact support if you need to update it.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {isEditingProfile ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditingProfile(false)
                        setName(user?.name || '')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUpdateProfile}
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditingProfile(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <KeyIcon className="h-5 w-5" />
                <span>Change Password</span>
              </CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {newPassword && newPassword.length < 8 && (
                  <p className="text-xs text-red-600">
                    Password must be at least 8 characters long
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="w-4 h-4" />
                    ) : (
                      <EyeIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs text-red-600">
                    Passwords do not match
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleChangePassword}
                  disabled={
                    changePasswordMutation.isPending || 
                    !currentPassword || 
                    !newPassword || 
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    newPassword.length < 8
                  }
                >
                  {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Browser Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MonitorIcon className="h-5 w-5" />
                <span>Browser Sessions</span>
              </CardTitle>
              <CardDescription>
                Manage your active sessions across devices
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {mockSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <MonitorIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium flex items-center space-x-2">
                        <span>{session.device}</span>
                        {session.current && (
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.location} • Last active {format(session.lastActive, 'MMM d, h:mm a')}
                      </div>
                    </div>
                  </div>
                  
                  {!session.current && (
                    <Button variant="outline" size="sm">
                      <LogOutIcon className="h-4 w-4 mr-2" />
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  This will log you out of all browser sessions except this one.
                </p>
                <Button variant="outline" onClick={handleLogoutAllSessions}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Log out other sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShieldIcon className="h-5 w-5" />
                <span>Account Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Type</span>
                <Badge>Free</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Verified</span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  <CheckIcon className="h-3 w-3 mr-1" />
                  Yes
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Auth</span>
                <Badge variant="outline">Not Enabled</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-start space-x-3 p-4">
              <AlertCircleIcon className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-900 mb-1">Security Tip</h3>
                <p className="text-sm text-amber-800">
                  Enable two-factor authentication and use a strong, unique password to keep your account secure.
                </p>
                <Button variant="outline" size="sm" className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}