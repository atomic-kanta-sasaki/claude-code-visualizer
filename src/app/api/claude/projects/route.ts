import { NextResponse } from 'next/server'
import { claudeFs } from '@/shared/api/claude-fs'

export async function GET() {
  try {
    const projects = await claudeFs.readProjects()
    
    return NextResponse.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch projects',
      data: []
    }, { status: 500 })
  }
}