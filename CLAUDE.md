# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

音声効果音を再生するMCPサーバーです。Claude Desktopと連携して、完了音（done.wav）、ニュータイプ音（flexatone.wav）、エラー音（error.wav）を再生できます。

## よく使うコマンド

```bash
# 開発
npm run dev          # TypeScript watch mode
npm run build        # プロダクションビルド
npm run lint         # ESLintでコードチェック
npm start            # ビルド済みサーバーを起動

# テスト
npx tsx test-internal.ts  # 内部音声再生テスト（開発時の動作確認）
```

## アーキテクチャ

- **MCPサーバー**: `src/index.ts` - Model Context Protocol サーバーのメイン実装
- **音声処理**: `src/sound.ts` - 音声ファイルのダウンロードと再生を担当
- **ツール**: 2つのMCPツールを提供
  - `play-sound-effect`: 指定された効果音を再生
  - `list-sound-effects`: 利用可能な効果音一覧を取得

### 音声再生の仕組み
1. 音声ファイルはCloudflare R2から初回ダウンロード
2. 一時ディレクトリにキャッシュして保存
3. macOSでは`afplay`コマンド、Windowsでは`PowerShell Media.SoundPlayer`で再生

### MCPツールの実装パターン
- `TOOLS`配列でツールスキーマを定義
- `ListToolsRequestSchema`でツール一覧を返す
- `CallToolRequestSchema`でツール実行を処理
- エラーハンドリングと日本語メッセージ対応

## 開発時の注意点

- TypeScript ES2020モジュール形式
- Node.js 18以上が必要
- macOSとWindows環境での音声再生に対応
- 音声ファイルのダウンロードは非同期処理で実装
- **コミット前には必ず `npm run lint` を実行してコードをチェックする**