import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import https from 'https';

const execAsync = promisify(exec);

const FLEXATONE_URL = 'https://pub-c53c7dd0db3e4508929904a3e72f5438.r2.dev/flexatone.wav';
const DONE_URL = 'https://pub-c53c7dd0db3e4508929904a3e72f5438.r2.dev/done.wav';
const ERROR_URL = 'https://pub-c53c7dd0db3e4508929904a3e72f5438.r2.dev/error.wav';
const TEMP_DIR = tmpdir();
const FLEXATONE_FILE = join(TEMP_DIR, 'flexatone.wav');
const DONE_FILE = join(TEMP_DIR, 'done.wav');
const ERROR_FILE = join(TEMP_DIR, 'error.wav');

async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // ファイルが既に存在する場合はダウンロードをスキップ
    fs.access(filepath).then(() => {
      resolve();
    }).catch(() => {
      const file = createWriteStream(filepath);
      https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      }).on('error', (err: Error) => {
        reject(err);
      });
    });
  });
}

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
      await downloadFile(FLEXATONE_URL, FLEXATONE_FILE);
      await execAsync(`afplay "${FLEXATONE_FILE}"`);
    } else if (soundEffect === 'complete') {
      await downloadFile(DONE_URL, DONE_FILE);
      await execAsync(`afplay "${DONE_FILE}"`);
    } else if (soundEffect === 'error') {
      await downloadFile(ERROR_URL, ERROR_FILE);
      await execAsync(`afplay "${ERROR_FILE}"`);
    }
  } else if (process.platform === 'win32') {
    if (soundEffect === 'newtype') {
      await downloadFile(FLEXATONE_URL, FLEXATONE_FILE);
      await execAsync(`powershell -c "(New-Object Media.SoundPlayer '${FLEXATONE_FILE}').PlaySync()"`);
    } else if (soundEffect === 'complete') {
      await downloadFile(DONE_URL, DONE_FILE);
      await execAsync(`powershell -c "(New-Object Media.SoundPlayer '${DONE_FILE}').PlaySync()"`);
    } else if (soundEffect === 'error') {
      await downloadFile(ERROR_URL, ERROR_FILE);
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
