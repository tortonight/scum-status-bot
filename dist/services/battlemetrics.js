"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerStatus = getServerStatus;
exports.formatUptime = formatUptime;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const BATTLEMETRICS_API_BASE = 'https://api.battlemetrics.com';
async function getServerStatus() {
    const headers = {};
    if (config_1.config.battleMetricsApiKey) {
        headers.Authorization = `Bearer ${config_1.config.battleMetricsApiKey}`;
    }
    const response = await axios_1.default.get(`${BATTLEMETRICS_API_BASE}/servers/${config_1.config.serverId}`, { headers });
    const { data } = response.data;
    const { attributes } = data;
    return {
        id: data.id,
        name: attributes.name,
        ip: attributes.ip,
        port: attributes.port,
        players: attributes.players,
        maxPlayers: attributes.maxPlayers,
        online: attributes.status === 'online',
        map: attributes.details.map || 'Unknown',
        gameMode: attributes.details.gameMode || 'Unknown',
        uptime: attributes.uptime,
        lastUpdated: new Date(attributes.updatedAt),
    };
}
function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (days > 0)
        parts.push(`${days}d`);
    if (hours > 0)
        parts.push(`${hours}h`);
    if (minutes > 0)
        parts.push(`${minutes}m`);
    return parts.join(' ') || '< 1m';
}
//# sourceMappingURL=battlemetrics.js.map