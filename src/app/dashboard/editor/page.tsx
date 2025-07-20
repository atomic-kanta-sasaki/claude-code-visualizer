'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Eye, FileText, AlertCircle } from 'lucide-react'
import { toast } from '@/shared/lib/toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'

export default function EditorPage() {
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadClaudeFile()
  }, [])

  useEffect(() => {
    setHasChanges(content !== originalContent)
  }, [content, originalContent])

  const loadClaudeFile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/claude/file')
      if (response.ok) {
        const data = await response.json()
        setContent(data.content || '')
        setOriginalContent(data.content || '')
      } else {
        toast.error('CLAUDE.mdファイルの読み込みに失敗しました')
      }
    } catch (error) {
      console.error('Error loading CLAUDE.md:', error)
      toast.error('ファイルの読み込み中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const saveClaudeFile = async () => {
    try {
      setIsSaving(true)
      const response = await fetch('/api/claude/file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (response.ok) {
        setOriginalContent(content)
        toast.success('CLAUDE.mdファイルを保存しました')
      } else {
        toast.error('ファイルの保存に失敗しました')
      }
    } catch (error) {
      console.error('Error saving CLAUDE.md:', error)
      toast.error('保存中にエラーが発生しました')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">CLAUDE.mdファイルを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CLAUDE.md エディター</h1>
          <p className="text-muted-foreground">
            ~/.claude/CLAUDE.mdファイルを編集できます
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <div className="flex items-center text-amber-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              未保存の変更があります
            </div>
          )}
          <Button 
            onClick={saveClaudeFile} 
            disabled={isSaving || !hasChanges}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? '保存中...' : '保存'}</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>CLAUDE.md</span>
          </CardTitle>
          <CardDescription>
            Claudeの設定やプロンプトを管理するためのMarkdownファイルです
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="edit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">編集</TabsTrigger>
              <TabsTrigger value="preview">プレビュー</TabsTrigger>
            </TabsList>
            
            <TabsContent value="edit" className="mt-4">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="CLAUDE.mdの内容を入力してください..."
                className="min-h-[500px] font-mono text-sm"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-lg p-4 min-h-[500px] bg-card">
                {content ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>プレビューするコンテンツがありません</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}