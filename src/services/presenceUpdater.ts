import { Client, ActivityType } from 'discord.js';
import { getServerStatus } from './battlemetrics';
import { config } from '../config';
import { getSetupData } from './dataStore';
import { sendOrUpdateStatusMessage } from './statusEmbed';

export function startPresenceUpdater(client: Client): void {
  const intervalMs = config.presenceUpdateInterval * 60 * 1000;

  console.log(`🔄 Presence & Channel updater started (every ${config.presenceUpdateInterval} minutes)`);

  // Update immediately on start
  updateAll(client);

  // Then update on interval
  setInterval(() => updateAll(client), intervalMs);
}

async function updateAll(client: Client): Promise<void> {
  if (!client.user) return;

  try {
    const status = await getServerStatus();

    // 1. Update Discord Presence (สถานะใต้ชื่อ)
    if (status.online) {
      client.user.setActivity({
        name: `🟢 ${status.players}/${status.maxPlayers} players on SCUM`,
        type: ActivityType.Playing,
      });
    } else {
      client.user.setActivity({
        name: '🔴 SCUM Server Offline',
        type: ActivityType.Playing,
      });
    }

    console.log(`[${new Date().toLocaleTimeString()}] Presence updated: ${status.players}/${status.maxPlayers} players`);

    // 2. Update embed message in all guilds that have setup
    const guilds = client.guilds.cache;
    for (const [, guild] of guilds) {
      const setupData = getSetupData(guild.id);
      if (setupData) {
        await sendOrUpdateStatusMessage(client, guild.id);
      }
    }
  } catch (error) {
    console.error('❌ Failed to update:', error instanceof Error ? error.message : 'Unknown error');

    if (client.user) {
      client.user.setActivity({
        name: '❌ Status Unavailable',
        type: ActivityType.Playing,
      });
    }
  }
}