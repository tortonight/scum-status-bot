import fs from 'fs';
import path from 'path';
import { SetupData } from '../types';

const DATA_FILE = path.join(__dirname, '../../data/setup.json');

function ensureDataDir(): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readAll(): Record<string, SetupData> {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('❌ Failed to read data file:', error);
  }
  return {};
}

function writeAll(data: Record<string, SetupData>): void {
  ensureDataDir();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('❌ Failed to write data file:', error);
  }
}

export function getSetupData(guildId: string): SetupData | null {
  const all = readAll();
  return all[guildId] || null;
}

export function saveSetupData(guildId: string, data: SetupData): void {
  const all = readAll();
  all[guildId] = data;
  writeAll(all);
}

export function updateMessageId(guildId: string, messageId: string): void {
  const data = getSetupData(guildId);
  if (data) {
    data.messageId = messageId;
    saveSetupData(guildId, data);
  }
}