#!/usr/bin/env node

import { playSoundEffect, getSoundEffectList, SoundEffect } from './src/sound.js';

async function testSoundEffect(sound: SoundEffect) {
  console.log(`🧪 ${sound}音のテストを開始...`);
  
  try {
    const startTime = Date.now();
    await playSoundEffect(sound);
    const endTime = Date.now();
    
    console.log(`✅ ${sound}音の再生成功！ (${endTime - startTime}ms)`);
  } catch (error) {
    console.log(`❌ ${sound}音の再生失敗:`, error instanceof Error ? error.message : String(error));
  }
}

async function testListSoundEffects() {
  console.log('🧪 効果音リストのテストを開始...');
  
  try {
    const effects = getSoundEffectList();
    console.log('✅ 効果音リスト取得成功:');
    effects.forEach(effect => {
      console.log(`  • ${effect.name}: ${effect.description}`);
    });
    return effects;
  } catch (error) {
    console.log('❌ 効果音リスト取得失敗:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

async function main() {
  console.log('🎵 MCPサーバー内部処理テスト開始\n');
  
  // 1. 効果音リストのテスト
  const effects = await testListSoundEffects();
  console.log('');
  
  // 2. 各効果音のテスト
  for (const effect of effects) {
    await testSoundEffect(effect.name);
    console.log('');
    
    // 音声再生の間隔を空ける
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 テスト完了！');
}

main().catch(console.error);