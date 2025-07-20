import React from 'react'
import { MarkdownRenderer } from './markdown-renderer'
import { cn } from '@/shared/lib/utils'
import { Badge } from './badge'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Wrench, CheckCircle, FileEdit, Terminal, Search, Globe, FileText } from 'lucide-react'

interface MessageContentProps {
  content: unknown
  className?: string
  truncate?: boolean
  maxLength?: number
}

interface ToolUseContent {
  type: 'tool_use'
  id: string
  name: string
  input: Record<string, unknown>
}

interface ToolResultContent {
  type: 'tool_result'
  tool_use_id: string
  content: string
}

interface ContentItem {
  type: string
  text?: string
  tool_use_id?: string
  content?: string
  id?: string
  name?: string
  input?: Record<string, unknown>
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

  const getToolIcon = (toolName: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      'Edit': FileEdit,
      'Read': FileText,
      'Write': FileEdit,
      'Bash': Terminal,
      'Grep': Search,
      'WebFetch': Globe,
      'WebSearch': Globe,
    }
    const Icon = icons[toolName] || Wrench
    return <Icon className="h-4 w-4" />
  }

  const renderToolUse = (toolContent: ToolUseContent) => {
    const { name, input } = toolContent
    
    return (
      <Card className="border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2">
            {getToolIcon(name)}
            <span>Tool: {name}</span>
            <Badge variant="outline" className="text-xs">tool_use</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {name === 'Edit' && input.file_path && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">File:</div>
                <div className="text-sm font-mono bg-muted p-2 rounded">
                  {String(input.file_path)}
                </div>
              </div>
            )}
            
            {input.old_string && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Old:</div>
                <div className="text-sm font-mono bg-red-50 dark:bg-red-950 p-2 rounded border-l-2 border-red-300">
                  <pre className="whitespace-pre-wrap text-red-700 dark:text-red-300">
                    {truncate && String(input.old_string).length > maxLength 
                      ? String(input.old_string).substring(0, maxLength) + '...'
                      : String(input.old_string)
                    }
                  </pre>
                </div>
              </div>
            )}
            
            {input.new_string && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">New:</div>
                <div className="text-sm font-mono bg-green-50 dark:bg-green-950 p-2 rounded border-l-2 border-green-300">
                  <pre className="whitespace-pre-wrap text-green-700 dark:text-green-300">
                    {truncate && String(input.new_string).length > maxLength 
                      ? String(input.new_string).substring(0, maxLength) + '...'
                      : String(input.new_string)
                    }
                  </pre>
                </div>
              </div>
            )}
            
            {Object.keys(input).length > 0 && !input.old_string && !input.new_string && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Parameters:</div>
                <div className="text-sm font-mono bg-muted p-2 rounded">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(input, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderToolResult = (toolResult: ToolResultContent) => {
    const isCodeOutput = toolResult.content.includes('→') || toolResult.content.includes('cat -n')
    
    return (
      <Card className="border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Tool Result</span>
            <Badge variant="outline" className="text-xs">tool_result</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={cn(
            "text-sm font-mono p-3 rounded",
            isCodeOutput 
              ? "bg-gray-900 text-green-400 dark:bg-gray-800" 
              : "bg-muted"
          )}>
            <pre className="whitespace-pre-wrap">
              {truncate && toolResult.content.length > maxLength 
                ? toolResult.content.substring(0, maxLength) + '...'
                : toolResult.content
              }
            </pre>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Handle array content (tool_use, tool_result, etc.)
  if (Array.isArray(content)) {
    return (
      <div className={cn('space-y-3', className)}>
        {content.map((item: ContentItem, index: number) => {
          if (item.type === 'tool_use') {
            return (
              <div key={index}>
                {renderToolUse(item as ToolUseContent)}
              </div>
            )
          }
          
          if (item.type === 'tool_result') {
            return (
              <div key={index}>
                {renderToolResult(item as ToolResultContent)}
              </div>
            )
          }
          
          if (item.type === 'text' && item.text) {
            const isMarkdown = isMarkdownContent(item.text)
            const finalContent = truncate && item.text.length > maxLength
              ? item.text.substring(0, maxLength) + '...'
              : item.text

            if (isMarkdown) {
              return (
                <div key={index}>
                  <MarkdownRenderer content={finalContent} />
                </div>
              )
            }
            
            return (
              <div key={index} className="text-sm whitespace-pre-wrap">
                {finalContent}
              </div>
            )
          }
          
          // Fallback for unknown content types
          return (
            <div key={index} className="text-sm">
              <div className="bg-muted p-3 rounded border">
                <pre className="text-xs font-mono overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            </div>
          )
        })}
      </div>
    )
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