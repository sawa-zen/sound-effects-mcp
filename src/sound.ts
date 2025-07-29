import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execAsync = promisify(exec);

// パッケージのルートディレクトリのassetsフォルダを指す
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, '..', 'assets');

const FLEXATONE_FILE = join(ASSETS_DIR, 'flexatone.wav');
const DONE_FILE = join(ASSETS_DIR, 'done.wav');
const ERROR_FILE = join(ASSETS_DIR, 'error.wav');

export type SoundEffect =
  | 'complete'     // 完了音（done.wav）
  | 'newtype'      // ニュータイプ音（flexatone.wav）
  | 'error';       // エラー音（error.wav）

interface SoundConfig {
  description: string;
}

const SOUND_CONFIGS: Record<SoundEffect, SoundConfig> = {
  complete: { description: '完了音' },
  newtype: { description: 'ニュータイプ音' },
  error: { description: 'エラー音' },
};

async function playSystemSound(soundEffect: SoundEffect): Promise<void> {
  if (process.platform === 'darwin') {
    if (soundEffect === 'newtype') {
      await execAsync(`afplay "${FLEXATONE_FILE}"`);
    } else if (soundEffect === 'complete') {
      await execAsync(`afplay "${DONE_FILE}"`);
    } else if (soundEffect === 'error') {
      await execAsync(`afplay "${ERROR_FILE}"`);
    }
  } else if (process.platform === 'win32') {
    if (soundEffect === 'newtype') {
      await execAsync(`powershell -c "(New-Object Media.SoundPlayer '${FLEXATONE_FILE}').PlaySync()"`);
    } else if (soundEffect === 'complete') {
      await execAsync(`powershell -c "(New-Object Media.SoundPlayer '${DONE_FILE}').PlaySync()"`);
    } else if (soundEffect === 'error') {
      await execAsync(`powershell -c "(New-Object Media.SoundPlayer '${ERROR_FILE}').PlaySync()"`);
    }
  }
}

export async function playSoundEffect(soundEffect: SoundEffect): Promise<void> {
  await playSystemSound(soundEffect);
}

export function getSoundEffectList(): Array<{ name: SoundEffect; description: string }> {
  return Object.entries(SOUND_CONFIGS).map(([name, config]) => ({
    name: name as SoundEffect,
    description: config.description,
  }));
}
