# Claude Dashboard - API ドキュメント

## 概要

Claude Dashboard は、Claude AI との対話履歴を管理するためのREST APIを提供します。このAPIはNext.js App Routerを使用して実装されており、JSON形式でデータを送受信します。

## ベースURL

```
http://localhost:3000/api
```

## 認証

現在、APIは認証を必要としません。ローカル環境での使用を想定しています。

## エラーハンドリング

### エラーレスポンス形式

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": "詳細情報"
  }
}
```

### HTTP ステータスコード

| ステータスコード | 説明 |
| --- | --- |
| 200 | 成功 |
| 400 | 不正なリクエスト |
| 404 | リソースが見つからない |
| 500 | サーバーエラー |

## API エンドポイント

### 1. ヘルスチェック

#### GET /api/health

システムの稼働状況を確認します。

**リクエスト**
```http
GET /api/health
```

**レスポンス**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 86400,
  "version": "1.0.0",
  "environment": "development"
}
```

**レスポンスフィールド**
- `status` (string): システムの状態 ("healthy" | "unhealthy")
- `timestamp` (string): レスポンス生成時刻 (ISO 8601)
- `uptime` (number): 稼働時間 (秒)
- `version` (string): アプリケーションバージョン
- `environment` (string): 実行環境

---

### 2. プロジェクト管理

#### GET /api/claude/projects

Claude プロジェクトの一覧を取得します。

**リクエスト**
```http
GET /api/claude/projects
```

**クエリパラメータ**
- `limit` (number, optional): 取得件数の上限 (デフォルト: 100)
- `offset` (number, optional): 取得開始位置 (デフォルト: 0)
- `status` (string, optional): フィルタリング条件 ("active" | "inactive")

