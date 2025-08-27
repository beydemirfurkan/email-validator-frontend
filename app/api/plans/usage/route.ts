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

    const response = await fetch(`${backendUrl}/api/plans/usage`, {
      method: 'GET',
      headers,
    })

    const data = await response.json()

    // If the backend returns an error (like "Invalid plan ID"), return a default response
    if (!response.ok || (data.error && data.error.includes('plan'))) {
      return NextResponse.json({
        success: true,
        data: {
          usage: {
            planName: 'Free Plan',
            validationsUsed: 0,
            validationsLimit: 1000,
            utilizationPercentage: '0%',
            daysRemaining: 30
          }
        },
        timestamp: new Date().toISOString(),
      }, { status: 200 })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Get usage API error:', error)
    // Return default usage data on error
    return NextResponse.json(
      {
        success: true,
        data: {
          usage: {
            planName: 'Free Plan',
            validationsUsed: 0,
            validationsLimit: 1000,
            utilizationPercentage: '0%',
            daysRemaining: 30
          }
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    )
  }
}