"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetupData = getSetupData;
exports.saveSetupData = saveSetupData;
exports.updateMessageId = updateMessageId;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DATA_FILE = path_1.default.join(__dirname, '../../data/setup.json');
function ensureDataDir() {
    const dir = path_1.default.dirname(DATA_FILE);
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
}
function readAll() {
    ensureDataDir();
    try {
        if (fs_1.default.existsSync(DATA_FILE)) {
            const raw = fs_1.default.readFileSync(DATA_FILE, 'utf-8');
            return JSON.parse(raw);
        }
    }
    catch (error) {
        console.error('❌ Failed to read data file:', error);
    }
    return {};
}
function writeAll(data) {
    ensureDataDir();
    try {
        fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    }
    catch (error) {
        console.error('❌ Failed to write data file:', error);
    }
}
function getSetupData(guildId) {
    const all = readAll();
    return all[guildId] || null;
}
function saveSetupData(guildId, data) {
    const all = readAll();
    all[guildId] = data;
    writeAll(all);
}
function updateMessageId(guildId, messageId) {
    const data = getSetupData(guildId);
    if (data) {
        data.messageId = messageId;
        saveSetupData(guildId, data);
    }
}
//# sourceMappingURL=dataStore.js.map