import { EmbedBuilder, Client } from 'discord.js';
export declare function buildStatusEmbed(status: {
    online: boolean;
    name: string;
    players: number;
    maxPlayers: number;
    map: string;
    gameMode: string;
    uptime: number;
    ip: string;
    port: number;
    id: string;
}): EmbedBuilder;
export declare function sendOrUpdateStatusMessage(client: Client, guildId: string): Promise<void>;
//# sourceMappingURL=statusEmbed.d.ts.map