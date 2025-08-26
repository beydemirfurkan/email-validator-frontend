import { NextRequest, NextResponse } from 'next/server'

async function forwardRequest(
  request: NextRequest,
  method: string = 'GET'
) {
  const backendUrl = process.env.BACKEND_API_URL || 'https://web-production-05991.up.railway.app'
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Forward authorization header
  const authorization = request.headers.get('authorization')
  if (authorization) {
    headers.Authorization = authorization
  }

  const config: RequestInit = {
    method,
    headers,
  }

  // Add body for PUT requests
  if (method === 'PUT') {
    const body = await request.json()
    config.body = JSON.stringify(body)
  }

  const response = await fetch(`${backendUrl}/api/auth/profile`, config)
  const data = await response.json()

  return NextResponse.json(data, { status: response.status })
}

export async function GET(request: NextRequest) {
  try {
    return await forwardRequest(request, 'GET')
  } catch (error) {
    console.error('Get profile API error:', error)
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

export async function PUT(request: NextRequest) {
  try {
    return await forwardRequest(request, 'PUT')
  } catch (error) {
    console.error('Update profile API error:', error)
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