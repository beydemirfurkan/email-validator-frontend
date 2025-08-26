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

  let url = `${backendUrl}/api/contact-lists`

  // Add query parameters for GET requests
  if (method === 'GET') {
    const searchParams = new URL(request.url).searchParams
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  // Add body for POST requests
  if (method === 'POST') {
    const body = await request.json()
    config.body = JSON.stringify(body)
  }

  const response = await fetch(url, config)
  const data = await response.json()

  return NextResponse.json(data, { status: response.status })
}

export async function GET(request: NextRequest) {
  try {
    return await forwardRequest(request, 'GET')
  } catch (error) {
    console.error('Get contact lists error:', error)
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

export async function POST(request: NextRequest) {
  try {
    return await forwardRequest(request, 'POST')
  } catch (error) {
    console.error('Create contact list error:', error)
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