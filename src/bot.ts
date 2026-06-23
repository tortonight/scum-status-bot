import { Client, GatewayIntentBits, REST, Routes, Collection } from 'discord.js';
import { config } from './config';
import * as statusCommand from './commands/status';
import * as setupCommand from './commands/setup';
import * as cleanupCommand from './commands/cleanup';
import { startPresenceUpdater } from './services/presenceUpdater';

// Command interface
interface Command {
  data: { name: string; toJSON: () => unknown };
  execute: (interaction: import('discord.js').CommandInteraction) => Promise<void>;
}

export async function startBot(): Promise<void> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ],
  });

  // Store commands
  const commands = new Collection<string, Command>();
  commands.set(statusCommand.data.name, statusCommand as Command);
  commands.set(setupCommand.data.name, setupCommand as Command);
  commands.set(cleanupCommand.data.name, cleanupCommand as Command);

  client.once('clientReady' as 'ready', async () => {
    console.log(`✅ Bot logged in as ${client.user?.tag}`);

    // Register slash commands globally
    await registerCommands(client.user!.id);

    // Start presence & channel updater
    startPresenceUpdater(client);
  });

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error executing ${interaction.commandName}:`, error);
      await interaction.reply({
        content: '❌ เกิดข้อผิดพลาดในการดำเนินการคำสั่ง',
        ephemeral: true,
      });
    }
  });

  await client.login(config.discordToken);
}

async function registerCommands(clientId: string): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(config.discordToken);

  const commands = [
    statusCommand.data.toJSON(),
    setupCommand.data.toJSON(),
    cleanupCommand.data.toJSON(),
  ];

  try {
    console.log('🔄 Registering slash commands...');
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    );
    console.log('✅ Slash commands registered successfully');
  } catch (error) {
    console.error('❌ Failed to register slash commands:', error);
  }
}
