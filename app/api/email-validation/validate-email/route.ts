import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    // Forward request to backend
    const backendUrl = process.env.BACKEND_API_URL || 'https://web-production-05991.up.railway.app'
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Forward authorization headers (JWT or API Key)
    const authorization = request.headers.get('authorization')
    const apiKey = request.headers.get('x-api-key') || request.headers.get('api-key')
    
    if (authorization) {
      headers.Authorization = authorization
    }
    if (apiKey) {
      headers['X-API-Key'] = apiKey
    }

    const response = await fetch(`${backendUrl}/api/email-validation/validate-email`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Validate email API error:', error)
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