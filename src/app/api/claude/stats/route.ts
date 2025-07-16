import { NextResponse } from 'next/server'
import { claudeFs } from '@/shared/api/claude-fs'

export async function GET() {
  try {
    const stats = await claudeFs.getProjectStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch stats',
      data: null
    }, { status: 500 })
  }
}