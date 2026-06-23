"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPresenceUpdater = startPresenceUpdater;
const discord_js_1 = require("discord.js");
const battlemetrics_1 = require("./battlemetrics");
const config_1 = require("../config");
const dataStore_1 = require("./dataStore");
const statusEmbed_1 = require("./statusEmbed");
function startPresenceUpdater(client) {
    const intervalMs = config_1.config.presenceUpdateInterval * 60 * 1000;
    console.log(`🔄 Presence & Channel updater started (every ${config_1.config.presenceUpdateInterval} minutes)`);
    // Update immediately on start
    updateAll(client);
    // Then update on interval
    setInterval(() => updateAll(client), intervalMs);
}
async function updateAll(client) {
    if (!client.user)
        return;
    try {
        const status = await (0, battlemetrics_1.getServerStatus)();
        // 1. Update Discord Presence (สถานะใต้ชื่อ)
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
        // 2. Update embed message in all guilds that have setup
        const guilds = client.guilds.cache;
        for (const [, guild] of guilds) {
            const setupData = (0, dataStore_1.getSetupData)(guild.id);
            if (setupData) {
                await (0, statusEmbed_1.sendOrUpdateStatusMessage)(client, guild.id);
            }
        }
    }
    catch (error) {
        console.error('❌ Failed to update:', error instanceof Error ? error.message : 'Unknown error');
        if (client.user) {
            client.user.setActivity({
                name: '❌ Status Unavailable',
                type: discord_js_1.ActivityType.Playing,
            });
        }
    }
}
//# sourceMappingURL=presenceUpdater.js.map