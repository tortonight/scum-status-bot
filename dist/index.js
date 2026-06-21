"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const bot_1 = require("./bot");
async function main() {
    console.log('🎮 SCUM STATUS BOT');
    console.log('====================\n');
    if (!(0, config_1.validateConfig)()) {
        process.exit(1);
    }
    try {
        await (0, bot_1.startBot)();
    }
    catch (error) {
        console.error('❌ Failed to start bot:', error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map