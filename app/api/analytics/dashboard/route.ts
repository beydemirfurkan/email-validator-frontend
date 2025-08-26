import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Forward request to backend
    const backendUrl = process.env.BACKEND_API_URL || 'https://web-production-05991.up.railway.app'
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Forward authorization header
    const authorization = request.headers.get('authorization')
    if (authorization) {
      headers.Authorization = authorization
    }

    // Get query parameters
    const searchParams = new URL(request.url).searchParams
    const queryString = searchParams.toString()
    
    let url = `${backendUrl}/api/analytics/dashboard`
    if (queryString) {
      url += `?${queryString}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Dashboard analytics API error:', error)
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