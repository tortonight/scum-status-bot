"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPresenceUpdater = startPresenceUpdater;
const discord_js_1 = require("discord.js");
const battlemetrics_1 = require("./battlemetrics");
const config_1 = require("../config");
function startPresenceUpdater(client) {
    const intervalMs = config_1.config.presenceUpdateInterval * 60 * 1000;
    console.log(`🔄 Presence updater started (every ${config_1.config.presenceUpdateInterval} minutes)`);
    // Update immediately on start
    updatePresence(client);
    // Then update on interval
    setInterval(() => updatePresence(client), intervalMs);
}
async function updatePresence(client) {
    if (!client.user)
        return;
    try {
        const status = await (0, battlemetrics_1.getServerStatus)();
        if (status.online) {
            client.user.setActivity({
                name: `🟢 ${status.players}/${status.maxPlayers} players on SCUM`,
                type: discord_js_1.ActivityType.Playing,
            });
        }
        else {
            client.user.setActivity({
                name: '🔴 SCUM Server Offline',
                type: discord_js_1.ActivityType.Playing,
            });
        }
        console.log(`[${new Date().toLocaleTimeString()}] Presence updated: ${status.players}/${status.maxPlayers} players`);
    }
    catch (error) {
        console.error('❌ Failed to update presence:', error instanceof Error ? error.message : 'Unknown error');
        if (client.user) {
            client.user.setActivity({
                name: '❌ Status Unavailable',
                type: discord_js_1.ActivityType.Playing,
            });
        }
    }
}
//# sourceMappingURL=presenceUpdater.js.map