"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const battlemetrics_1 = require("../services/battlemetrics");
const statusEmbed_1 = require("../services/statusEmbed");
const dataStore_1 = require("../services/dataStore");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('status')
    .setDescription('อัปเดตสถานะเซิร์ฟเวอร์ SCUM ใน channel');
async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.guild) {
        await interaction.editReply('❌ คำสั่งนี้ใช้ได้เฉพาะในเซิร์ฟเวอร์เท่านั้น');
        return;
    }
    // Check if setup was done
    const setupData = (0, dataStore_1.getSetupData)(interaction.guild.id);
    if (!setupData) {
        await interaction.editReply({
            content: '❌ ยังไม่ได้ตั้งค่าเซิร์ฟเวอร์ กรุณาใช้ `/setup` ก่อน',
        });
        return;
    }
    try {
        const status = await (0, battlemetrics_1.getServerStatus)();
        await (0, statusEmbed_1.sendOrUpdateStatusMessage)(interaction.client, interaction.guild.id);
        const confirmEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('✅ อัปเดตสถานะเรียบร้อย')
            .setDescription(`ส่งข้อมูลไปยัง <#${setupData.channelId}>`)
            .setColor(0x00ff00)
            .addFields({
            name: '👥 ผู้เล่น',
            value: `${status.players}/${status.maxPlayers}`,
            inline: true,
        }, {
            name: '🌍 Map',
            value: status.map,
            inline: true,
        }, {
            name: 'สถานะ',
            value: status.online ? '🟢 Online' : '🔴 Offline',
            inline: true,
        });
        await interaction.editReply({ embeds: [confirmEmbed] });
    }
    catch (error) {
        console.error('❌ Error executing /status command:', error instanceof Error ? error.message : 'Unknown error');
        const errorEmbed = new discord_js_1.EmbedBuilder()
            .setTitle('❌ Error')
            .setDescription('ไม่สามารถดึงข้อมูลสถานะเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง')
            .setColor(0xff0000);
        await interaction.editReply({ embeds: [errorEmbed] });
    }
}
//# sourceMappingURL=status.js.map