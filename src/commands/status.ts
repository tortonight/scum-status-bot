import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getServerStatus } from '../services/battlemetrics';
import { sendOrUpdateStatusMessage } from '../services/statusEmbed';
import { getSetupData } from '../services/dataStore';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('อัปเดตสถานะเซิร์ฟเวอร์ SCUM ใน channel');

export async function execute(interaction: CommandInteraction): Promise<void> {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.guild) {
    await interaction.editReply('❌ คำสั่งนี้ใช้ได้เฉพาะในเซิร์ฟเวอร์เท่านั้น');
    return;
  }

  // Check if setup was done
  const setupData = getSetupData(interaction.guild.id);
  if (!setupData) {
    await interaction.editReply({
      content: '❌ ยังไม่ได้ตั้งค่าเซิร์ฟเวอร์ กรุณาใช้ `/setup` ก่อน',
    });
    return;
  }

  try {
    const status = await getServerStatus();
    await sendOrUpdateStatusMessage(interaction.client, interaction.guild.id);

    const confirmEmbed = new EmbedBuilder()
      .setTitle('✅ อัปเดตสถานะเรียบร้อย')
      .setDescription(`ส่งข้อมูลไปยัง <#${setupData.channelId}>`)
      .setColor(0x00ff00)
      .addFields(
        {
          name: '👥 ผู้เล่น',
          value: `${status.players}/${status.maxPlayers}`,
          inline: true,
        },
        {
          name: '🌍 Map',
          value: status.map,
          inline: true,
        },
        {
          name: 'สถานะ',
          value: status.online ? '🟢 Online' : '🔴 Offline',
          inline: true,
        }
      );

    await interaction.editReply({ embeds: [confirmEmbed] });
  } catch (error) {
    console.error('❌ Error executing /status command:', error instanceof Error ? error.message : 'Unknown error');

    const errorEmbed = new EmbedBuilder()
      .setTitle('❌ Error')
      .setDescription('ไม่สามารถดึงข้อมูลสถานะเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง')
      .setColor(0xff0000);

    await interaction.editReply({ embeds: [errorEmbed] });
  }
}