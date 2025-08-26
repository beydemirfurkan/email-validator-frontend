import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  id: string
}

async function forwardRequest(
  request: NextRequest,
  params: RouteParams,
  method: string
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

  const response = await fetch(`${backendUrl}/api/keys/${params.id}`, config)
  const data = await response.json()

  return NextResponse.json(data, { status: response.status })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    return await forwardRequest(request, params, 'PUT')
  } catch (error) {
    console.error('Update API key error:', error)
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    return await forwardRequest(request, params, 'DELETE')
  } catch (error) {
    console.error('Delete API key error:', error)
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