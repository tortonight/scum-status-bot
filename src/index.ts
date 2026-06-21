import { validateConfig } from './config';
import { startBot } from './bot';

async function main(): Promise<void> {
  console.log('🎮 SCUM STATUS BOT');
  console.log('====================\n');

  if (!validateConfig()) {
    process.exit(1);
  }

  try {
    await startBot();
  } catch (error) {
    console.error('❌ Failed to start bot:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();