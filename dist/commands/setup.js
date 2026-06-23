"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const dataStore_1 = require("../services/dataStore");
const CATEGORY_NAME = '🛢️ SCUM Server';
const CHANNEL_NAME = '📊┃server-status';
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('setup')
    .setDescription('ตั้งค่า Category และ Channel สำหรับแสดงสถานะ SCUM Server')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.guild) {
        await interaction.editReply('❌ คำสั่งนี้ใช้ได้เฉพาะในเซิร์ฟเวอร์เท่านั้น');
        return;
    }
    const guild = interaction.guild;
    try {
        // 1. หา Category 🛢️ SCUM Server
        let category = guild.channels.cache.find((ch) => ch.type === discord_js_1.ChannelType.GuildCategory && ch.name === CATEGORY_NAME);
        if (!category) {
            console.log('📁 Creating category:', CATEGORY_NAME);
            category = await guild.channels.create({
                name: CATEGORY_NAME,
                type: discord_js_1.ChannelType.GuildCategory,
            });
        }
        // 2. หา Channel 📊┃server-status
        let channel = guild.channels.cache.find((ch) => ch.type === discord_js_1.ChannelType.GuildText && ch.name === CHANNEL_NAME && ch.parentId === category.id);
        if (!channel) {
            console.log('📝 Creating channel:', CHANNEL_NAME);
            channel = await guild.channels.create({
                name: CHANNEL_NAME,
                type: discord_js_1.ChannelType.GuildText,
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: guild.roles.everyone.id,
                        deny: [discord_js_1.PermissionFlagsBits.SendMessages, discord_js_1.PermissionFlagsBits.AddReactions],
                        allow: [discord_js_1.PermissionFlagsBits.ReadMessageHistory, discord_js_1.PermissionFlagsBits.ViewChannel],
                    },
                ],
            });
        }
        // 3. บันทึกข้อมูลลง data/setup.json
        const existingData = (0, dataStore_1.getSetupData)(guild.id);
        (0, dataStore_1.saveSetupData)(guild.id, {
            guildId: guild.id,
            categoryId: category.id,
            channelId: channel.id,
            messageId: existingData?.messageId || null,
        });
        // 4. ส่ง Embed ยืนยัน
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('✅ Setup Complete!')
            .setDescription('สร้าง Category และ Channel สำหรับ SCUM Status เรียบร้อยแล้ว')
            .setColor(0x00ff00)
            .addFields({
            name: '📁 Category',
            value: `\`${CATEGORY_NAME}\` (${category.id})`,
            inline: true,
        }, {
            name: '📝 Channel',
            value: `<#${channel.id}> (${channel.id})`,
            inline: true,
        })
            .setFooter({ text: 'ใช้ /status เพื่ออัปเดตสถานะ หรือรอ auto-update' });
        await interaction.editReply({ embeds: [embed] });
        console.log(`✅ Setup complete for guild ${guild.name} (${guild.id})`);
    }
    catch (error) {
        console.error('❌ Setup error:', error instanceof Error ? error.message : 'Unknown error');
        await interaction.editReply({
            content: '❌ เกิดข้อผิดพลาดในการตั้งค่า กรุณาตรวจสอบว่า Bot มีสิทธิ์ `Manage Channels`',
        });
    }
}
//# sourceMappingURL=setup.js.map