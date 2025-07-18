# Claude Dashboard - デプロイメントガイド

## 目次
1. [概要](#1-概要)
2. [システム要件](#2-システム要件)
3. [ローカル開発環境](#3-ローカル開発環境)
4. [プロダクション環境](#4-プロダクション環境)
5. [Docker環境](#5-docker環境)
6. [CI/CD設定](#6-cicd設定)
7. [監視・ログ](#7-監視ログ)
8. [トラブルシューティング](#8-トラブルシューティング)

## 1. 概要

このガイドでは、Claude Dashboard を様々な環境にデプロイする方法を説明します。開発環境からプロダクション環境まで、段階的なデプロイメント手順を提供します。

## 2. システム要件

### 2.1 最小要件

- **Node.js**: 18.0.0 以上
- **npm**: 9.0.0 以上
- **メモリ**: 512MB 以上
- **ディスク**: 1GB 以上の空き容量
- **OS**: macOS, Linux, Windows 10/11

### 2.2 推奨要件

- **Node.js**: 20.0.0 以上
- **npm**: 10.0.0 以上
- **メモリ**: 2GB 以上
- **ディスク**: 5GB 以上の空き容量
- **CPU**: 2コア以上

### 2.3 対応ブラウザ

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 3. ローカル開発環境

### 3.1 環境構築

```bash
# リポジトリのクローン
git clone https://github.com/your-org/claude-dashboard.git
cd claude-dashboard

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local
```

### 3.2 環境変数の設定

`.env.local` ファイルを作成し、以下の変数を設定：

```env
# 開発環境設定
NODE_ENV=development
PORT=3000

# Claude設定
CLAUDE_PROJECTS_DIR=~/.claude/projects
CLAUDE_CONFIG_DIR=~/.claude

# アプリケーション設定
APP_NAME=Claude Dashboard
APP_VERSION=1.0.0

# デバッグ設定
DEBUG=true
LOG_LEVEL=info

# セキュリティ設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.3 開発サーバーの起動

```bash
# 開発サーバーの起動
npm run dev

# または、Turbopackを使用
npm run dev --turbo
```

ブラウザで `http://localhost:3000` にアクセスして動作確認

### 3.4 ビルドの確認

```bash
# プロダクションビルド
npm run build

# ビルドしたアプリケーションの起動
npm start
```

## 4. プロダクション環境

### 4.1 サーバー準備

#### 4.1.1 Ubuntu/Debian

```bash
# システムの更新
sudo apt update && sudo apt upgrade -y

# Node.jsの最新版をインストール
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 必要なパッケージのインストール
sudo apt-get install -y git nginx certbot python3-certbot-nginx

# PM2をグローバルにインストール
sudo npm install -g pm2
```

#### 4.1.2 CentOS/RHEL

```bash
# システムの更新
sudo yum update -y

# Node.jsの最新版をインストール
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 必要なパッケージのインストール
sudo yum install -y git nginx certbot python3-certbot-nginx

# PM2をグローバルにインストール
sudo npm install -g pm2
```

### 4.2 アプリケーションのデプロイ

```bash
# アプリケーションディレクトリの作成
sudo mkdir -p /var/www/claude-dashboard
sudo chown $USER:$USER /var/www/claude-dashboard

# リポジトリのクローン
cd /var/www/claude-dashboard
git clone https://github.com/your-org/claude-dashboard.git .

# 依存関係のインストール
npm ci --production

# 環境変数の設定
cp .env.example .env.production
```

### 4.3 環境変数の設定（プロダクション）

`.env.production` ファイルを編集：

```env
# プロダクション環境設定
NODE_ENV=production
PORT=3000

# Claude設定
CLAUDE_PROJECTS_DIR=/home/claude/.claude/projects
CLAUDE_CONFIG_DIR=/home/claude/.claude

# アプリケーション設定
APP_NAME=Claude Dashboard
APP_VERSION=1.0.0

# セキュリティ設定
NEXT_PUBLIC_APP_URL=https://your-domain.com

# データベース設定（将来的に使用予定）
# DATABASE_URL=postgresql://user:password@localhost:5432/claude_dashboard

# 監視設定
ENABLE_MONITORING=true
LOG_LEVEL=warn
```

### 4.4 ビルドとデプロイ

```bash
# プロダクションビルド
npm run build

# PM2設定ファイルの作成
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'claude-dashboard',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/claude-dashboard',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}
EOF

# ログディレクトリの作成
mkdir -p logs

# PM2でアプリケーションを起動
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4.5 リバースプロキシの設定（Nginx）

```nginx
# /etc/nginx/sites-available/claude-dashboard
server {
    listen 80;
    server_name your-domain.com;
    
    # SSL証明書設定（Let's Encrypt）
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    # HTTPSにリダイレクト
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL証明書設定
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL設定
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # セキュリティヘッダー
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 静的ファイルの配信
    location /_next/static/ {
        alias /var/www/claude-dashboard/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # アプリケーションへのプロキシ
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

サイトの有効化：

```bash
# サイトの有効化
sudo ln -s /etc/nginx/sites-available/claude-dashboard /etc/nginx/sites-enabled/

# Nginx設定のテスト
sudo nginx -t

# SSL証明書の取得
sudo certbot --nginx -d your-domain.com

# Nginxの再起動
sudo systemctl restart nginx
```

## 5. Docker環境

### 5.1 Dockerfileの作成

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# 依存関係のインストール
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ビルド
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# プロダクション用イメージ
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# 自動的に output を活用
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 5.2 docker-compose.yml

```yaml
version: '3.8'

services:
  claude-dashboard:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - CLAUDE_PROJECTS_DIR=/app/data/projects
      - CLAUDE_CONFIG_DIR=/app/data/config
    volumes:
      - claude_data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - claude-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs/nginx:/var/log/nginx
    depends_on:
      - claude-dashboard
    restart: unless-stopped
    networks:
      - claude-network

volumes:
  claude_data:
    driver: local

networks:
  claude-network:
    driver: bridge
```

### 5.3 Dockerでの起動

```bash
# イメージのビルド
docker-compose build

# コンテナの起動
docker-compose up -d

# ログの確認
docker-compose logs -f claude-dashboard

# 停止
docker-compose down
```

## 6. CI/CD設定

### 6.1 GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linter
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/claude-dashboard
          git pull origin main
          npm ci
          npm run build
          pm2 restart claude-dashboard
```

### 6.2 環境変数の設定

GitHub Secretsに以下の変数を設定：

- `HOST`: デプロイ先サーバーのIPアドレス
- `USERNAME`: SSH接続用のユーザー名
- `SSH_KEY`: SSH秘密鍵

## 7. 監視・ログ

### 7.1 PM2 Monitoring

```bash
# PM2 監視の有効化
pm2 install pm2-logrotate

# ログローテーション設定
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss

# リアルタイムログ
pm2 logs claude-dashboard

# アプリケーションの状態確認
pm2 status
pm2 monit
```

### 7.2 システム監視

```bash
# システムリソース監視スクリプト
#!/bin/bash
# /usr/local/bin/monitor-claude-dashboard.sh

APP_NAME="claude-dashboard"
LOG_FILE="/var/log/claude-dashboard-monitor.log"
ALERT_EMAIL="admin@your-domain.com"

# CPU使用率チェック
CPU_USAGE=$(pm2 show $APP_NAME | grep "cpu usage" | awk '{print $3}' | sed 's/%//')
if [ ${CPU_USAGE%.*} -gt 80 ]; then
    echo "$(date): High CPU usage: ${CPU_USAGE}%" >> $LOG_FILE
    echo "Claude Dashboard high CPU usage: ${CPU_USAGE}%" | mail -s "Alert: High CPU Usage" $ALERT_EMAIL
fi

# メモリ使用量チェック
MEMORY_USAGE=$(pm2 show $APP_NAME | grep "memory usage" | awk '{print $3}' | sed 's/MB//')
if [ ${MEMORY_USAGE%.*} -gt 512 ]; then
    echo "$(date): High memory usage: ${MEMORY_USAGE}MB" >> $LOG_FILE
    echo "Claude Dashboard high memory usage: ${MEMORY_USAGE}MB" | mail -s "Alert: High Memory Usage" $ALERT_EMAIL
fi

# ヘルスチェック
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
if [ $HTTP_STATUS -ne 200 ]; then
    echo "$(date): Health check failed: HTTP $HTTP_STATUS" >> $LOG_FILE
    echo "Claude Dashboard health check failed: HTTP $HTTP_STATUS" | mail -s "Alert: Health Check Failed" $ALERT_EMAIL
fi
```

### 7.3 ログ管理

```bash
# ログローテーション設定
# /etc/logrotate.d/claude-dashboard
/var/www/claude-dashboard/logs/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 8. トラブルシューティング

### 8.1 一般的な問題

#### 問題: アプリケーションが起動しない

**確認事項**:
```bash
# Node.jsバージョン確認
node --version

# 依存関係の確認
npm ls

# ポートの使用状況確認
netstat -tlnp | grep :3000

# PM2のステータス確認
pm2 status
pm2 logs claude-dashboard
```

#### 問題: ビルドエラー

**解決方法**:
```bash
# node_modulesの削除と再インストール
rm -rf node_modules package-lock.json
npm install

# キャッシュのクリア
npm cache clean --force

# 型チェック
npm run type-check
```

#### 問題: パフォーマンス低下

**診断方法**:
```bash
# システムリソース確認
top -p $(pgrep -f "claude-dashboard")
free -h
df -h

# アプリケーション固有の診断
pm2 monit
```

### 8.2 緊急時の対応

#### サービス停止時の対応

```bash
# アプリケーションの再起動
pm2 restart claude-dashboard

# 完全な再起動
pm2 delete claude-dashboard
pm2 start ecosystem.config.js

# Nginxの再起動
sudo systemctl restart nginx
```

#### データベース問題時の対応

```bash
# ファイルシステムのチェック
ls -la ~/.claude/projects/
du -sh ~/.claude/projects/*

# 権限の修正
sudo chown -R $USER:$USER ~/.claude/
chmod -R 755 ~/.claude/
```

### 8.3 バックアップ・復元

#### バックアップの作成

```bash
#!/bin/bash
# /usr/local/bin/backup-claude-dashboard.sh

BACKUP_DIR="/var/backups/claude-dashboard"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/claude-dashboard-$DATE.tar.gz"

# バックアップディレクトリの作成
mkdir -p $BACKUP_DIR

# データのバックアップ
tar -czf $BACKUP_FILE \
    -C /var/www/claude-dashboard \
    --exclude=node_modules \
    --exclude=.next \
    --exclude=logs \
    .

# 設定ファイルのバックアップ
tar -czf "$BACKUP_DIR/claude-config-$DATE.tar.gz" \
    -C /home/claude/.claude .

# 古いバックアップの削除（30日以上）
find $BACKUP_DIR -type f -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE"
```

#### 復元手順

```bash
# サービスの停止
pm2 stop claude-dashboard

# バックアップからの復元
cd /var/www/claude-dashboard
tar -xzf /var/backups/claude-dashboard/claude-dashboard-YYYYMMDD_HHMMSS.tar.gz

# 設定ファイルの復元
cd /home/claude/.claude
sudo tar -xzf /var/backups/claude-dashboard/claude-config-YYYYMMDD_HHMMSS.tar.gz

# 依存関係の再インストール
npm ci

# ビルド
npm run build

# サービスの再起動
pm2 start claude-dashboard
```

---

## 付録

### A. 環境変数一覧

| 変数名 | 説明 | デフォルト値 | 必須 |
|--------|------|-------------|------|
| NODE_ENV | 実行環境 | development | ✓ |
| PORT | ポート番号 | 3000 | ✓ |
| CLAUDE_PROJECTS_DIR | Claudeプロジェクトディレクトリ | ~/.claude/projects | ✓ |
| CLAUDE_CONFIG_DIR | Claude設定ディレクトリ | ~/.claude | ✓ |
| APP_NAME | アプリケーション名 | Claude Dashboard | |
| DEBUG | デバッグモード | false | |
| LOG_LEVEL | ログレベル | info | |

### B. ポート一覧

| サービス | ポート | 説明 |
|----------|--------|------|
| Next.js | 3000 | アプリケーションサーバー |
| Nginx | 80 | HTTP |
| Nginx | 443 | HTTPS |

### C. ディレクトリ構成

```
/var/www/claude-dashboard/
├── .next/                 # Next.js ビルド成果物
├── docs/                  # ドキュメント
├── logs/                  # ログファイル
├── public/                # 静的ファイル
├── src/                   # ソースコード
├── .env.production        # 環境変数
├── ecosystem.config.js    # PM2設定
├── next.config.js         # Next.js設定
└── package.json           # パッケージ設定
```

このデプロイメントガイドにより、Claude Dashboard を安全かつ効率的に様々な環境にデプロイできます。