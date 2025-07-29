# サウンドエフェクトMCP 🎵

様々なシチュエーションに応じた効果音を再生するMCPサーバーです。

## 特徴

- 🎵 3種類の効果音（完了、ニュータイプ音、エラー音）
- 🚀 Claude Desktopとの連携
- 🛠️ シンプルなMCPツール
- 🎯 作業効率とエンターテイメント性の両立

## 使用方法

### Claude Code経由での使用

Claude CodeでプロジェクトレベルでこのMCPを追加：

```bash
claude mcp add sound-effects-mcp -s project -- npx -y sound-effects-mcp
```

> [!WARNING]
> 環境によっては`npx`が見つからない場合があります。その場合は`which npx`でフルパスを確認して使用してください：
>
> ```bash
> # npxのフルパスを確認
> which npx
>
> # フルパスを使用（例）
> claude mcp add sound-effects-mcp -s project -- /usr/local/bin/npx -y sound-effects-mcp
> ```

### Claude Desktopとの連携

Claude Desktopの設定ファイル（`~/Library/Application Support/Claude/claude_desktop_config.json`）に以下を追加：

```json
{
  "mcpServers": {
    "sound-effects-mcp": {
      "command": "npx",
      "args": ["-y", "sound-effects-mcp"]
    }
  }
}
```

### 利用可能なツール

#### `play-sound-effect`

様々な効果音を再生します。

**パラメータ:**
- `sound` (必須): 効果音の種類
  - `complete`: 完了音（メロディ）
  - `newtype`: ニュータイプ音（キュピーン）
  - `error`: エラー音（警告音）
- `message` (オプション): メッセージ

**使用例:**
```
play-sound-effect を使って、complete音でタスク完了を知らせてください
```

#### `list-sound-effects`

利用可能な効果音の一覧を表示します。

**使用例:**
```
list-sound-effects で効果音一覧を見せてください
```

## 便利なプロンプト設定

Claude CodeのCLAUDE.mdファイルに以下を追加すると、自動的に適切なタイミングで効果音が再生されます：

```markdown
# サウンドエフェクト
- タスクやプロジェクトが完了した時は `play-sound-effect` の `complete` 音を再生してください
- 問題の原因が特定できた時は `play-sound-effect` の `newtype` 音を再生してください
- 重要な気づきやひらめきがあった時は `play-sound-effect` の `newtype` 音を再生してください
```

## 対応プラットフォーム

- **macOS**: 音声ファイル（MP3）を`afplay`コマンドで再生

音声ファイルは初回実行時に自動的にダウンロードされ、一時ディレクトリに保存されます。

## 使用用途

このMCPサーバーは以下のような場面で活用できます：

- **完了音**: プロジェクト完了、長時間処理の終了、タスク完了時
- **ニュータイプ音**: 特別な達成、ひらめき時、問題の原因が特定できた時（ネタ要素）
- **エラー音**: エラー発生時、警告時、注意が必要な場面

作業効率向上と楽しさを両立できるツールです。

## 開発者向け情報

開発・コントリビューションについては [CONTRIBUTING.md](./CONTRIBUTING.md) をご覧ください。

## ライセンス

MIT License