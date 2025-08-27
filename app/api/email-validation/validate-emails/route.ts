import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🚀 /api/email-validation/validate-emails endpoint called')
  try {
    const body = await request.json()
    const { emails } = body
    console.log('📧 Received emails:', emails?.length || 0, 'emails')
    
    // Debug auth headers
    const authorization = request.headers.get('authorization')
    const apiKey = request.headers.get('x-api-key') || request.headers.get('api-key')
    console.log('🔑 Authorization header:', authorization ? 'Present' : 'Missing')
    console.log('🗝️ API Key header:', apiKey ? 'Present' : 'Missing')

    if (!emails || !Array.isArray(emails)) {
      console.log('❌ Invalid emails array provided')
      return NextResponse.json(
        {
          success: false,
          error: 'Emails array is required',
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      )
    }

    // Forward request to backend
    const backendUrl = process.env.BACKEND_API_URL || 'https://web-production-05991.up.railway.app'
    console.log('🔗 Backend URL:', backendUrl)
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Authorization headers already defined above for debug
    
    if (authorization) {
      headers.Authorization = authorization
    }
    if (apiKey) {
      headers['X-API-Key'] = apiKey
    }

    console.log('🌐 Making request to backend:', `${backendUrl}/api/validate-emails`)
    
    const response = await fetch(`${backendUrl}/api/validate-emails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ emails }),
    })

    console.log('📡 Backend response status:', response.status)
    const data = await response.json()
    console.log('📄 Backend response data keys:', Object.keys(data))

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Validate emails API error:', error)
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