"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const dataStore_1 = require("../services/dataStore");
const CATEGORY_NAME = '🛢️ SCUM Server';
const CHANNEL_NAME = '📊┃server-status';
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('cleanup')
    .setDescription('ลบ Category 🛢️ SCUM Server, Channel 📊┃server-status และข้อมูล setup')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.guild) {
        await interaction.editReply('❌ คำสั่งนี้ใช้ได้เฉพาะในเซิร์ฟเวอร์เท่านั้น');
        return;
    }
    const guild = interaction.guild;
    const setupData = (0, dataStore_1.getSetupData)(guild.id);
    const deleted = [];
    let setupDeleted = false;
    try {
        // 1. ลบ Channel 📊┃server-status (จาก cache หรือจาก setupData)
        const channel = guild.channels.cache.find((ch) => ch.name === CHANNEL_NAME);
        if (channel) {
            await channel.delete('🧹 Cleanup by SCUM STATUS BOT');
            deleted.push(`📝 Channel \`#${CHANNEL_NAME}\``);
        }
        else if (setupData?.channelId) {
            // Try to delete by ID if exists in setup data
            try {
                const channelById = await guild.channels.fetch(setupData.channelId);
                if (channelById) {
                    await channelById.delete('🧹 Cleanup by SCUM STATUS BOT');
                    deleted.push(`📝 Channel \`#${CHANNEL_NAME}\``);
                }
            }
            catch {
                // Channel already deleted or not found
            }
        }
        // 2. ลบ Category 🛢️ SCUM Server (จะลบ channels ลูกที่เหลืออยู่ด้วย)
        const category = guild.channels.cache.find((ch) => ch.name === CATEGORY_NAME);
        if (category) {
            await category.delete('🧹 Cleanup by SCUM STATUS BOT');
            deleted.push(`📁 Category \`${CATEGORY_NAME}\``);
        }
        else if (setupData?.categoryId) {
            try {
                const categoryById = await guild.channels.fetch(setupData.categoryId);
                if (categoryById) {
                    await categoryById.delete('🧹 Cleanup by SCUM STATUS BOT');
                    deleted.push(`📁 Category \`${CATEGORY_NAME}\``);
                }
            }
            catch {
                // Category already deleted or not found
            }
        }
        // 3. ลบข้อมูล setup.json
        if (setupData) {
            (0, dataStore_1.saveSetupData)(guild.id, {
                guildId: guild.id,
                categoryId: '',
                channelId: '',
                messageId: null,
            });
            setupDeleted = true;
        }
        // 4. สร้าง Embed ยืนยัน
        if (deleted.length === 0 && !setupDeleted) {
            const notFoundEmbed = new discord_js_1.EmbedBuilder()
                .setTitle('❌ ไม่พบข้อมูลที่ต้องลบ')
                .setDescription('ไม่พบ Category, Channel หรือข้อมูล setup ที่ต้องลบ')
                .setColor(0xffaa00);
            await interaction.editReply({ embeds: [notFoundEmbed] });
            return;
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('🧹 Cleanup Complete!')
            .setDescription('ลบข้อมูล SCUM Status เรียบร้อยแล้ว')
            .setColor(0xff6600);
        if (deleted.length > 0) {
            embed.addFields({
                name: '🗑️ ที่ถูกลบ',
                value: deleted.join('\n'),
                inline: false,
            });
        }
        if (setupDeleted) {
            embed.addFields({
                name: '📄 ข้อมูล setup.json',
                value: '✅ ถูกลบเรียบร้อย',
                inline: false,
            });
        }
        embed.setFooter({ text: 'สามารถใช้ /setup เพื่อตั้งค่าใหม่อีกครั้ง' });
        await interaction.editReply({ embeds: [embed] });
        console.log(`🧹 Cleanup complete for guild ${guild.name} (${guild.id})`);
    }
    catch (error) {
        console.error('❌ Cleanup error:', error instanceof Error ? error.message : 'Unknown error');
        await interaction.editReply({
            content: '❌ เกิดข้อผิดพลาดในการลบ กรุณาตรวจสอบว่า Bot มีสิทธิ์ `Manage Channels`',
        });
    }
}
//# sourceMappingURL=cleanup.js.map