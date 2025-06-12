# 開発者向けガイド

Sound Effects MCPサーバーの開発に参加いただき、ありがとうございます。

## 開発環境のセットアップ

```bash
# プロジェクトをクローン
git clone <repository-url>
cd sound-effects-mcp

# 依存関係をインストール
npm install

# ビルド
npm run build
```

## 開発コマンド

```bash
# 開発モード（ファイル監視）
npm run dev

# プロダクションビルド
npm run build

# ビルド済みサーバーを起動
npm start

# ESLintでコードチェック
npm run lint

# 音声再生のテスト
npx tsx test-internal.ts
```

## テスト

### 内部テスト

`test-internal.ts`では以下のテストを実行します：

- 効果音リストの取得テスト
- 各効果音の再生テスト（complete音、newtype音、error音）
- 音声ファイルのダウンロードと再生処理の動作確認

```bash
npx tsx test-internal.ts
```

## アーキテクチャ

### 主要ファイル

- **`src/index.ts`**: MCPサーバーのメイン実装
- **`src/sound.ts`**: 音声ファイルのダウンロードと再生処理
- **`test-internal.ts`**: 開発時の動作確認用テスト

### MCPツールの実装

- `TOOLS`配列でツールスキーマを定義
- `ListToolsRequestSchema`でツール一覧を返す
- `CallToolRequestSchema`でツール実行を処理
- エラーハンドリングと日本語メッセージ対応

### 音声再生の仕組み

1. 音声ファイルはCloudflare R2から初回ダウンロード
2. 一時ディレクトリにキャッシュして保存
3. macOSでは`afplay`コマンドで再生

## 技術スタック

- TypeScript ES2020モジュール形式
- Node.js 18以上が必要
- Model Context Protocol (MCP)
- macOS環境での音声再生に最適化

## コントリビューション

1. Issues やプルリクエストは歓迎します
2. コードスタイルはESLintの設定に従ってください
3. 新機能追加時はテストも合わせて実装をお願いします

## プラットフォーム対応

現在はmacOSのみサポートしています。他のプラットフォーム対応も歓迎します：

- **Windows**: `powershell`や`cmd`での音声再生
- **Linux**: `aplay`や`paplay`での音声再生