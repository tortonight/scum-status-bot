"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBot = startBot;
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const statusCommand = __importStar(require("./commands/status"));
const setupCommand = __importStar(require("./commands/setup"));
const cleanupCommand = __importStar(require("./commands/cleanup"));
const presenceUpdater_1 = require("./services/presenceUpdater");
async function startBot() {
    const client = new discord_js_1.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds,
            discord_js_1.GatewayIntentBits.GuildMessages,
        ],
    });
    // Store commands
    const commands = new discord_js_1.Collection();
    commands.set(statusCommand.data.name, statusCommand);
    commands.set(setupCommand.data.name, setupCommand);
    commands.set(cleanupCommand.data.name, cleanupCommand);
    client.once('clientReady', async () => {
        console.log(`✅ Bot logged in as ${client.user?.tag}`);
        // Register slash commands globally
        await registerCommands(client.user.id);
        // Start presence & channel updater
        (0, presenceUpdater_1.startPresenceUpdater)(client);
    });
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand())
            return;
        const command = commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(`❌ Error executing ${interaction.commandName}:`, error);
            await interaction.reply({
                content: '❌ เกิดข้อผิดพลาดในการดำเนินการคำสั่ง',
                ephemeral: true,
            });
        }
    });
    await client.login(config_1.config.discordToken);
}
async function registerCommands(clientId) {
    const rest = new discord_js_1.REST({ version: '10' }).setToken(config_1.config.discordToken);
    const commands = [
        statusCommand.data.toJSON(),
        setupCommand.data.toJSON(),
        cleanupCommand.data.toJSON(),
    ];
    try {
        console.log('🔄 Registering slash commands...');
        await rest.put(discord_js_1.Routes.applicationCommands(clientId), { body: commands });
        console.log('✅ Slash commands registered successfully');
    }
    catch (error) {
        console.error('❌ Failed to register slash commands:', error);
    }
}
//# sourceMappingURL=bot.js.map