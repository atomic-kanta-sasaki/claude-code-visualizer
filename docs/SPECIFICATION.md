# Claude Dashboard - システム仕様書

## 1. 概要

Claude Dashboard は、Claude AI との対話履歴を管理・分析するためのWebアプリケーションです。プロジェクト単位でセッションを管理し、会話の履歴を可視化し、TODOタスクを追跡する機能を提供します。

### 1.1 主要機能
- **プロジェクト管理**: Claude プロジェクトの一覧表示・選択
- **セッション管理**: 会話セッションの履歴表示・選択
- **会話履歴**: 詳細な会話内容の表示・検索・フィルタリング
- **TODO管理**: セッションに関連するタスクの管理
- **統計情報**: 使用状況の分析・可視化

## 2. アーキテクチャ

### 2.1 技術スタック
- **Frontend**: Next.js 15.4.1 (App Router)
- **UI Framework**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **State Management**: Zustand 5.0.6
- **TypeScript**: 5.x
- **Build Tool**: Turbopack

### 2.2 プロジェクト構造 (Feature-Sliced Design)
```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # ダッシュボード関連ページ
│   │   ├── layout.tsx     # 共通レイアウト
│   │   ├── page.tsx       # メインダッシュボード
│   │   ├── projects/      # プロジェクト管理
│   │   ├── sessions/      # セッション管理
│   │   ├── conversations/ # 会話履歴
│   │   ├── todos/         # TODO管理
│   │   └── stats/         # 統計情報
│   └── api/               # API エンドポイント
├── components/            # 共通UIコンポーネント
├── entities/              # ビジネスエンティティ
├── features/              # 機能別コンポーネント
├── shared/                # 共通ライブラリ
└── widgets/               # 複合コンポーネント
```

### 2.3 データフロー
```
Claude File System → API → Store → UI Components
```

## 3. 機能仕様

### 3.1 プロジェクト管理機能

#### 3.1.1 プロジェクト一覧表示
- **エンドポイント**: `/api/claude/projects`
- **表示項目**:
  - プロジェクト名
  - 最終更新日時
  - セッション数
  - メッセージ数
  - ステータス (アクティブ/非アクティブ)

#### 3.1.2 プロジェクト選択
- プロジェクトカードクリックで選択
- 選択時に `/dashboard/sessions?project={projectId}` へ遷移
- セッション情報を自動読み込み

### 3.2 セッション管理機能

#### 3.2.1 セッション一覧表示
- 選択されたプロジェクトのセッション一覧を表示
- **表示項目**:
  - セッションID (下8桁)
  - 開始時刻・終了時刻
  - 継続時間
  - メッセージ数
  - TODOの進捗状況
  - ステータス (アクティブ/非アクティブ)

#### 3.2.2 セッション選択
- セッションカードクリックで選択
- 選択時に `/dashboard/conversations?session={sessionId}` へ遷移
- 会話履歴を自動読み込み

### 3.3 会話履歴機能

#### 3.3.1 会話一覧表示
- 選択されたセッションの会話履歴を表示
- **表示項目**:
  - メッセージタイプ (user/assistant/system)
  - 送信者アイコン
  - メッセージ内容 (Markdown対応)
  - 送信時刻
  - 使用ツール情報

#### 3.3.2 メッセージ内容表示
- **Markdown レンダリング**: 
  - ヘッダー、リスト、コードブロック、テーブル等
  - シンタックスハイライト対応
  - カスタムProseスタイル
- **コンテンツタイプ自動判別**:
  - テキスト
  - Markdown
  - JSON (整形表示)
- **ツール使用情報**:
  - 人間が読める形式での要約
  - 詳細情報の展開表示

#### 3.3.3 検索・フィルタリング
- **検索機能**: メッセージ内容の全文検索
- **フィルタリング**:
  - メッセージタイプ別 (All/User/Assistant)
  - 日付範囲
  - ツール使用有無

#### 3.3.4 会話詳細表示
- モーダルダイアログでの詳細表示
- **タブ構成**:
  - Content: メッセージ内容
  - Task Plan: AIが生成したタスク計画
  - Tools: 使用ツールの詳細情報

### 3.4 TODO管理機能

#### 3.4.1 TODO一覧表示
- セッションに関連するTODOタスクを表示
- **表示項目**:
  - タスク内容
  - ステータス (pending/in_progress/completed)
  - 優先度 (high/medium/low)
  - 作成日時

#### 3.4.2 TODO操作
- ステータス変更
- 優先度変更
- タスクの追加・編集・削除

### 3.5 統計情報機能

#### 3.5.1 システム統計
- **表示項目**:
  - 総プロジェクト数
  - 総セッション数
  - 総会話数
  - アクティブユーザー数
  - 前月比の変化率

