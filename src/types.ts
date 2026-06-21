export interface ServerStatus {
  id: string;
  name: string;
  ip: string;
  port: number;
  players: number;
  maxPlayers: number;
  online: boolean;
  map: string;
  gameMode: string;
  uptime: number;
  lastUpdated: Date;
}

export interface BattleMetricsResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      name: string;
      ip: string;
      port: number;
      players: number;
      maxPlayers: number;
      status: string;
      details: {
        map?: string;
        gameMode?: string;
      };
      uptime: number;
      updatedAt: string;
    };
  };
}

export interface BotConfig {
  discordToken: string;
  battleMetricsApiKey?: string;
  serverId: string;
  presenceUpdateInterval: number;
}