**レスポンス**
```json
{
  "projects": [
    {
      "id": "nextjs-fsd-project",
      "name": "NextJS FSD Project",
      "path": "/Users/user/projects/nextjs-fsd-project",
      "description": "Next.js project with Feature-Sliced Design",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastUpdate": "2024-01-02T12:00:00.000Z",
      "sessions": [
        {
          "id": "session-1",
          "startTime": "2024-01-01T09:00:00.000Z",
          "lastUpdate": "2024-01-01T10:30:00.000Z",
          "duration": 5400000,
          "messageCount": 25,
          "todoCount": 5
        }
      ],
      "settings": {
        "autoSave": true,
        "backupEnabled": true,
        "maxSessions": 100
      },
      "stats": {
        "totalSessions": 5,
        "totalMessages": 150,
        "totalTodos": 25,
        "averageSessionDuration": 3600000
      }
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 100,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**レスポンスフィールド**
- `projects` (array): プロジェクトの配列
  - `id` (string): プロジェクトID
  - `name` (string): プロジェクト名
  - `path` (string): プロジェクトパス
  - `description` (string, optional): プロジェクト説明
  - `createdAt` (string): 作成日時
  - `lastUpdate` (string): 最終更新日時
  - `sessions` (array): セッション情報の配列
  - `settings` (object): プロジェクト設定
  - `stats` (object): プロジェクト統計情報
- `pagination` (object): ページネーション情報

---

### 3. 統計情報

#### GET /api/claude/stats

システム全体の統計情報を取得します。

**リクエスト**
```http
GET /api/claude/stats
```

**クエリパラメータ**
- `period` (string, optional): 集計期間 ("day" | "week" | "month" | "year")
- `startDate` (string, optional): 開始日 (ISO 8601)
- `endDate` (string, optional): 終了日 (ISO 8601)

**レスポンス**
```json
{
  "overview": {
    "totalProjects": 5,
    "activeProjects": 3,
    "totalSessions": 25,
    "activeSessions": 5,
    "totalMessages": 500,
    "totalTodos": 50,
    "completedTodos": 30,
    "averageSessionDuration": 1800000,
    "activeUsers": 1
  },
  "trends": {
    "projectGrowth": {
      "current": 5,
      "previous": 4,
      "change": 25,
      "trend": "up"
    },
    "sessionActivity": {
      "current": 25,
      "previous": 20,
      "change": 25,
      "trend": "up"
    },
    "messageVolume": {
      "current": 500,
      "previous": 450,
      "change": 11.11,
      "trend": "up"
    }
  },
  "performance": {
    "uptime": 99.9,
    "averageResponseTime": 250,
    "errorRate": 0.1,
    "throughput": 1000
  },
  "usage": {
    "topFeatures": [
      {
        "name": "conversations",
        "usage": 65,
        "trend": "up"
      },
      {
        "name": "projects",
        "usage": 35,
        "trend": "stable"
      }
    ],
    "dailyActivity": [
      {
        "date": "2024-01-01",
        "sessions": 5,
        "messages": 50,
        "todos": 10
      }
    ]
  }
}
```

**レスポンスフィールド**
- `overview` (object): 全体統計
  - `totalProjects` (number): 総プロジェクト数
  - `activeProjects` (number): アクティブプロジェクト数
  - `totalSessions` (number): 総セッション数
  - `activeSessions` (number): アクティブセッション数
  - `totalMessages` (number): 総メッセージ数
  - `totalTodos` (number): 総TODO数
  - `completedTodos` (number): 完了TODO数
  - `averageSessionDuration` (number): 平均セッション時間（ミリ秒）
  - `activeUsers` (number): アクティブユーザー数
- `trends` (object): トレンド情報
- `performance` (object): パフォーマンス指標
- `usage` (object): 使用状況詳細

---

## データ型定義

### Project

```typescript
interface Project {
  id: string
  name: string
  path: string
  description?: string
  createdAt: string
  lastUpdate: string
  sessions: Session[]
  settings: ProjectSettings
  stats: ProjectStats
}
```

### Session

```typescript
interface Session {
  id: string
  projectId: string
  startTime: string
  lastUpdate: string
  duration: number
  messageCount: number
  todoCount: number
  conversations: Conversation[]
  todos: TodoItem[]
}
```

### Conversation

```typescript
interface Conversation {
  id: string
  parentUuid?: string
  sessionId: string
  type: 'user' | 'assistant' | 'system'
  message: Message
  timestamp: string
  tools?: ToolUsage[]
}
```

### Message

```typescript
interface Message {
  role: 'user' | 'assistant' | 'system'
  content: Array<{
    type: string
    text: string
  }>
  toolCalls?: ToolCall[]
}
```

### TodoItem

```typescript
interface TodoItem {
  id: string
  sessionId: string
  content: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  createdAt: string
  completedAt?: string
}
```

### ToolUsage

```typescript
interface ToolUsage {
  name: string
  parameters: Record<string, unknown>
  result: unknown
  timestamp: string
}
```

---

## 使用例

### JavaScript/TypeScript

```typescript
// プロジェクト一覧の取得
const fetchProjects = async () => {
  try {
    const response = await fetch('/api/claude/projects')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch projects')
    }
    
    return data.projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

// 統計情報の取得
const fetchStats = async () => {
  try {
    const response = await fetch('/api/claude/stats')
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch stats')
    }
    
    return data
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}

// ヘルスチェック
const checkHealth = async () => {
  try {
    const response = await fetch('/api/health')
    const data = await response.json()
    
    return data.status === 'healthy'
  } catch (error) {
    console.error('Health check failed:', error)
    return false
  }
}
```

### cURL

```bash
# プロジェクト一覧の取得
curl -X GET "http://localhost:3000/api/claude/projects" \
  -H "Content-Type: application/json"

# 統計情報の取得
curl -X GET "http://localhost:3000/api/claude/stats" \
  -H "Content-Type: application/json"

# ヘルスチェック
curl -X GET "http://localhost:3000/api/health" \
  -H "Content-Type: application/json"
```

---

## レート制限

現在、レート制限は設定されていませんが、以下の推奨事項があります：

- **一般的なリクエスト**: 1秒間に10リクエスト
- **重いリクエスト** (統計情報など): 1分間に30リクエスト
- **ヘルスチェック**: 制限なし

## キャッシュ

APIレスポンスは以下のキャッシュ戦略を使用します：

- **プロジェクト一覧**: 5分間キャッシュ
- **統計情報**: 1分間キャッシュ
- **ヘルスチェック**: キャッシュなし

## セキュリティ

### CORS設定

```javascript
// Next.js API Route での CORS 設定例
export async function GET(request) {
  const response = NextResponse.json(data)
  
  // CORS ヘッダーの設定
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}
```

### セキュリティヘッダー

```javascript
// セキュリティヘッダーの設定
response.headers.set('X-Content-Type-Options', 'nosniff')
response.headers.set('X-Frame-Options', 'DENY')
response.headers.set('X-XSS-Protection', '1; mode=block')
```

---

## トラブルシューティング

### 一般的なエラー

#### 404 Not Found
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Requested resource not found"
  }
}
```

**解決方法**:
- URLパスの確認
- エンドポイントの存在確認
- リクエストメソッドの確認

#### 500 Internal Server Error
```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An internal server error occurred"
  }
}
```

**解決方法**:
- サーバーログの確認
- ファイルシステムの権限確認
- 依存関係の確認

### デバッグ方法

```javascript
// デバッグ情報の取得
const debugInfo = {
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent,
  url: window.location.href,
  apiEndpoint: '/api/claude/projects'
}

console.log('Debug Info:', debugInfo)
```

---

## 更新履歴

### v1.0.0 (2024-01-01)
- 初回リリース
- 基本的なAPIエンドポイント実装
- プロジェクト管理API
- 統計情報API
- ヘルスチェックAPI

### 今後の予定
- 認証機能の追加
- WebSocket対応
- リアルタイム通知
- バッチAPI
- データエクスポート/インポート機能