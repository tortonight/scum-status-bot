import axios from 'axios';
import { config } from '../config';
import { ServerStatus, BattleMetricsResponse } from '../types';

const BATTLEMETRICS_API_BASE = 'https://api.battlemetrics.com';

export async function getServerStatus(): Promise<ServerStatus> {
  const headers: Record<string, string> = {};
  if (config.battleMetricsApiKey) {
    headers.Authorization = `Bearer ${config.battleMetricsApiKey}`;
  }

  const response = await axios.get<BattleMetricsResponse>(
    `${BATTLEMETRICS_API_BASE}/servers/${config.serverId}`,
    { headers }
  );

  const { data } = response.data;
  const { attributes } = data;

  return {
    id: data.id,
    name: attributes.name,
    ip: attributes.ip,
    port: attributes.port,
    players: attributes.players,
    maxPlayers: attributes.maxPlayers,
    online: attributes.status === 'online',
    map: attributes.details.map || 'Unknown',
    gameMode: attributes.details.gameMode || 'Unknown',
    uptime: attributes.uptime,
    lastUpdated: new Date(attributes.updatedAt),
  };
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '< 1m';
}