"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const battlemetrics_1 = require("../services/battlemetrics");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('status')
    .setDescription('แสดงสถานะเซิร์ฟเวอร์ SCUM');
async function execute(interaction) {
    await interaction.deferReply();
    try {
        const status = await (0, battlemetrics_1.getServerStatus)();
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(status.online ? '🟢 SCUM Server Online' : '🔴 SCUM Server Offline')
            .setDescription(status.name)
            .setColor(status.online ? 0x00ff00 : 0xff0000)
            .setTimestamp()
            .setFooter({ text: 'ข้อมูลจาก BattleMetrics API' })
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
        await interaction.editReply({ embeds: [embed] });
    }
    catch (error) {
        console.error('❌ Error executing /status command:', error instanceof Error ? error.message : 'Unknown error');
        const errorEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('❌ Error')
            .setDescription('ไม่สามารถดึงข้อมูลสถานะเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง')
            .setColor(0xff0000)
            .setTimestamp();
        await interaction.editReply({ embeds: [errorEmbed] });
    }
}
//# sourceMappingURL=status.js.map