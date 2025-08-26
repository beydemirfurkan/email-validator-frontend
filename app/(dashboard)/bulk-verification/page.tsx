'use client'

import { useState, useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api, type ValidationResult } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  UploadIcon, 
  CheckIcon, 
  XIcon,
  AlertCircleIcon,
  DownloadIcon,
  ClockIcon,
  FileTextIcon,
  TrendingUpIcon
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function BulkVerificationPage() {
  const [emailInput, setEmailInput] = useState('')
  const [results, setResults] = useState<ValidationResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Bulk validation mutation
  const bulkValidationMutation = useMutation({
    mutationFn: (emails: string[]) => api.validateEmails(emails),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setResults(response.data.results)
        toast.success(`Validated ${response.data.results.length} emails successfully!`)
      } else {
        toast.error(response.error || 'Validation failed')
      }
      setIsProcessing(false)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Validation failed')
      setIsProcessing(false)
    }
  })

  // CSV upload mutation
  const csvUploadMutation = useMutation({
    mutationFn: (file: File) => api.uploadCsv(file, true),
    onSuccess: (response) => {
      if (response.success && response.data) {
        setResults(response.data.results)
        toast.success('CSV processed successfully!')
      }
      setIsProcessing(false)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'CSV processing failed')
      setIsProcessing(false)
    }
  })

  const handleBulkValidation = () => {
    if (!emailInput.trim()) {
      toast.error('Please enter email addresses to validate')
      return
    }

    const emails = emailInput
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => email && email.includes('@'))

    if (emails.length === 0) {
      toast.error('No valid email addresses found')
      return
    }

    if (emails.length > 1000) {
      toast.error('Maximum 1000 emails allowed per batch')
      return
    }

    setIsProcessing(true)
    bulkValidationMutation.mutate(emails)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB
      toast.error('File size must be less than 100MB')
      return
    }

    setIsProcessing(true)
    csvUploadMutation.mutate(file)
  }

  const exportResults = async () => {
    if (results.length === 0) {
      toast.error('No results to export')
      return
    }

    try {
      const blob = await api.exportCsv(results)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `email-validation-results-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Results exported successfully!')
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const clearResults = () => {
    setResults([])
    setEmailInput('')
  }

  // Calculate statistics
  const stats = {
    total: results.length,
    valid: results.filter(r => r.valid && r.score >= 80).length,
    invalid: results.filter(r => !r.valid || r.score < 50).length,
    risky: results.filter(r => r.valid && r.score >= 50 && r.score < 80).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Verification</h1>
        <p className="text-muted-foreground">
          Validate multiple email addresses at once using text input or CSV upload
        </p>
      </div>

      {/* Upgrade Banner */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <TrendingUpIcon className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-900">
                Upgrade to Pro for unlimited bulk verification
              </p>
              <p className="text-sm text-orange-700">
                Process up to 500K emails monthly with advanced features
              </p>
            </div>
          </div>
          <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
            Upgrade Now
          </Button>
        </CardContent>
      </Card>

      {/* Input Methods */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Text Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileTextIcon className="h-5 w-5" />
              <span>Text Input</span>
            </CardTitle>
            <CardDescription>
              Paste email addresses separated by commas, semicolons, or new lines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emails">Email Addresses</Label>
              <Textarea
                id="emails"
                placeholder="john@example.com&#10;jane@company.co&#10;test@domain.org"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-32 resize-none"
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 1,000 emails per batch
              </p>
            </div>
            
            <Button 
              onClick={handleBulkValidation}
              disabled={isProcessing || !emailInput.trim()}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Start Validation
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UploadIcon className="h-5 w-5" />
              <span>CSV Upload</span>
            </CardTitle>
            <CardDescription>
              Upload a CSV file with email addresses for bulk validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop your CSV file
              </p>
              <p className="text-xs text-gray-500">
                Maximum file size: 100MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isProcessing}
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full"
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Choose CSV File
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Validation Results</CardTitle>
                <CardDescription>
                  {stats.total} email addresses processed
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={exportResults}>
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.valid}</div>
                <div className="text-sm text-muted-foreground">Valid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.invalid}</div>
                <div className="text-sm text-muted-foreground">Invalid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.risky}</div>
                <div className="text-sm text-muted-foreground">Risky</div>
              </div>
            </div>

            <Separator />

            {/* Results Table */}
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">
                        {result.email}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            result.valid && result.score >= 80 ? 'default' :
                            !result.valid || result.score < 50 ? 'destructive' : 'secondary'
                          }
                        >
                          <span className="flex items-center">
                            {result.valid && result.score >= 80 ? (
                              <CheckIcon className="h-3 w-3 mr-1" />
                            ) : !result.valid || result.score < 50 ? (
                              <XIcon className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircleIcon className="h-3 w-3 mr-1" />
                            )}
                            {result.valid && result.score >= 80 ? 'Valid' :
                             !result.valid || result.score < 50 ? 'Invalid' : 'Risky'}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {result.score}/100
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {result.reason.length > 0 ? result.reason[0] : 'No issues found'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Verification History</CardTitle>
          <CardDescription>
            Your recent bulk validation jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <ClockIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No bulk verification history yet</p>
            <p className="text-sm">Start your first bulk validation above</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}