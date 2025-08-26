import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { results } = body

    if (!results) {
      return NextResponse.json(
        {
          success: false,
          error: 'Results are required',
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

    // Forward authorization header
    const authorization = request.headers.get('authorization')
    if (authorization) {
      headers.Authorization = authorization
    }

    const response = await fetch(`${backendUrl}/api/files/export-csv`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ results }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    // Return the blob response for file download
    const blob = await response.blob()
    
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="validation-results.csv"',
      },
    })
  } catch (error) {
    console.error('CSV export API error:', error)
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