"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.validateConfig = validateConfig;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    discordToken: process.env.DISCORD_TOKEN || '',
    battleMetricsApiKey: process.env.BATTLEMETRICS_API_KEY || undefined,
    serverId: process.env.SERVER_ID || '',
    presenceUpdateInterval: parseInt(process.env.PRESENCE_UPDATE_INTERVAL || '5', 10),
};
function validateConfig() {
    const missing = [];
    if (!exports.config.discordToken)
        missing.push('DISCORD_TOKEN');
    if (!exports.config.serverId)
        missing.push('SERVER_ID');
    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:');
        missing.forEach((key) => console.error(`   - ${key}`));
        console.error('\n📝 Copy .env.example to .env and fill in the values.');
        return false;
    }
    return true;
}
//# sourceMappingURL=config.js.map