'use client'

import { useEffect } from 'react'
import { useConversationStore } from '@/entities/conversation'
import { useSessionStore } from '@/entities/session'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User, Bot, Settings, MessageSquare, Search, Filter } from 'lucide-react'

export function ConversationTimeline() {
  const { 
    filteredConversations, 
    selectedConversation, 
    selectConversation, 
    searchConversations,
    applyFilters,
    filters
  } = useConversationStore()
  
  const { selectedSession } = useSessionStore()

  useEffect(() => {
    if (selectedSession) {
      applyFilters({ sessionId: selectedSession.id })
    }
  }, [selectedSession, applyFilters])

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-blue-500" />
      case 'assistant':
        return <Bot className="h-4 w-4 text-green-500" />
      case 'system':
        return <Settings className="h-4 w-4 text-gray-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'user':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950'
      case 'assistant':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950'
      case 'system':
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950'
      default:
        return 'border-l-muted-foreground bg-muted'
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date))
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + '...'
  }

  if (!selectedSession) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a session to view conversations</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          Conversations
        </h2>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 w-64"
              onChange={(e) => {
              const searchTerm = e.target.value
              applyFilters({ sessionId: selectedSession?.id, searchTerm })
            }}
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFilters({ sessionId: selectedSession?.id, type: undefined })}
          >
            <Filter className="h-4 w-4 mr-2" />
            All
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFilters({ sessionId: selectedSession?.id, type: 'user' })}
          >
            <User className="h-4 w-4 mr-2" />
            User
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyFilters({ sessionId: selectedSession?.id, type: 'assistant' })}
          >
            <Bot className="h-4 w-4 mr-2" />
            Assistant
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No conversations found</p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <Card 
              key={conversation.id}
              className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                getMessageColor(conversation.type)
              } ${
                selectedConversation?.id === conversation.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => selectConversation(conversation)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getMessageIcon(conversation.type)}
                    <CardTitle className="text-base capitalize">
                      {conversation.type}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {formatTime(conversation.timestamp)}
                    </Badge>
                    {conversation.tools && conversation.tools.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {conversation.tools.length} tools
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="text-sm">
                  <pre className="whitespace-pre-wrap font-sans text-muted-foreground">
                    {truncateContent(conversation.message.content)}
                  </pre>
                  
                  {conversation.tools && conversation.tools.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex flex-wrap gap-2">
                        {conversation.tools.map((tool, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tool.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}