#### 3.5.2 使用状況分析
- **機能別使用状況**: 各機能の使用頻度
- **日別アクティビティ**: 曜日別の使用パターン
- **パフォーマンス指標**: 稼働率、応答時間、成功率

## 4. データ構造

### 4.1 TypeScript型定義

#### 4.1.1 プロジェクト
```typescript
interface ClaudeProject {
  id: string
  name: string
  path: string
  description?: string
  createdAt: Date
  lastUpdate: Date
  sessions: ClaudeSession[]
  settings: ProjectSettings
}
```

#### 4.1.2 セッション
```typescript
interface ClaudeSession {
  id: string
  projectId: string
  startTime: Date
  lastUpdate: Date
  duration: number
  conversations: Conversation[]
  todos: TodoItem[]
}
```

#### 4.1.3 会話
```typescript
interface Conversation {
  id: string
  parentUuid?: string
  sessionId: string
  type: 'user' | 'assistant' | 'system'
  message: Message
  timestamp: Date
  tools?: ToolUsage[]
}

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: Array<{type: string, text: string}>
  toolCalls?: ToolCall[]
}
```

#### 4.1.4 TODO
```typescript
interface TodoItem {
  id: string
  sessionId: string
  content: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'high' | 'medium' | 'low'
  createdAt: Date
  completedAt?: Date
}
```

### 4.2 ファイルシステム構造
```
~/.claude/projects/
├── project-1/
│   ├── session-1.jsonl
│   ├── session-2.jsonl
│   └── claude_session_todos.json
├── project-2/
│   └── ...
└── stats.json
```

## 5. API仕様

### 5.1 プロジェクト API

#### GET /api/claude/projects
- **説明**: プロジェクト一覧を取得
- **レスポンス**:
```json
{
  "projects": [
    {
      "id": "project-1",
      "name": "NextJS App",
      "path": "/path/to/project",
      "sessions": [...],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastUpdate": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

#### GET /api/claude/stats
- **説明**: 統計情報を取得
- **レスポンス**:
```json
{
  "totalProjects": 5,
  "activeProjects": 3,
  "totalSessions": 25,
  "activeSessions": 5,
  "totalMessages": 500,
  "totalTodos": 50,
  "completedTodos": 30,
  "averageSessionDuration": 1800000,
  "activeUsers": 1
}
```

### 5.2 ヘルスチェック API

#### GET /api/health
- **説明**: システムの稼働状況を確認
- **レスポンス**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 86400,
  "version": "1.0.0"
}
```

## 6. UI/UX仕様

### 6.1 レスポンシブデザイン
- **デスクトップ**: 1024px以上 - フルレイアウト
- **タブレット**: 768px-1023px - 適応レイアウト
- **モバイル**: 767px以下 - モバイル最適化

### 6.2 テーマサポート
- **ライトモード**: デフォルト
- **ダークモード**: 自動検出対応

### 6.3 アクセシビリティ
- **キーボードナビゲーション**: 全機能対応
- **スクリーンリーダー**: ARIA属性対応
- **カラーコントラスト**: WCAG 2.1 AA準拠

## 7. パフォーマンス仕様

### 7.1 読み込み時間
- **初回読み込み**: 3秒以内
- **ページ遷移**: 1秒以内
- **検索結果**: 500ms以内

### 7.2 リソース使用量
- **メモリ使用量**: 100MB以内
- **ネットワーク**: 初回1MB以内、以降500KB以内
- **CPUリソース**: 平常時10%以内

## 8. セキュリティ仕様

### 8.1 データ保護
- **ローカルストレージ**: Claude設定ディレクトリ内
- **データ暗号化**: 機密情報の暗号化保存
- **アクセス制御**: ファイルシステムレベルでの保護

### 8.2 セキュリティヘッダー
- **CSP**: Content Security Policy設定
- **HSTS**: HTTP Strict Transport Security
- **XSS保護**: Cross-Site Scripting対策

## 9. 制約事項

### 9.1 技術的制約
- **ブラウザサポート**: Chrome 90+, Firefox 88+, Safari 14+
- **ファイルサイズ**: 単一セッション最大100MB
- **同時接続**: 単一ユーザーのみ

### 9.2 機能制約
- **オフライン**: 読み取り専用モード
- **多言語**: 日本語・英語のみ対応
- **エクスポート**: JSON形式のみ

## 10. 更新履歴

### v1.0.0 (2024-01-01)
- 初回リリース
- 基本機能実装
- Next.js 15対応
- Feature-Sliced Design採用
- Markdown表示機能
- URL ベースナビゲーション