'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageContent, ToolSummary } from '@/components/ui/message-content'
import { 
  User, 
  Bot, 
  Settings, 
  Wrench, 
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { Conversation } from '@/shared/types'

interface ConversationDetailProps {
  conversation: Conversation
  children: React.ReactNode
}

export function ConversationDetail({ conversation, children }: ConversationDetailProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedTools, setExpandedTools] = useState<Set<number>>(new Set())

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-5 w-5 text-blue-500" />
      case 'assistant':
        return <Bot className="h-5 w-5 text-green-500" />
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date))
  }

  const getContentText = (content: unknown): string => {
    if (typeof content === 'string') {
      return content
    } else if (content && typeof content === 'object') {
      return JSON.stringify(content, null, 2)
    } else {
      return String(content || 'No content')
    }
  }

  const toggleToolExpansion = (index: number) => {
    const newExpanded = new Set(expandedTools)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedTools(newExpanded)
  }

  // メッセージからタスク計画を抽出する関数
  const extractTaskPlan = (content: string): string[] => {
    const tasks: string[] = []
    
    // 番号付きリストのパターンを検索
    const numberedListPattern = /^\d+\.\s+(.+)$/gm
    let match
    while ((match = numberedListPattern.exec(content)) !== null) {
      tasks.push(match[1])
    }
    
    // ダッシュ付きリストのパターンを検索
    if (tasks.length === 0) {
      const dashListPattern = /^[-*]\s+(.+)$/gm
      while ((match = dashListPattern.exec(content)) !== null) {
        tasks.push(match[1])
      }
    }
    
    return tasks
  }

  const content = getContentText(conversation.message?.content || conversation.message)
  const taskPlan = conversation.type === 'assistant' ? extractTaskPlan(content) : []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            {getMessageIcon(conversation.type)}
            <div>
              <DialogTitle className="capitalize">
                {conversation.type} Message
              </DialogTitle>
              <DialogDescription>
                {formatTime(conversation.timestamp)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            {taskPlan.length > 0 && (
              <TabsTrigger value="tasks">Task Plan ({taskPlan.length})</TabsTrigger>
            )}
            {conversation.tools && conversation.tools.length > 0 && (
              <TabsTrigger value="tools">Tools ({conversation.tools.length})</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="content" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Message Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MessageContent 
                  content={conversation.message?.content[0].text|| conversation.message}
                  className="bg-muted/50 p-4 rounded-md"
                />
                
                {/* メタデータ */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Message ID:</span>
                    <br />
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {conversation.id}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium">Session ID:</span>
                    <br />
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">
                      {conversation.sessionId}
                    </code>
                  </div>
                  {conversation.parentUuid && (
                    <div className="col-span-2">
                      <span className="font-medium">Parent UUID:</span>
                      <br />
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {conversation.parentUuid}
                      </code>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {taskPlan.length > 0 && (
            <TabsContent value="tasks" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-green-500" />
                    <span>AI Task Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {taskPlan.map((task, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-md border-l-4 border-green-500"
                      >
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{task}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {conversation.tools && conversation.tools.length > 0 && (
            <TabsContent value="tools" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="h-4 w-4" />
                    <span>Tools Used</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversation.tools.map((tool, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ToolSummary tool={tool} />
                            <span className="text-xs text-muted-foreground">
                              {formatTime(tool.timestamp)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleToolExpansion(index)}
                          >
                            {expandedTools.has(index) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        
                        {expandedTools.has(index) && (
                          <div className="mt-3 space-y-2">
                            <div>
                              <span className="text-sm font-medium">Parameters:</span>
                              <div className="mt-1">
                                <MessageContent 
                                  content={tool.parameters}
                                  className="text-xs bg-muted p-2 rounded overflow-x-auto"
                                />
                              </div>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Result:</span>
                              <div className="mt-1">
                                <MessageContent 
                                  content={tool.result}
                                  className="text-xs bg-muted p-2 rounded overflow-x-auto"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
