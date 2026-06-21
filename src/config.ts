import dotenv from 'dotenv';
import { BotConfig } from './types';

dotenv.config();

export const config: BotConfig = {
  discordToken: process.env.DISCORD_TOKEN || '',
  battleMetricsApiKey: process.env.BATTLEMETRICS_API_KEY || undefined,
  serverId: process.env.SERVER_ID || '',
  presenceUpdateInterval: parseInt(process.env.PRESENCE_UPDATE_INTERVAL || '5', 10),
};

export function validateConfig(): boolean {
  const missing: string[] = [];

  if (!config.discordToken) missing.push('DISCORD_TOKEN');
  if (!config.serverId) missing.push('SERVER_ID');

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\n📝 Copy .env.example to .env and fill in the values.');
    return false;
  }

  return true;
}