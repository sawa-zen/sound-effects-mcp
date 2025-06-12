#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

interface ToolSchema {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
}
import { playSoundEffect, getSoundEffectList, SoundEffect } from './sound.js';

const server = new Server(
  {
    name: 'sound-effects-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// ツール一覧の定義
const TOOLS: ToolSchema[] = [
  {
    name: 'play-sound-effect',
    description: '効果音を再生します（完了音、ニュータイプ音、エラー音）',
    inputSchema: {
      type: 'object',
      properties: {
        sound: {
          type: 'string',
          enum: ['complete', 'newtype', 'error'],
          description: '再生する効果音の種類（complete: 完了音, newtype: ニュータイプ音, error: エラー音）',
        },
        message: {
          type: 'string',
          description: 'メッセージ（オプション）',
        },
      },
      required: ['sound'],
    },
  },
  {
    name: 'list-sound-effects',
    description: '利用可能な効果音の一覧を表示します',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// ツール一覧を返すハンドラー
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

// ツール実行のハンドラー
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'play-sound-effect': {
      const soundEffect = args?.sound as SoundEffect;
      if (!soundEffect) {
        return {
          content: [
            {
              type: 'text',
              text: '❌ sound パラメータが必要です',
            },
          ],
          isError: true,
        };
      }

      try {
        await playSoundEffect(soundEffect);
        const message = args?.message ? ` - ${args.message}` : '';
        const soundEffectList = getSoundEffectList();
        const selectedSound = soundEffectList.find(s => s.name === soundEffect);
        const soundName = selectedSound?.description || soundEffect;
        
        return {
          content: [
            {
              type: 'text',
              text: `🎵 ${soundName}を再生しました！${message}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `❌ 音声再生でエラーが発生しました: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }

    case 'list-sound-effects': {
      const soundEffects = getSoundEffectList();
      const list = soundEffects.map(effect => `• **${effect.name}**: ${effect.description}`).join('\n');
      
      return {
        content: [
          {
            type: 'text',
            text: `🎵 利用可能な効果音一覧:\n\n${list}`,
          },
        ],
      };
    }


    default:
      throw new Error(`未知のツール: ${name}`);
  }
});

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('サウンドエフェクトMCPサーバーが起動しました 🚀');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('サーバーエラー:', error);
    process.exit(1);
  });
}