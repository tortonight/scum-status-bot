import { Client, ActivityType } from 'discord.js';
import { getServerStatus } from './battlemetrics';
import { config } from '../config';

export function startPresenceUpdater(client: Client): void {
  const intervalMs = config.presenceUpdateInterval * 60 * 1000;

  console.log(`🔄 Presence updater started (every ${config.presenceUpdateInterval} minutes)`);

  // Update immediately on start
  updatePresence(client);

  // Then update on interval
  setInterval(() => updatePresence(client), intervalMs);
}

async function updatePresence(client: Client): Promise<void> {
  if (!client.user) return;

  try {
    const status = await getServerStatus();

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
  } catch (error) {
    console.error('❌ Failed to update presence:', error instanceof Error ? error.message : 'Unknown error');

    if (client.user) {
      client.user.setActivity({
        name: '❌ Status Unavailable',
        type: ActivityType.Playing,
      });
    }
  }
}