# Claude Dashboard - ドキュメント

## 概要

このディレクトリには、Claude Dashboard プロジェクトの包括的なドキュメントが含まれています。

## ドキュメント一覧

### 📋 [システム仕様書](./SPECIFICATION.md)
- アーキテクチャ設計
- 機能仕様
- データ構造
- 技術仕様
- 制約事項

### 👥 [ユーザーガイド](./USER_GUIDE.md)
- 基本的な使い方
- 機能別詳細ガイド
- よくある質問
- トラブルシューティング
- ショートカットキー

### 🔌 [API ドキュメント](./API_DOCUMENTATION.md)
- エンドポイント一覧
- リクエスト/レスポンス仕様
- データ型定義
- 使用例
- セキュリティ情報

### 🚀 [デプロイメントガイド](./DEPLOYMENT_GUIDE.md)
- 環境構築手順
- 本番デプロイ方法
- Docker環境構築
- CI/CD設定
- 監視・ログ設定

## クイックスタート

### 1. 開発環境セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 2. 基本的な使い方

1. **プロジェクト選択**: `/dashboard/projects` でプロジェクトを選択
2. **セッション確認**: 選択したプロジェクトのセッション一覧を確認
3. **会話履歴**: セッション内の会話履歴を表示・検索
4. **TODO管理**: 関連するタスクを管理

### 3. 主要機能

- **📁 プロジェクト管理**: Claude プロジェクトの一覧・選択
- **⏰ セッション管理**: 会話セッションの履歴管理
- **💬 会話履歴**: Markdown対応の会話表示・検索
- **✅ TODO管理**: タスクの管理・進捗追跡
- **📊 統計情報**: 使用状況の分析・可視化

## 技術スタック

- **Frontend**: Next.js 15.4.1 (App Router)
- **UI**: React 19.1.0 + Tailwind CSS 4.0
- **State Management**: Zustand 5.0.6
- **Build Tool**: Turbopack
- **Architecture**: Feature-Sliced Design

## ディレクトリ構成

```
docs/
├── README.md              # このファイル
├── SPECIFICATION.md       # システム仕様書
├── USER_GUIDE.md         # ユーザーガイド
├── API_DOCUMENTATION.md  # API ドキュメント
└── DEPLOYMENT_GUIDE.md   # デプロイメントガイド
```

## 貢献方法

1. **Issues**: バグ報告や機能要望は GitHub Issues で
2. **Pull Requests**: コードの改善提案は PR で
3. **ドキュメント**: ドキュメントの改善も歓迎

## ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## サポート

- **GitHub Issues**: バグ報告・機能要望
- **GitHub Discussions**: 質問・議論
- **Email**: support@example.com

---

詳細な情報については、各ドキュメントを参照してください。