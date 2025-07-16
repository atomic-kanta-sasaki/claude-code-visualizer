import { NextResponse } from 'next/server'

export async function GET() {
  const startTime = process.hrtime.bigint()
  
  try {
    const response = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      uptime: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      responseTime: Number(process.hrtime.bigint() - startTime) / 1000000,
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    const response = {
      status: 'unhealthy' as const,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }

    return NextResponse.json(response, { status: 503 })
  }
}