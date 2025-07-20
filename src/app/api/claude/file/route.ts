import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const CLAUDE_FILE_PATH = join(homedir(), '.claude', 'CLAUDE.md')

export async function GET() {
  try {
    // Check if file exists
    try {
      await fs.access(CLAUDE_FILE_PATH)
    } catch {
      // File doesn't exist, return empty content
      return NextResponse.json({ 
        content: '',
        exists: false,
        path: CLAUDE_FILE_PATH
      })
    }

    // Read file content
    const content = await fs.readFile(CLAUDE_FILE_PATH, 'utf-8')
    
    return NextResponse.json({ 
      content,
      exists: true,
      path: CLAUDE_FILE_PATH
    })
  } catch (error) {
    console.error('Error reading CLAUDE.md:', error)
    return NextResponse.json(
      { error: 'Failed to read CLAUDE.md file' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json()

    if (typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content must be a string' },
        { status: 400 }
      )
    }

    // Ensure .claude directory exists
    const claudeDir = join(homedir(), '.claude')
    try {
      await fs.access(claudeDir)
    } catch {
      await fs.mkdir(claudeDir, { recursive: true })
    }

    // Write file content
    await fs.writeFile(CLAUDE_FILE_PATH, content, 'utf-8')
    
    return NextResponse.json({ 
      success: true,
      path: CLAUDE_FILE_PATH,
      message: 'CLAUDE.md file saved successfully'
    })
  } catch (error) {
    console.error('Error writing CLAUDE.md:', error)
    return NextResponse.json(
      { error: 'Failed to save CLAUDE.md file' },
      { status: 500 }
    )
  }
}