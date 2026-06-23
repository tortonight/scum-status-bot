import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, PermissionFlagsBits, ChannelType, GuildChannel } from 'discord.js';
import { saveSetupData, getSetupData } from '../services/dataStore';

const CATEGORY_NAME = '🛢️ SCUM Server';
const CHANNEL_NAME = '📊┃server-status';

export const data = new SlashCommandBuilder()
  .setName('setup')
  .setDescription('ตั้งค่า Category และ Channel สำหรับแสดงสถานะ SCUM Server')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: CommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.guild) {
    await interaction.editReply('❌ คำสั่งนี้ใช้ได้เฉพาะในเซิร์ฟเวอร์เท่านั้น');
    return;
  }

  const guild = interaction.guild;

  try {
    // 1. หา Category 🛢️ SCUM Server
    let category = guild.channels.cache.find(
      (ch) => ch.type === ChannelType.GuildCategory && ch.name === CATEGORY_NAME
    );

    if (!category) {
      console.log('📁 Creating category:', CATEGORY_NAME);
      category = await guild.channels.create({
        name: CATEGORY_NAME,
        type: ChannelType.GuildCategory,
      });
    }

    // 2. หา Channel 📊┃server-status
    let channel = guild.channels.cache.find(
      (ch) => ch.type === ChannelType.GuildText && ch.name === CHANNEL_NAME && ch.parentId === category.id
    ) as GuildChannel | undefined;

    if (!channel) {
      console.log('📝 Creating channel:', CHANNEL_NAME);
      channel = await guild.channels.create({
        name: CHANNEL_NAME,
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
            allow: [PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ViewChannel],
          },
        ],
      });
    }

    // 3. บันทึกข้อมูลลง data/setup.json
    const existingData = getSetupData(guild.id);
    saveSetupData(guild.id, {
      guildId: guild.id,
      categoryId: category.id,
      channelId: channel.id,
      messageId: existingData?.messageId || null,
    });

    // 4. ส่ง Embed ยืนยัน
    const embed = new EmbedBuilder()
      .setTitle('✅ Setup Complete!')
      .setDescription('สร้าง Category และ Channel สำหรับ SCUM Status เรียบร้อยแล้ว')
      .setColor(0x00ff00)
      .addFields(
        {
          name: '📁 Category',
          value: `\`${CATEGORY_NAME}\` (${category.id})`,
          inline: true,
        },
        {
          name: '📝 Channel',
          value: `<#${channel.id}> (${channel.id})`,
          inline: true,
        }
      )
      .setFooter({ text: 'ใช้ /status เพื่ออัปเดตสถานะ หรือรอ auto-update' });

    await interaction.editReply({ embeds: [embed] });
    console.log(`✅ Setup complete for guild ${guild.name} (${guild.id})`);
  } catch (error) {
    console.error('❌ Setup error:', error instanceof Error ? error.message : 'Unknown error');
    await interaction.editReply({
      content: '❌ เกิดข้อผิดพลาดในการตั้งค่า กรุณาตรวจสอบว่า Bot มีสิทธิ์ `Manage Channels`',
    });
  }
}