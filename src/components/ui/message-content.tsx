import React from 'react'
import { MarkdownRenderer } from './markdown-renderer'
import { cn } from '@/shared/lib/utils'

interface MessageContentProps {
  content: unknown
  className?: string
  truncate?: boolean
  maxLength?: number
}

export function MessageContent({ 
  content, 
  className, 
  truncate = false, 
  maxLength = 200 
}: MessageContentProps) {
  
  const getStringContent = (content: unknown): string => {
    if (!content) {
      return 'No content available'
    }

    if (typeof content === 'string') {
      return content
    }

    if (typeof content === 'object') {
      return JSON.stringify(content, null, 2)
    }

    return String(content)
  }

  const isMarkdownContent = (text: string): boolean => {
    // 長いテキストでマークダウンパターンが含まれている場合はマークダウンとして扱う
    const markdownPatterns = [
      /^#{1,6}\s/m,              // Headers
      /\*\*[\s\S]*?\*\*/,        // Bold (multiline)
      /`[\s\S]*?`/,              // Inline code
      /```[\s\S]*?```/,          // Code blocks
      /^\s*[-*+]\s/m,            // Unordered lists
      /^\s*\d+\.\s/m,            // Numbered lists
      /\[[\s\S]*?\]\([\s\S]*?\)/, // Links
      /^\s*>/m,                  // Blockquotes
      /\n\s*\n/,                 // Multiple line breaks (common in markdown)
      /^##\s/m,                  // Specific check for ## headers
      /^###\s/m,                 // Specific check for ### headers
    ]
    
    // テキストが長く、複数のマークダウンパターンを含む場合はマークダウンとして扱う
    const matchCount = markdownPatterns.filter(pattern => pattern.test(text)).length
    const hasHeaderAndContent = /^#{1,6}\s.*\n\n/m.test(text)
    const hasCodeBlocks = /```[\s\S]*?```/.test(text)
    const hasMultipleStructures = matchCount >= 2
    
    return hasHeaderAndContent || hasCodeBlocks || hasMultipleStructures
  }

  const stringContent = getStringContent(content)
  const finalContent = truncate && stringContent.length > maxLength
    ? stringContent.substring(0, maxLength) + '...'
    : stringContent

  const isMarkdown = isMarkdownContent(finalContent)
  const isJson = typeof content === 'object' && content !== null

  if (isJson) {
    return (
      <div className={cn('text-sm', className)}>
        <div className="bg-muted p-3 rounded border">
          <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap text-muted-foreground">
            {finalContent}
          </pre>
        </div>
      </div>
    )
  }

  if (isMarkdown) {
    return (
      <div className={cn('text-sm', className)}>
        <MarkdownRenderer content={finalContent} />
      </div>
    )
  }

  return (
    <div className={cn('text-sm whitespace-pre-wrap', className)}>
      {finalContent}
    </div>
  )
}

export function ToolSummary({ tool }: { tool: { name: string; parameters: Record<string, unknown> } }) {
  const getToolDescription = (toolName: string, parameters: Record<string, unknown>) => {
    const descriptions: Record<string, (params: Record<string, unknown>) => string> = {
      'Read': (params) => `Read file: ${params.file_path}`,
      'Edit': (params) => `Edit file: ${params.file_path}`,
      'Write': (params) => `Write file: ${params.file_path}`,
      'Bash': (params) => `Run command: ${params.command}`,
      'Grep': (params) => `Search for: "${params.pattern}"`,
      'Glob': (params) => `Find files: ${params.pattern}`,
      'LS': (params) => `List directory: ${params.path}`,
      'Task': (params) => `Task: ${params.description}`,
      'WebFetch': (params) => `Fetch URL: ${params.url}`,
      'WebSearch': (params) => `Search web: ${params.query}`,
    }

    const descFn = descriptions[toolName]
    return descFn ? descFn(parameters) : `Used tool: ${toolName}`
  }

  return (
    <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
      🔧 {getToolDescription(tool.name, tool.parameters)}
    </div>
  )
}