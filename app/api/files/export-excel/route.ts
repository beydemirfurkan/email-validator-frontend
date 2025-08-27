import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward request to backend
    const backendUrl = process.env.BACKEND_API_URL || 'https://web-production-05991.up.railway.app'
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Forward authorization headers
    const authorization = request.headers.get('authorization')
    const apiKey = request.headers.get('x-api-key') || request.headers.get('api-key')
    
    if (authorization) {
      headers.Authorization = authorization
    }
    if (apiKey) {
      headers['X-API-Key'] = apiKey
    }

    const response = await fetch(`${backendUrl}/api/files/export-excel`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    // Return as blob for Excel download
    if (response.ok) {
      const blob = await response.blob()
      return new NextResponse(blob, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="validation-results.xlsx"',
        },
      })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Export Excel API error:', error)
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
