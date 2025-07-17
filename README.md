# Claude Context Manager

Claude CLIの使用履歴とコンテキストをGUIで管理するWebアプリケーションです。

## 🎯 概要

Claude Context Managerは、Claude CLIの`~/.claude`ディレクトリに保存されているデータを読み取り、プロジェクト、セッション、会話履歴、TODOをビジュアルに表示・管理するツールです。

## 🚀 主要機能

### 1. プロジェクト管理
- Claude CLIプロジェクトの一覧表示
- プロジェクトの活動状況（Active/Inactive）
- メッセージ数、セッション数の統計表示

### 2. セッション追跡
- プロジェクト内のセッション履歴
- セッションの開始・終了時刻
- TODO進捗状況の表示

### 3. 会話タイムライン
- ユーザー、アシスタント、システムメッセージの表示
- 会話の検索・フィルタリング
- ツール使用履歴の表示

### 4. TODO管理
- かんばん形式のTODO表示
- ステータス別分類（Pending/In Progress/Completed）
- 優先度別表示

### 5. 統計ダッシュボード
- 全体の利用統計
- プロジェクト・セッション・メッセージ数
- TODO完了率

## 🏗️ 技術スタック

### フロントエンド
- **Next.js 15** - React フレームワーク
- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **Tailwind CSS** - スタイリング
- **ShadcnUI** - UIコンポーネント
- **Zustand** - 状態管理

### バックエンド
- **Next.js API Routes** - サーバーサイドAPI
- **Node.js fs** - ファイルシステムアクセス

### アーキテクチャ
- **Feature Slice Design** - 機能ベースの設計
- **Clean Architecture** - レイヤー分離
- **OpenAPI** - スキーマ駆動開発

## 📦 インストール

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# 本番ビルド
npm run build
```

## 🔧 開発環境セットアップ

### 必要条件
- Node.js 18以上
- Claude CLIがインストールされている
- `~/.claude`ディレクトリにプロジェクトデータが存在する

### 開発サーバー起動
```bash
npm run dev
```

アプリケーションは`http://localhost:3001`でアクセス可能です。

## 📊 データ構造

### Claude CLIデータ構造
```
~/.claude/
├── projects/                    # プロジェクト管理
│   ├── -Users-username-project/
│   │   └── session-uuid.jsonl  # セッション履歴
├── todos/                       # TODO管理
│   └── session-uuid.json       # TODOデータ
├── statsig/                     # 統計データ
│   ├── statsig.session_id.*
│   └── statsig.stable_id.*
└── shell-snapshots/            # シェル環境
    └── snapshot-*.sh
```

### アプリケーション内データ型
```typescript
interface ClaudeProject {
  id: string
  path: string
  name: string
  sessions: ClaudeSession[]
  lastActivity: Date
  totalMessages: number
  totalSessions: number
}

interface ClaudeSession {
  id: string
  conversations: Conversation[]
  todos: TodoItem[]
  startTime: Date
  lastUpdate: Date
  messageCount: number
  duration: number
}
```
