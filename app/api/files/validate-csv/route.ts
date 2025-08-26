import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const immediate = formData.get('immediate') || 'true'

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'File is required',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    // Forward request to backend
    const backendUrl = process.env.BACKEND_API_URL || 'https://web-production-05991.up.railway.app'
    
    const headers: HeadersInit = {}

    // Forward authorization header
    const authorization = request.headers.get('authorization')
    if (authorization) {
      headers.Authorization = authorization
    }

    // Create new FormData for backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    backendFormData.append('immediate', immediate.toString())

    const response = await fetch(`${backendUrl}/api/files/validate-csv`, {
      method: 'POST',
      headers,
      body: backendFormData,
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('CSV validation API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}