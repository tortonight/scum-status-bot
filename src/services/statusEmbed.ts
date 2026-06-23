import { EmbedBuilder, Client, TextChannel, Message } from 'discord.js';
import { getServerStatus, formatUptime } from './battlemetrics';
import { getSetupData, updateMessageId } from './dataStore';

export function buildStatusEmbed(status: { online: boolean; name: string; players: number; maxPlayers: number; map: string; gameMode: string; uptime: number; ip: string; port: number; id: string }): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(status.online ? '🟢 SCUM Server Online' : '🔴 SCUM Server Offline')
    .setDescription(status.name)
    .setColor(status.online ? 0x00ff00 : 0xff0000)
    .setTimestamp()
    .setFooter({ text: 'ข้อมูลจาก BattleMetrics API • อัปเดตล่าสุด' })
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
        name: '🎮 Game Mode',
        value: status.gameMode,
        inline: true,
      },
      {
        name: '⏱ Uptime',
        value: formatUptime(status.uptime),
        inline: true,
      },
      {
        name: '🔗 IP Address',
        value: `\`${status.ip}:${status.port}\``,
        inline: true,
      },
      {
        name: '🆔 Server ID',
        value: status.id,
        inline: true,
      }
    );

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

export async function sendOrUpdateStatusMessage(client: Client, guildId: string): Promise<void> {
  const setupData = getSetupData(guildId);
  if (!setupData) return;

  try {
    const channel = client.channels.cache.get(setupData.channelId) as TextChannel | undefined;
    if (!channel) return;

    const status = await getServerStatus();
    const embed = buildStatusEmbed(status);

    // Try to find existing message by the bot in the channel
    if (setupData.messageId) {
      try {
        const existingMessage = await channel.messages.fetch(setupData.messageId);
        if (existingMessage && existingMessage.author.id === client.user?.id) {
          await existingMessage.edit({ embeds: [embed] });
          return;
        }
      } catch {
        // Message not found (deleted or invalid) - will send new one
      }
    }

    // Try to find any bot message in channel
    const messages = await channel.messages.fetch({ limit: 10 });
    const botMessage = messages.find((m) => m.author.id === client.user?.id);

    if (botMessage) {
      await botMessage.edit({ embeds: [embed] });
      updateMessageId(guildId, botMessage.id);
    } else {
      const newMessage = await channel.send({ embeds: [embed] });
      updateMessageId(guildId, newMessage.id);
    }
  } catch (error) {
    console.error(`❌ Failed to send/update status message for guild ${guildId}:`, error instanceof Error ? error.message : 'Unknown error');
  }
}