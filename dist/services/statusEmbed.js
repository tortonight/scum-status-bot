"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildStatusEmbed = buildStatusEmbed;
exports.sendOrUpdateStatusMessage = sendOrUpdateStatusMessage;
const discord_js_1 = require("discord.js");
const battlemetrics_1 = require("./battlemetrics");
const dataStore_1 = require("./dataStore");
function buildStatusEmbed(status) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle(status.online ? '🟢 SCUM Server Online' : '🔴 SCUM Server Offline')
        .setDescription(status.name)
        .setColor(status.online ? 0x00ff00 : 0xff0000)
        .setTimestamp()
        .setFooter({ text: 'ข้อมูลจาก BattleMetrics API • อัปเดตล่าสุด' })
        .addFields({
        name: '👥 ผู้เล่น',
        value: `${status.players}/${status.maxPlayers}`,
        inline: true,
    }, {
        name: '🌍 Map',
        value: status.map,
        inline: true,
    }, {
        name: '🎮 Game Mode',
        value: status.gameMode,
        inline: true,
    }, {
        name: '⏱ Uptime',
        value: (0, battlemetrics_1.formatUptime)(status.uptime),
        inline: true,
    }, {
        name: '🔗 IP Address',
        value: `\`${status.ip}:${status.port}\``,
        inline: true,
    }, {
        name: '🆔 Server ID',
        value: status.id,
        inline: true,
    });
    // Add a player bar visualization
    if (status.online && status.maxPlayers > 0) {
        const barLength = 10;
        const filledBars = Math.round((status.players / status.maxPlayers) * barLength);
        const emptyBars = barLength - filledBars;
        const bar = '🟩'.repeat(filledBars) + '⬜'.repeat(emptyBars);
        embed.addFields({ name: '📊 Player Bar', value: bar, inline: false });
    }
    return embed;
}
async function sendOrUpdateStatusMessage(client, guildId) {
    const setupData = (0, dataStore_1.getSetupData)(guildId);
    if (!setupData)
        return;
    try {
        const channel = client.channels.cache.get(setupData.channelId);
        if (!channel)
            return;
        const status = await (0, battlemetrics_1.getServerStatus)();
        const embed = buildStatusEmbed(status);
        // Try to find existing message by the bot in the channel
        if (setupData.messageId) {
            try {
                const existingMessage = await channel.messages.fetch(setupData.messageId);
                if (existingMessage && existingMessage.author.id === client.user?.id) {
                    await existingMessage.edit({ embeds: [embed] });
                    return;
                }
            }
            catch {
                // Message not found (deleted or invalid) - will send new one
            }
        }
        // Try to find any bot message in channel
        const messages = await channel.messages.fetch({ limit: 10 });
        const botMessage = messages.find((m) => m.author.id === client.user?.id);
        if (botMessage) {
            await botMessage.edit({ embeds: [embed] });
            (0, dataStore_1.updateMessageId)(guildId, botMessage.id);
        }
        else {
            const newMessage = await channel.send({ embeds: [embed] });
            (0, dataStore_1.updateMessageId)(guildId, newMessage.id);
        }
    }
    catch (error) {
        console.error(`❌ Failed to send/update status message for guild ${guildId}:`, error instanceof Error ? error.message : 'Unknown error');
    }
}
//# sourceMappingURL=statusEmbed.js.map